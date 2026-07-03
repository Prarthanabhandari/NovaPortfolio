const pool = require('../config/db')

const skillsUpdates = [
  {
    name: 'Python',
    description: 'An extremely versatile and powerful programming language that serves as my primary tool for backend scripting, automated workflows, and data processing. I utilize Python to build robust data analysis pipelines with Pandas and NumPy, implement core machine learning algorithms (such as SVMs, regression models, and decision trees), and write efficient automation scripts. Its clean readability allows for rapid development, making it an essential asset for solving complex computational, statistical, and algorithmic problems.'
  },
  {
    name: 'JavaScript',
    description: 'The core engine of my web development toolkit. I have a deep understanding of modern JavaScript, covering modern ES6+ features, asynchronous programming (promises, async/await), and event-driven patterns. I use it daily to engineer responsive, dynamic user interfaces on the frontend with React and to build high-performance, non-blocking APIs on the backend with Node.js. My expertise spans handling complex DOM manipulations, client-side state management, and real-time event-driven data streaming.'
  },
  {
    name: 'Java',
    description: 'A strong foundation in object-oriented programming (OOP), memory management, and robust software design. I am highly proficient in core Java concepts including multi-threading, exceptions handling, collection frameworks, and JDBC database connectivity. My academic and project experience includes writing clean, maintainable, and type-safe code for desktop and backend applications, establishing a solid engineering base that easily scales for larger systems.'
  },
  {
    name: 'Node.js',
    description: 'An asynchronous, event-driven JavaScript runtime that I leverage to build scalable and highly efficient server-side architectures. I specialize in designing non-blocking, single-threaded backend services capable of handling thousands of concurrent connections. From managing file system operations to building custom web servers and handling real-time data push configurations, Node.js allows me to write fast, modern, unified Javascript code across the entire stack.'
  },
  {
    name: 'Express.js',
    description: 'My framework of choice for constructing fast, minimalist, and robust web applications and RESTful APIs under Node.js. I have extensive experience setting up custom routing architectures, implementing secure authentication middlewares (JWT, bcrypt), handling CORS configurations, and parsing request payloads. Express allows me to build clean, modular backend codebases that interface seamlessly with relational and non-relational database layers.'
  },
  {
    name: 'React.js',
    description: 'A component-based UI library that I use to craft beautiful, high-fidelity single-page applications (SPAs). I am skilled in managing component lifecycles, using modern React Hooks (useState, useEffect, useContext, useMemo), and handling global state. I focus on writing reusable, declarative UI components, optimizing page load speeds through dynamic imports, and implementing smooth animations to deliver an engaging, premium user experience.'
  },
  {
    name: 'PostgreSQL',
    description: 'A highly reliable, open-source relational database system that I use to manage structured, transactional data. I am comfortable designing clean schemas, writing optimized SQL queries, defining foreign key constraints, and establishing indexing strategies for faster searches. From simple CRUD operations to complex multi-table joins and aggregations, PostgreSQL ensures data integrity and high performance for all my application backends.'
  },
  {
    name: 'MongoDB',
    description: 'A flexible, document-oriented NoSQL database that I use to store unstructured or rapidly changing datasets in MERN-stack applications. I design efficient, scalable schemas utilizing embedded documents and references, write complex aggregation pipelines, and manage database connections with Mongoose. Its JSON-like structure aligns perfectly with JavaScript development, allowing for fast iteration and data fetching.'
  },
  {
    name: 'Git & GitHub',
    description: 'Essential tools for version control, collaboration, and code management. I am highly comfortable with Git workflows, including branching, merging, resolving merge conflicts, and rebasing. Using GitHub, I actively participate in team code reviews, manage issues, and set up continuous integration pipelines. It ensures that my project development is tracked transparently, securely, and is easily collaborative.'
  },
  {
    name: 'RESTful APIs',
    description: 'The bridge that connects my client-side interfaces with backend databases. I specialize in designing clean, intuitive, and secure RESTful endpoints using standard HTTP methods (GET, POST, PUT, DELETE). My API development focuses on proper status code utilization, secure middleware authentication, structured JSON error handling, rate limiting, and request payload validation to ensure a seamless data flow.'
  },
  {
    name: 'Bootstrap',
    description: 'A mobile-first frontend framework that I use to speed up layout prototyping and build responsive grids. I leverage its pre-built utility classes, flexbox models, and custom components to create clean, accessible, and structured layouts that adapt flawlessly to desktops, tablets, and smartphones, ensuring a consistent user experience across all devices.'
  },
  {
    name: 'SQL & Database Design',
    description: 'The science of organizing and querying relational datasets. I have a strong grasp of database normalization (1NF, 2NF, 3NF) to eliminate redundancy, designing entity-relationship (ER) diagrams, and optimizing queries using indexes. I write complex joins, subqueries, and database transactions to ensure that structured data remains secure, integrated, and rapidly accessible.'
  },
  {
    name: 'Agile Development',
    description: 'A modern project management philosophy that guides my software development lifecycle. I believe in iterative progress, regular testing, adaptability to changing client requirements, and close team collaboration. By breaking down large goals into smaller, manageable sprint tasks, I ensure project deadlines are met consistently while maintaining clean, working code at every stage.'
  }
]

