import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { FaReact, FaNode, FaHtml5, FaCss3, FaJs, FaPython, FaJava, FaPhp, FaGitAlt, FaDocker, FaAws } from 'react-icons/fa'
import { SiPostgresql, SiMongodb, SiMysql, SiRedis, SiTailwindcss, SiVuedotjs, SiAngular, SiGraphql, SiFirebase, SiExpress } from 'react-icons/si'
import { FiX, FiCalendar, FiAward, FiFileText, FiMaximize2, FiMinimize2 } from 'react-icons/fi'
import api from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import useWindowSize from '../../hooks/useWindowSize'
import { marked } from 'marked'

const techIcons = {
  'React': <FaReact size={12} color="#61dafb" />,
  'Node.js': <FaNode size={12} color="#68a063" />,
  'JavaScript': <FaJs size={12} color="#f7df1e" />,
  'TypeScript': <FaJs size={12} color="#3178c6" />,
  'Python': <FaPython size={12} color="#3776ab" />,
  'Java': <FaJava size={12} color="#007396" />,
  'PHP': <FaPhp size={12} color="#777bb4" />,
  'Express.js': <SiExpress size={12} color="#000" />,
  'PostgreSQL': <SiPostgresql size={12} color="#336791" />,
  'MongoDB': <SiMongodb size={12} color="#4db33d" />,
  'MySQL': <SiMysql size={12} color="#00758f" />,
  'Redis': <SiRedis size={12} color="#dc382d" />,
  'HTML5': <FaHtml5 size={12} color="#e34f26" />,
  'CSS3': <FaCss3 size={12} color="#264de4" />,
  'Tailwind CSS': <SiTailwindcss size={12} color="#06b6d4" />,
  'Vue.js': <SiVuedotjs size={12} color="#4fc08d" />,
  'Angular': <SiAngular size={12} color="#dd0031" />,
  'GraphQL': <SiGraphql size={12} color="#e10098" />,
  'Firebase': <SiFirebase size={12} color="#ffa000" />,
  'Docker': <FaDocker size={12} color="#2496ed" />,
  'Git': <FaGitAlt size={12} color="#f1502f" />,
  'AWS': <FaAws size={12} color="#ff9900" />,
}

const Projects = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const closeModal = () => {
    setSelectedProject(null)
    setIsMaximized(false)
    setActiveImageIndex(0)
  }

  const getTechArray = (tech) => {
    if (!tech) return []
    if (Array.isArray(tech)) return tech
    if (typeof tech === 'string') {
      try {
        const parsed = JSON.parse(tech)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {}
      return tech.split(',').map(t => t.trim()).filter(Boolean)
    }
    return []
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects/featured')
        setProjects(res.data)
      } catch (err) {
        console.log('Failed to fetch projects')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>

  const getPlainSnippet = (text, length = 80) => {
    if (!text) return ''
    let plain = text
      .replace(/<[^>]*>/g, '') // strip HTML tags completely
      .replace(/#+\s+/g, '') // headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // images
      .replace(/`([^`]+)`/g, '$1') // inline code
      .replace(/\*\*|__/g, '') // bold
      .replace(/\*|_/g, '') // italic
      .replace(/>\s+.*$/gm, '') // blockquotes
      .replace(/[\r\n]+/g, ' ') // replace newlines/carriage returns with space
      .replace(/\s+/g, ' ') // collapse multiple spaces to one
      .trim()
    return plain.length > length ? plain.substring(0, length) + '...' : plain
  }

  return (
    <section id="projects" style={{
      padding: isMobile ? '3rem 1rem' : '80px 2rem',
      background: isPro ? '#ffffff' : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: isMobile ? '1rem' : '0',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              background: isPro ? 'rgba(37,99,235,0.08)' : 'rgba(255,97,210,0.12)',
              color: isPro ? '#2563eb' : '#c026d3',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.3rem 1rem', borderRadius: '2rem',
              marginBottom: '0.8rem'
            }}>
              My Projects
            </div>
            <h2 style={{
              fontSize: '2rem', fontWeight: 800,
              color: isPro ? '#0f172a' : '#1e1b4b',
              margin: 0
            }}>
              {isPro ? 'Featured Work' : 'Things I have built'}
            </h2>
          </div>

          <a 
            href="/projects"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isPro ? '#2563eb' : '#a78bfa',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            View All →
          </a>
        </div>

        {/* Project Grid - Small cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {projects.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              No featured projects yet. Mark some projects as featured from admin!
            </div>
          ) : (
            projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => { setSelectedProject(project); setActiveImageIndex(0); }}
                style={{
                  background: isPro ? '#fff' : 'rgba(255,255,255,0.9)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.8)',
                  boxShadow: isPro ? '0 4px 20px rgba(0,0,0,0.06)' : '0 8px 32px rgba(168,85,247,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Project Image */}
                <div style={{
                  height: '180px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      style={{
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }} 
                    />
                  ) : (
                    <div style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: '100%', fontSize: '3rem', color: '#fff', fontWeight: 700 
                    }}>
                      {project.title.substring(0, 1)}
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1rem'
                  }}>
                    <span style={{
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '2rem',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      Click to view details →
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.2rem' }}>
                  <h3 style={{
                    fontSize: '1rem', fontWeight: 700,
                    color: isPro ? '#0f172a' : '#1e1b4b',
                    marginBottom: '0.5rem',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {project.title}
                  </h3>

                  {/* SHORT description */}
                  <p style={{
                    fontSize: '0.8rem', lineHeight: 1.5,
                    color: isPro ? '#64748b' : '#6b7280',
                    marginBottom: '0.8rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '2.4rem'
                  }}>
                    {getPlainSnippet(project.description, 80)}
                  </p>

                  {/* Tech badges (limit to 3) */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {getTechArray(project.technologies).slice(0, 3).map((tech, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.7rem', fontWeight: 600,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '1rem',
                        background: isPro ? 'rgba(99,102,241,0.1)' : 'rgba(168,85,247,0.1)',
                        color: isPro ? '#6366f1' : '#a855f7',
                        display: 'flex', alignItems: 'center', gap: '0.3rem'
                      }}>
                        {techIcons[tech]}
                        {tech}
                      </span>
                    ))}
                    {getTechArray(project.technologies).length > 3 && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '1rem',
                        background: '#f1f5f9',
                        color: '#64748b'
                      }}>
                        +{getTechArray(project.technologies).length - 3}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div style={{
                    display: 'flex', gap: '1rem',
                    paddingTop: '0.8rem',
                    marginTop: '0.8rem',
                    borderTop: `1px solid ${isPro ? '#f1f5f9' : 'rgba(167,139,250,0.1)'}`
                  }}>
                    {project.live_link && (
                      <a href={project.live_link} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          color: isPro ? '#3b82f6' : '#a78bfa',
                          fontWeight: 600, fontSize: '0.75rem',
                          textDecoration: 'none'
                        }}>
                        <FaExternalLinkAlt size={11} /> Live
                      </a>
                    )}
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          color: isPro ? '#3b82f6' : '#a78bfa',
                          fontWeight: 600, fontSize: '0.75rem',
                          textDecoration: 'none'
                        }}>
                        <FaGithub size={11} /> GitHub
                      </a>
                    )}
                    {project.document_url && (
                      <a href={project.document_url} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          color: '#10b981',
                          fontWeight: 600, fontSize: '0.75rem',
                          textDecoration: 'none'
                        }}>
                        <FiFileText size={11} /> Doc
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* DETAILED PROJECT MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: isMaximized ? '0' : '1rem',
              overflowY: 'auto'
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: isMaximized ? '0px' : '24px',
                maxWidth: isMaximized ? '100vw' : '850px',
                width: '100%',
                maxHeight: isMaximized ? '100vh' : '90vh',
                height: isMaximized ? '100vh' : 'auto',
                overflowY: 'auto',
                boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
                position: 'relative',
                margin: 'auto',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Maximize/Minimize Button */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '4.2rem',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                {isMaximized ? <FiMinimize2 size={18} color="#64748b" /> : <FiMaximize2 size={18} color="#64748b" />}
              </button>

              {/* Close Button */}
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.95)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <FiX size={20} color="#64748b" />
              </button>

              {/* Styled Browser Mockup Wrapper */}
              <div style={{
                background: isPro ? '#f8fafc' : '#f5f3ff',
                padding: isMobile ? '0.75rem' : '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: `1px solid ${isPro ? '#e2e8f0' : 'rgba(167,139,250,0.1)'}`
              }}>
                <div style={{
                  width: '100%',
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.02)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Browser Header Bar */}
                  <div style={{
                    background: '#f1f5f9',
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    position: 'relative'
                  }}>
                    {/* Window Controls */}
                    <div style={{ display: 'flex', gap: '0.4rem', position: 'absolute', left: '1rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                    </div>
                    {/* Address Bar */}
                    <div style={{
                      flexGrow: 1,
                      background: '#fff',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      padding: '0.2rem 0.8rem',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      maxWidth: '450px',
                      margin: '0 auto',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: 'monospace'
                    }}>
                      {selectedProject.live_link || `https://github.com/prarthanabhandari/${selectedProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    </div>
                  </div>

                  {/* Screenshot Content */}
                  <div style={{
                    maxHeight: isMaximized ? 'calc(100vh - 160px)' : (isMobile ? '280px' : '480px'),
                    background: '#fff',
                    overflowY: 'auto',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {([selectedProject.image_url, ...(selectedProject.images || [])].filter(Boolean)).length > 0 ? (
                      <div style={{ position: 'relative', width: '100%' }}>
                        <img 
                          src={([selectedProject.image_url, ...(selectedProject.images || [])].filter(Boolean))[activeImageIndex]} 
                          alt={`${selectedProject.title} screenshot ${activeImageIndex + 1}`}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                        />
                        {([selectedProject.image_url, ...(selectedProject.images || [])].filter(Boolean)).length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const imgs = [selectedProject.image_url, ...(selectedProject.images || [])].filter(Boolean);
                                setActiveImageIndex(prev => (prev === 0 ? imgs.length - 1 : prev - 1));
                              }}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '1rem',
                                transform: 'translateY(-50%)',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.85)',
                                border: '1px solid #e2e8f0',
                                color: '#1f2937',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                zIndex: 10,
                                transition: 'all 0.2s'
                              }}
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const imgs = [selectedProject.image_url, ...(selectedProject.images || [])].filter(Boolean);
                                setActiveImageIndex(prev => (prev === imgs.length - 1 ? 0 : prev + 1));
                              }}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: '1rem',
                                transform: 'translateY(-50%)',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.85)',
                                border: '1px solid #e2e8f0',
                                color: '#1f2937',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                zIndex: 10,
                                transition: 'all 0.2s'
                              }}
                            >
                              →
                            </button>
                            <div style={{
                              position: 'absolute',
                              bottom: '1rem',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              display: 'flex',
                              gap: '0.5rem',
                              background: 'rgba(0,0,0,0.5)',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '2rem',
                              zIndex: 10
                            }}>
                              {([selectedProject.image_url, ...(selectedProject.images || [])].filter(Boolean)).map((_, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: activeImageIndex === idx ? '#fff' : 'rgba(255,255,255,0.5)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        height: isMobile ? '200px' : '380px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                        color: '#cbd5e1'
                      }}>
                        💻
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: isMobile ? '1.2rem' : '2rem' }}>
                {/* Title */}
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '0.5rem',
                  margin: '0 0 0.5rem 0'
                }}>
                  {selectedProject.title}
                </h2>

                {/* Date */}
                {(selectedProject.start_date || selectedProject.end_date) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    marginBottom: '1.5rem'
                  }}>
                    <FiCalendar size={14} />
                    {selectedProject.start_date && new Date(selectedProject.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {selectedProject.end_date && ` - ${new Date(selectedProject.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  </div>
                )}

                {/* Tech Stack */}
                {getTechArray(selectedProject.technologies).length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.6rem'
                    }}>
                      Tech Stack
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {getTechArray(selectedProject.technologies).map((tech, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          padding: '0.4rem 0.9rem',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(99,102,241,0.1))',
                          color: '#7c3aed',
                          border: '1px solid rgba(168,85,247,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}>
                          {techIcons[tech]}
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.6rem'
                  }}>
                    About Project
                  </h4>
                  <div 
                    className="markdown-body"
                    dangerouslySetInnerHTML={{ __html: marked.parse(selectedProject.description || '') }}
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      color: '#475569',
                      margin: 0
                    }}
                  />
                </div>

                {/* Achievements */}
                {selectedProject.achievements && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <FiAward size={14} /> Key Achievements
                    </h4>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid rgba(245,158,11,0.2)'
                    }}>
                      <p style={{
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        color: '#475569',
                        margin: 0
                      }}>
                        {selectedProject.achievements}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '0.8rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  {selectedProject.live_link && (
                    <a 
                      href={selectedProject.live_link} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        color: '#fff',
                        padding: '0.7rem 1.5rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 12px rgba(124,58,237,0.3)'
                      }}
                    >
                      <FaExternalLinkAlt size={12} /> View Live
                    </a>
                  )}
                  {selectedProject.github_link && (
                    <a 
                      href={selectedProject.github_link} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#1f2937',
                        color: '#fff',
                        padding: '0.7rem 1.5rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      <FaGithub size={14} /> View Code
                    </a>
                  )}
                  {selectedProject.document_url && (
                    <a 
                      href={selectedProject.document_url} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#10b981',
                        color: '#fff',
                        padding: '0.7rem 1.5rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                      }}
                    >
                      <FiFileText size={14} /> View Document
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects