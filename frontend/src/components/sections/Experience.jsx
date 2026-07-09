import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import api from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import { FiMapPin, FiBriefcase, FiFileText, FiAward, FiX, FiDownload } from 'react-icons/fi'
import useWindowSize from '../../hooks/useWindowSize'

const Experience = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(null)

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await api.get('/experience')
        setExperiences(res.data)
      } catch (err) {
        console.log('Failed to fetch experience')
      } finally {
        setLoading(false)
      }
    }
    fetchExperience()
  }, [])

  if (loading || experiences.length === 0) return null

  const isPDF = (url) => url && url.toLowerCase().endsWith('.pdf')

  return (
    <section id="experience" style={{
      padding: isMobile ? '3rem 1rem' : '80px 2rem',
      background: isPro ? '#ffffff' : 'linear-gradient(135deg, #f0f4ff 0%, #fdf4ff 100%)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-block',
            background: isPro ? 'rgba(37,99,235,0.08)' : 'rgba(167,139,250,0.12)',
            color: isPro ? '#2563eb' : '#a78bfa',
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '0.3rem 1rem', borderRadius: '2rem',
            marginBottom: '0.8rem'
          }}>
            <FiBriefcase style={{ display: 'inline', marginRight: '0.4rem' }} />
            Experience
          </div>
          <h2 style={{
            fontSize: '2.5rem', fontWeight: 800,
            color: isPro ? '#0f172a' : '#1e1b4b',
            margin: '0 0 0.5rem 0'
          }}>
            Professional Journey
          </h2>
          <p style={{ fontSize: '1rem', color: '#94a3b8', margin: 0 }}>
            My career milestones and achievements
          </p>
        </div>

        <div style={{ position: 'relative', paddingLeft: isMobile ? '1rem' : '2rem' }}>
          <div style={{
            position: 'absolute', left: isMobile ? '7px' : '11px', top: '8px', bottom: '8px',
            width: '2px',
            background: isPro 
              ? 'linear-gradient(180deg, #2563eb, #a78bfa)' 
              : 'linear-gradient(180deg, #a78bfa, #f0abfc)'
          }} />

          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                position: 'relative',
                marginBottom: '2rem',
                paddingLeft: isMobile ? '1.2rem' : '2rem'
              }}
            >
              <div style={{
                position: 'absolute',
                left: isMobile ? '-1.2rem' : '-2rem',
                top: '8px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: isPro 
                  ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
                  : 'linear-gradient(135deg, #a78bfa, #f0abfc)',
                border: '3px solid #fff',
                boxShadow: '0 0 0 2px rgba(167,139,250,0.3)',
                zIndex: 1
              }} />

              <motion.div
                whileHover={{ x: 8, scale: 1.01 }}
                style={{
                  background: isPro ? '#fff' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  padding: isMobile ? '1rem' : '1.8rem',
                  border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.8)',
                  boxShadow: isPro 
                    ? '0 4px 20px rgba(0,0,0,0.06)' 
                    : '0 8px 32px rgba(167,139,250,0.12)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '1rem',
                  alignItems: isMobile ? 'flex-start' : 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    background: '#fff',
                    border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    flexShrink: 0
                  }}>
                    {exp.image_url ? (
                      <img src={exp.image_url} alt={exp.company} style={{
                        maxWidth: '100%', height: '100%', objectFit: 'contain'
                      }} />
                    ) : exp.icon ? (
                      <Icon icon={exp.icon} width="36" height="36" style={{ color: isPro ? '#2563eb' : '#a78bfa' }} />
                    ) : (
                      <FiBriefcase size={28} color={isPro ? '#2563eb' : '#a78bfa'} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      marginBottom: '0.3rem',
                      flexWrap: 'wrap'
                    }}>
                      <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: isPro ? '#0f172a' : '#1e1b4b',
                        margin: 0,
                        lineHeight: 1.3
                      }}>
                        {exp.job_title}
                      </h3>
                      {exp.is_current && (
                        <span style={{
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.7rem',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap'
                        }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: isPro ? '#2563eb' : '#a78bfa',
                      margin: '0 0 0.4rem 0'
                    }}>
                      {exp.company}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      fontSize: '0.8rem',
                      color: '#94a3b8'
                    }}>
                      {exp.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FiMapPin size={12} /> {exp.location}
                        </span>
                      )}
                      <span style={{ fontWeight: 600 }}>
                        {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.end_date 
                          ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                          : 'Present'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <p style={{
                    fontSize: '0.92rem',
                    color: isPro ? '#64748b' : '#6b7280',
                    lineHeight: 1.7,
                    margin: '0 0 1rem 0',
                    paddingTop: '0.8rem',
                    borderTop: '1px solid ' + (isPro ? '#f1f5f9' : 'rgba(167,139,250,0.1)')
                  }}>
                    {exp.description}
                  </p>
                )}

                {(exp.offer_letter || exp.completion_certificate) && (
                  <div style={{
                    display: 'flex',
                    gap: '0.8rem',
                    flexWrap: 'wrap',
                    paddingTop: '0.8rem',
                    borderTop: '1px solid ' + (isPro ? '#f1f5f9' : 'rgba(167,139,250,0.1)')
                  }}>
                    {exp.offer_letter && (
                      <button
                        onClick={() => setSelectedDoc({ url: exp.offer_letter, title: 'Offer Letter', company: exp.company })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                          color: '#fff',
                          border: 'none',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '10px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                        }}
                      >
                        <FiFileText size={14} /> View Offer Letter
                      </button>
                    )}
                    {exp.completion_certificate && (
                      <button
                        onClick={() => setSelectedDoc({ url: exp.completion_certificate, title: 'Completion Certificate', company: exp.company })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: '#fff',
                          border: 'none',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '10px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
                        }}
                      >
                        <FiAward size={14} /> View Certificate
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedDoc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedDoc(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '95%',
              maxHeight: '95vh',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                  {selectedDoc.title}
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                  {selectedDoc.company}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={selectedDoc.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  <FiDownload size={14} /> Download
                </a>
                <button
                  onClick={() => setSelectedDoc(null)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    border: 'none',
                    width: '36px', height: '36px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <div style={{
              flex: 1,
              overflow: 'auto',
              minHeight: '500px',
              minWidth: '300px',
              maxHeight: '80vh',
              background: '#f8fafc'
            }}>
              {isPDF(selectedDoc.url) ? (
                <iframe
                  src={selectedDoc.url}
                  title={selectedDoc.title}
                  style={{
                    width: '100%',
                    height: '80vh',
                    border: 'none'
                  }}
                />
              ) : (
                <img
                  src={selectedDoc.url}
                  alt={selectedDoc.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default Experience