const newSkills = [
  {
    name: 'Spring Boot & Hibernate',
    icon: 'logos:spring-icon',
    description: 'An enterprise-grade Java framework that I use to build robust, secure, and production-ready microservices. I specialize in leveraging Spring MVC architectures, managing dependency injection, and implementing object-relational mapping (ORM) with Hibernate. This allows me to map Java classes directly to database tables, run efficient HQL (Hibernate Query Language) queries, manage database transactions, and construct highly scalable REST services with built-in Spring Security configurations.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Advanced Data Structures & Algorithms',
    icon: 'fluent-mdl2:flow-template',
    description: 'The algorithmic core of my software engineering capability. I have a strong command over linear data structures (stacks, queues, circularly linked lists) and non-linear structures (AVL trees, B-trees, heaps, and graphs). I specialize in implementing traversal algorithms (DFS, BFS), shortest-path algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall), and analyzing algorithm efficiency using asymptotic notations to design high-performance, resource-optimized code.',
    proficiency_level: 'Advanced',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Data Science & Analytics',
    icon: 'carbon:analytics',
    description: 'Extracting meaningful business insights from complex datasets. I write clean Python code using Pandas, NumPy, and SciPy to clean, normalize, and format raw data, handle missing values, and build statistical pipelines. My analytical skillset covers descriptive statistics, ANOVA, regression modeling (linear and multivariate), SVMs, Naive Bayes classification, and creating interactive data visualizations to tell stories with data.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Cloud Computing & AWS',
    icon: 'logos:aws',
    description: 'Deploying and scaling web applications in cloud environments. I understand cloud deployment models (SaaS, PaaS, IaaS) and architectures. My practical knowledge includes setting up virtualization tools, deploying web servers to cloud platforms like Amazon Web Services (AWS) and Google App Engine (GAE), managing identity and access policies (IAM), and designing risk-management frameworks to ensure cloud data remains secure, compliant, and highly available.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Mobile Application Development',
    icon: 'logos:android-icon',
    description: 'Designing and building native mobile applications. I have hands-on experience with the Android SDK, managing Android application structures (activities, services, lifecycle methods, and intents), and crafting responsive mobile layouts. I integrate local databases using SQLite, use the Android Debug Bridge (adb) for testing, handle system notifications, and deploy functioning mobile apps onto real hand-held devices.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Linux & Network Programming',
    icon: 'logos:linux-tux',
    description: 'A comprehensive skillset covering Unix/Linux shell scripting (Bash), file systems (inodes, permissions), and network communication. I write C and Java programs implementing socket programming (TCP/UDP), handle signal generation, and utilize Inter-Process Communication (IPC) techniques such as pipes, FIFOs, message queues, semaphores, and shared memory to build high-performance multi-threaded servers.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Software Architecture & Design Patterns',
    icon: 'mdi:sitemap-outline',
    description: 'Designing large-scale software systems with a strong focus on quality, modularity, and maintainability. I understand principal architectural patterns like MVC, microservices, and client-server models. I partition systems into reusable components, select appropriate connectors, document system designs using UML, and evaluate performance, security, and scalability trade-offs during the design lifecycle.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Artificial Intelligence & Machine Learning',
    icon: 'carbon:machine-learning-model',
    description: 'Building intelligent systems that learn from data and simulate human decision-making. I have hands-on academic experience implementing search techniques, logic programming, and knowledge representation. I implement core predictive algorithms including classification models, regression, Support Vector Machines (SVM), and clustering models using Python libraries, carefully evaluating model performance to prevent overfitting.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Cyber Security & Ethical Hacking',
    icon: 'carbon:security-shield',
    description: 'Securing web applications and network infrastructures against modern security threats and vulnerabilities. I understand cryptographic principles, network defense strategies, and security protocols. My knowledge covers identifying common web vulnerabilities (such as SQL injection, XSS, and broken authentication), implementing secure coding standards, and applying encryption methods to protect data.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Software Testing & Quality Assurance',
    icon: 'mdi:clipboard-check-outline',
    description: 'Ensuring software correctness, reliability, and robust performance through structured testing. I design test plans, create manual and automated test cases, and execute unit, integration, system, and regression tests. I utilize debugging tools, track software defects, and apply quality assurance metrics to verify that the final product satisfies all functional and user requirements.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  },
  {
    name: 'Research Methodology & Intellectual Property Rights (IPR)',
    icon: 'mdi:file-certificate-outline',
    description: 'An academic discipline focused on scientific inquiry, literature review, and legal frameworks of innovation. I understand how to formulate research problems, design experiments, analyze statistical data using ANOVA and regression, and write technical reports. I also have a strong grasp of Intellectual Property Rights (IPR) including patent application filing, copyrights, and trademark laws.',
    proficiency_level: 'Intermediate',
    organization: "SNDT Women's University",
    is_featured: true
  }
]

async function run() {
  try {
    console.log('🔄 Starting database update...')
    
    // Perform column migrations
    console.log('⚙️ Migrating database columns to larger VARCHAR sizes...')
    await pool.query('ALTER TABLE skills ALTER COLUMN name TYPE VARCHAR(255);')
    await pool.query('ALTER TABLE skills ALTER COLUMN icon TYPE VARCHAR(255);')
    await pool.query('ALTER TABLE skills ALTER COLUMN proficiency_level TYPE VARCHAR(255);')
    await pool.query('ALTER TABLE skills ALTER COLUMN organization TYPE VARCHAR(255);')
    console.log('⚙️ Column migrations complete.')

    // Update existing
    for (const skill of skillsUpdates) {
      const res = await pool.query(
        'UPDATE skills SET description = $1 WHERE name = $2 RETURNING id',
        [skill.description, skill.name]
      )
      if (res.rowCount > 0) {
        console.log(`✅ Updated existing skill: ${skill.name}`)
      } else {
        console.log(`⚠️ Existing skill not found in database: ${skill.name}`)
      }
    }

    // Insert new ones if they don't exist
    for (const skill of newSkills) {
      const check = await pool.query('SELECT id FROM skills WHERE name = $1', [skill.name])
      if (check.rowCount === 0) {
        await pool.query(
          'INSERT INTO skills (name, icon, description, proficiency_level, organization, is_featured) VALUES ($1, $2, $3, $4, $5, $6)',
          [skill.name, skill.icon, skill.description, skill.proficiency_level, skill.organization, skill.is_featured]
        )
        console.log(`➕ Added new MCA skill: ${skill.name}`)
      } else {
        await pool.query(
          'UPDATE skills SET icon = $1, description = $2, proficiency_level = $3, organization = $4, is_featured = $5 WHERE name = $6',
          [skill.icon, skill.description, skill.proficiency_level, skill.organization, skill.is_featured, skill.name]
        )
        console.log(`✅ Updated MCA skill: ${skill.name}`)
      }
    }

    console.log('🎉 Database update complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error executing database update:', err.message)
    process.exit(1)
  }
}

run()
