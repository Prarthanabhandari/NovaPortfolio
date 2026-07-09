import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useWindowSize from '../hooks/useWindowSize'

const SkillsPage = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills')
        setSkills(res.data)
      } catch (err) {
        console.log('Failed to fetch skills')
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
        Loading skills...
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{
        padding: isMobile ? '100px 1rem 40px' : '120px 2rem 60px',
        background: isPro ? '#ffffff' : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', border: 'none',
              color: isPro ? '#3b82f6' : '#a78bfa',
              fontWeight: 600, fontSize: '1rem',
              cursor: 'pointer', marginBottom: '1rem'
            }}
          >
            <FiArrowLeft size={20} /> Back to Home
          </button>

          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.5rem', fontWeight: 800,
              color: isPro ? '#0f172a' : '#1e1b4b',
              margin: '0 0 0.5rem 0'
            }}>
              My Technical Skills
            </h1>
            <p style={{ fontSize: '1rem', color: '#94a3b8' }}>
              {skills.length} skills and technologies • Click any skill for details
            </p>
          </div>

          {/* Skills Grid */}
          {skills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              No skills added yet
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.5rem'
            }}>
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
                  onClick={() => setSelectedSkill(skill)}
                  style={{
                    background: isPro ? '#fff' : 'rgba(255,255,255,0.95)',
                    borderRadius: '20px', padding: '1.8rem',
                    border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Icon */}
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
                    margin: '0 auto 1rem auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                  }}>
                    {skill.image_url ? (
                      <img 
                        src={skill.image_url} 
                        alt={skill.name} 
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }} 
                      />
                    ) : skill.icon ? (
                      <Icon icon={skill.icon} width="36" height="36" style={{ color: isPro ? '#3b82f6' : '#a78bfa' }} />
                    ) : (
                      <div style={{ fontSize: '2rem' }}>🔧</div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 style={{
                    fontWeight: 700, fontSize: '1.1rem',
                    color: isPro ? '#0f172a' : '#1e1b4b',
                    margin: '0 0 0.4rem 0'
                  }}>
                    {skill.name}
                  </h3>

                  {/* Proficiency Badge */}
                  <span style={{
                    display: 'inline-block',
                    background: isPro ? 'rgba(59,130,246,0.1)' : 'rgba(167,139,250,0.15)',
                    color: isPro ? '#3b82f6' : '#a78bfa',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {skill.proficiency_level || 'Intermediate'}
                  </span>

                  {/* Organization */}
                  {skill.organization && (
                    <p style={{
                      fontSize: '0.75rem', color: '#94a3b8',
                      margin: '0.8rem 0 0 0'
                    }}>
                      {skill.organization}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Skill Detail Modal */}
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedSkill(null)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 1000,
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: '24px',
                padding: '2.5rem', maxWidth: '500px',
                width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setSelectedSkill(null)}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: '#f1f5f9', border: 'none',
                  width: '36px', height: '36px',
                  borderRadius: '50%', cursor: 'pointer',
                  fontSize: '1.2rem', color: '#64748b'
                }}
              >
                ✕
              </button>

              <div style={{
                display: 'flex', justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '20px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
                }}>
                  {selectedSkill.image_url ? (
                    <img 
                      src={selectedSkill.image_url} 
                      alt={selectedSkill.name} 
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }} 
                    />
                  ) : selectedSkill.icon ? (
                    <Icon icon={selectedSkill.icon} width="56" height="56" style={{ color: '#7c3aed' }} />
                  ) : (
                    <div style={{ fontSize: '3rem' }}>🔧</div>
                  )}
                </div>
              </div>

              <h2 style={{
                fontSize: '1.8rem', fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 0.5rem 0',
                textAlign: 'center'
              }}>
                {selectedSkill.name}
              </h2>

              <div style={{
                display: 'flex', justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <span style={{
                  background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                  color: '#fff',
                  padding: '0.4rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {selectedSkill.proficiency_level || 'Intermediate'}
                </span>
              </div>

              {selectedSkill.description && (
                <p style={{
                  fontSize: '0.95rem', color: '#64748b',
                  lineHeight: 1.6,
                  margin: '0 0 1rem 0',
                  textAlign: 'center'
                }}>
                  {selectedSkill.description}
                </p>
              )}

              {selectedSkill.organization && (
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  marginTop: '1rem'
                }}>
                  <p style={{
                    fontSize: '0.7rem', color: '#94a3b8',
                    margin: '0 0 0.3rem 0',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                  }}>
                    Learned From
                  </p>
                  <p style={{
                    fontSize: '1rem', color: '#0f172a',
                    margin: 0, fontWeight: 700
                  }}>
                    {selectedSkill.organization}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default SkillsPage