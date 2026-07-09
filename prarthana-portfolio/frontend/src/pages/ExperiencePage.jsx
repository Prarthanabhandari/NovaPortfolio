import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import useWindowSize from '../hooks/useWindowSize'

import { Icon } from '@iconify/react'

const ExperiencePage = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
        Loading experience...
      </div>
    )
  }

  return (
    <div style={{
      padding: isMobile ? '40px 1rem' : '40px 2rem',
      background: isPro ? '#ffffff' : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
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
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 800,
            color: isPro ? '#0f172a' : '#1e1b4b',
            margin: '0 0 0.5rem 0'
          }}>
            Professional Experience
          </h1>
          <p style={{
            fontSize: '1rem', color: '#94a3b8'
          }}>
            {experiences.length} positions
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                marginBottom: '2rem',
                paddingLeft: isMobile ? '1.5rem' : '3rem',
                position: 'relative'
              }}
            >
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: '0', top: '8px',
                width: isMobile ? '16px' : '24px', height: isMobile ? '16px' : '24px',
                borderRadius: '50%',
                background: isPro ? '#3b82f6' : '#a78bfa',
                border: `3px solid ${isPro ? '#ffffff' : 'rgba(255,255,255,0.95)'}`,
                boxShadow: isPro ? '0 0 0 2px #3b82f6' : '0 0 0 2px #a78bfa'
              }} />

              {/* Content */}
              <motion.div
                whileHover={{ x: 8 }}
                style={{
                  background: isPro ? '#fff' : 'rgba(255,255,255,0.95)',
                  borderRadius: '16px', padding: isMobile ? '1rem' : '1.5rem',
                  border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.6)',
                  boxShadow: isPro ? '0 4px 12px rgba(0,0,0,0.06)' : '0 8px 24px rgba(167,139,250,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'flex-start',
                  gap: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      background: '#fff',
                      border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      flexShrink: 0
                    }}>
                      {exp.image_url ? (
                        <img src={exp.image_url} alt={exp.company} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      ) : exp.icon ? (
                        <Icon icon={exp.icon} width="28" height="28" style={{ color: isPro ? '#3b82f6' : '#a78bfa' }} />
                      ) : (
                        <div style={{ fontSize: '1.4rem' }}>💼</div>
                      )}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.2rem', fontWeight: 800,
                        color: isPro ? '#0f172a' : '#1e1b4b',
                        margin: '0'
                      }}>
                        {exp.job_title}
                      </h3>
                      <p style={{
                        fontSize: '1rem', fontWeight: 600,
                        color: isPro ? '#3b82f6' : '#a78bfa',
                        margin: '0.2rem 0 0 0'
                      }}>
                        {exp.company}
                      </p>
                    </div>
                  </div>
                  {exp.is_current && (
                    <div style={{
                      background: isPro ? 'rgba(34, 197, 94, 0.1)' : 'rgba(74, 222, 128, 0.12)',
                      color: isPro ? '#22c55e' : '#4ade80',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      CURRENT
                    </div>
                  )}
                </div>

                {exp.location && (
                  <p style={{
                    fontSize: '0.85rem', color: '#94a3b8',
                    margin: '0 0 0.8rem 0'
                  }}>
                    📍 {exp.location}
                  </p>
                )}

                {exp.start_date && (
                  <p style={{
                    fontSize: '0.85rem', color: '#94a3b8',
                    margin: '0 0 1rem 0'
                  }}>
                    {new Date(exp.start_date).toLocaleDateString('en-US', {
                      month: 'short', year: 'numeric'
                    })} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', {
                      month: 'short', year: 'numeric'
                    }) : 'Present'}
                  </p>
                )}

                <p style={{
                  fontSize: '0.95rem', color: '#64748b',
                  lineHeight: 1.6
                }}>
                  {exp.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExperiencePage