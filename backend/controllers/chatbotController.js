const pool = require('../config/db')

exports.handleMessage = async (req, res) => {
  const { message } = req.body
  if (!message) {
    return res.status(400).json({ reply: "Please provide a message." })
  }

  const cleanMsg = message.toLowerCase().trim()
  
  try {
    // 1. GREETINGS & ABOUT
    if (cleanMsg.match(/\b(hi|hello|hey|greetings|hola|who are you|about|yourself|name)\b/)) {
      const settingsRes = await pool.query("SELECT key, value FROM site_settings")
      const settings = {}
      settingsRes.rows.forEach(row => {
        settings[row.key] = row.value
      })
      const title = settings.hero_title || "Prarthana Bhandari"
      const about = settings.about_text || "I am a passionate Full Stack Developer who loves building web applications."
      const subtitle = settings.hero_subtitle || "Full Stack Developer"
      
      return res.json({
        reply: `👋 Hello there! I'm the digital assistant for **${title}** (${subtitle}).\n\n${about}\n\nI can help you find details about my skills, projects, certifications, or work experience. Try asking me:\n\n* 🛠️ *"Do you know React?"*\n* 📂 *"Show me your projects!"*\n* 💼 *"Tell me about your internship experience."*`
      })
    }

    // 2. SKILLS SEARCH
    const skillList = [
      'python', 'javascript', 'java', 'node', 'express', 'react', 'postgres', 
      'mongodb', 'git', 'api', 'bootstrap', 'sql', 'agile', 'spring', 'hibernate', 
      'data structure', 'algorithm', 'data science', 'cloud', 'aws', 'mobile', 'android',
      'linux', 'network', 'architecture', 'design pattern', 'artificial intelligence', 
      'machine learning', 'cyber security', 'ethical hacking', 'testing', 'qa', 'research', 'ipr'
    ]

    const matchedSkill = skillList.find(s => cleanMsg.includes(s))
    
    if (cleanMsg.match(/\b(skills|technologies|languages|tools|proficiency)\b/) || (matchedSkill && cleanMsg.match(/\b(know|use|experience|learn|studies|study|skill)\b/))) {
      if (matchedSkill) {
        // Find specific skill
        const queryStr = `
          SELECT name, description, proficiency_level, organization 
          FROM skills 
          WHERE LOWER(name) LIKE $1
        `
        const skillRes = await pool.query(queryStr, [`%${matchedSkill}%`])
        
        if (skillRes.rowCount > 0) {
          const skill = skillRes.rows[0]
          return res.json({
            reply: `💡 **${skill.name}**\n\n* **Proficiency:** ${skill.proficiency_level || 'Intermediate'}\n* **Organization/Issuer:** ${skill.organization || 'SNDT Women\'s University'}\n\n${skill.description}`
          })
        }
      }

      // Fallback: list all featured skills
      const allSkills = await pool.query("SELECT name, proficiency_level FROM skills ORDER BY is_featured DESC, name ASC")
      const skillListStr = allSkills.rows.map(s => `* **${s.name}** (${s.proficiency_level})`).join('\n')
      
      return res.json({
        reply: `🛠️ **My Technical Skills:**\n\nHere are some of the key technologies I work with:\n\n${skillListStr}\n\nAsk me about a specific skill (e.g. *"Tell me about your Spring Boot experience"*) to learn more!`
      })
    }

    // 3. PROJECTS SEARCH
    if (cleanMsg.match(/\b(projects|project|built|made|portfolio|github|code|repository|develop)\b/) || matchedSkill) {
      // If they asked about a specific skill, find projects that use it
      const techKeyword = matchedSkill || cleanMsg.replace(/show|me|projects|built|with|using/g, '').trim()
      
      let projRes
      let isSpecificTech = false
      
      if (techKeyword.length > 2) {
        // Query projects matching technology
        projRes = await pool.query(
          `SELECT title, description, technologies, github_link, live_link 
           FROM projects 
           WHERE LOWER(ARRAY_TO_STRING(technologies, ',')) LIKE $1 
           OR LOWER(title) LIKE $1`,
          [`%${techKeyword}%`]
        )
        if (projRes.rowCount > 0) {
          isSpecificTech = true
        }
      }

      // Default: featured projects
      if (!projRes || projRes.rowCount === 0) {
        projRes = await pool.query(
          "SELECT title, description, technologies, github_link, live_link FROM projects WHERE is_featured = true"
        )
      }

      const projectsList = projRes.rows.map(p => {
        const techStr = p.technologies ? p.technologies.join(', ') : ''
        const github = p.github_link ? `[GitHub Code](${p.github_link})` : ''
        const live = p.live_link ? `[Live Demo](${p.live_link})` : ''
        const links = [github, live].filter(Boolean).join(' | ')
        return `📁 **${p.title}**\n*Tech Stack: ${techStr}*\n${p.description}\n${links ? links + '\n' : ''}`
      }).join('\n')

      const titleHeader = isSpecificTech 
        ? `📂 **Projects utilizing "${techKeyword}":**` 
        : `📂 **Featured Projects:**`

      return res.json({
        reply: `${titleHeader}\n\n${projectsList}`
      })
    }

    // 4. EXPERIENCE SEARCH
    if (cleanMsg.match(/\b(experience|work|job|intern|internship|company|codec|graphura|timeline)\b/)) {
      const expRes = await pool.query(
        "SELECT job_title, company, location, description, start_date, end_date, is_current FROM experience ORDER BY start_date DESC"
      )
      
      if (expRes.rowCount > 0) {
        const expList = expRes.rows.map(e => {
          const startDate = new Date(e.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          const endDate = e.is_current ? 'Present' : new Date(e.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          return `💼 **${e.job_title}** at **${e.company}** (${e.location || 'Remote'})\n*📅 ${startDate} - ${endDate}*\n${e.description}\n`
        }).join('\n')
        
        return res.json({
          reply: `💼 **My Work & Internship Experience:**\n\n${expList}`
        })
      } else {
        return res.json({
          reply: "I am currently focused on my academic projects and am open to internship and full-time software developer opportunities!"
        })
      }
    }

    // 5. CERTIFICATES SEARCH
    if (cleanMsg.match(/\b(certificates|certification|certified|courses|course|credentials)\b/)) {
      const certRes = await pool.query(
        "SELECT title, platform, issued_date, credential_url FROM certificates ORDER BY issued_date DESC"
      )
      
      if (certRes.rowCount > 0) {
        const certList = certRes.rows.map(c => {
          const issueDate = new Date(c.issued_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          const link = c.credential_url ? `[Verify Credential](${c.credential_url})` : ''
          return `🏆 **${c.title}**\n*Platform: ${c.platform} | Issued: ${issueDate}*\n${link ? link + '\n' : ''}`
        }).join('\n')
        
        return res.json({
          reply: `🏆 **Professional Certifications:**\n\n${certList}`
        })
      } else {
        return res.json({
          reply: "I've completed several bootcamp and specialized courses in Full-Stack Web Development, Data Science, and Java."
        })
      }
    }

    // 5b. BLOGS SEARCH
    if (cleanMsg.match(/\b(blog|blogs|video|videos|youtube|article|articles|write|writing)\b/)) {
      const blogRes = await pool.query(
        "SELECT id, title, category, video_url FROM blogs WHERE is_published = true ORDER BY created_at DESC"
      )
      
      if (blogRes.rowCount > 0) {
        const blogList = blogRes.rows.map(b => {
          const type = b.video_url ? '🎥 Video' : '✍️ Blog'
          return `* **${b.title}** (${b.category || 'General'}) - ${type} [Read/Watch](/blogs/${b.id})`
        }).join('\n')
        
        return res.json({
          reply: `✍️ **My Blog Articles:**\n\nI share insights, tutorials, and video walk-throughs about my engineering work. Here are some of my articles:\n\n${blogList}\n\nYou can browse all articles on the [Blog Page](/blogs) page!`
        })
      } else {
        return res.json({
          reply: "I am setting up my personal blog section where I'll write about software engineering, web development, and my MCA projects! Stay tuned, or check out the [Blog Page](/blogs) page!"
        })
      }
    }

    // 6. CONTACT INFO
    if (cleanMsg.match(/\b(contact|email|phone|call|address|location|hire|reach)\b/)) {
      const socialRes = await pool.query("SELECT platform, url FROM social_links")
      const socials = socialRes.rows.map(s => `* [${s.platform.toUpperCase()}](${s.url})`).join('\n')
      
      return res.json({
        reply: `📞 **Get in Touch:**\n\nYou can reach me by filling out the contact form directly on the homepage, or via my social profiles:\n\n${socials}\n\nLet's connect and discuss collaboration opportunities!`
      })
    }

    // 7. FALLBACK / HELP
    return res.json({
      reply: `🤔 I'm not sure I fully understood that. \n\nI can answer questions regarding Prarthana's portfolio details from the database. Try asking:\n\n* 🛠️ *"What skills do you have?"*\n* 📂 *"Show me your React projects"* \n* 💼 *"Tell me about your work experience"* \n* 🏆 *"What certifications do you hold?"* \n* 📞 *"How can I contact you?"*`
    })

  } catch (err) {
    console.error("Chatbot Error:", err)
    return res.status(500).json({ reply: "Sorry, I encountered an error retrieving data." })
  }
}
