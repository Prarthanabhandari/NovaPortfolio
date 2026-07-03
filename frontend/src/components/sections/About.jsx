import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useTheme } from '../../context/ThemeContext'
import { fadeIn, staggerContainer } from '../../utils/animations'
import api from '../../services/api'
import useWindowSize from '../../hooks/useWindowSize'

const About = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const [skills, setSkills] = useState([])
  const [selectedSkill, setSelectedSkill] = useState(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills/featured')
        setSkills(res.data)
      } catch (err) {
        console.log('Failed to fetch skills')
      }
    }
    fetchSkills()
  }, [])

  return (
    <section id="about" style={{
      padding: isMobile ? '3rem 1rem' : '80px 2rem',
      background: isPro
        ? '#f8faff'
        : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '3rem' : '2rem', alignItems: isMobile ? 'start' : 'stretch'
      }}>

        {/* LEFT - About Card */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            background: isPro ? '#fff' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: '28px',
            border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.8)',
            boxShadow: isPro
              ? '0 4px 24px rgba(0,0,0,0.06)'
              : '0 8px 40px rgba(168,85,247,0.08)',
            overflow: 'visible',
            position: 'relative',
            minHeight: '420px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>

            <motion.div variants={fadeIn} style={{
              display: 'inline-block',
              background: isPro ? 'rgba(37,99,235,0.08)' : 'rgba(255,97,210,0.12)',
              color: isPro ? '#2563eb' : '#c026d3',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.3rem 1rem', borderRadius: '2rem',
              marginBottom: '1.2rem'
            }}>
              About Me
            </motion.div>

            <motion.h2 variants={fadeIn} style={{
              fontSize: '1.8rem', fontWeight: 800,
              color: isPro ? '#0f172a' : '#1e1b4b',
              marginBottom: '1rem', lineHeight: 1.2
            }}>
              {isPro
                ? <>Passionate about<br />building solutions</>
                : <>Curious. Creative.<br />Code Lover</>
              }
            </motion.h2>

            <motion.p variants={fadeIn} style={{
              fontSize: '0.9rem', lineHeight: 1.85,
              color: isPro ? '#64748b' : '#6b7280',
              marginBottom: '1.5rem'
            }}>
              {isPro
                ? "I'm Prarthana Bhandari, a Full Stack Developer and recent MCA graduate. I have a passion for building clean, scalable, and high-performance web applications that solve real-world problems."
                : "I'm Prarthana, a Full Stack Developer and recent MCA graduate. I enjoy turning complex ideas into beautiful, functional, and performant web experiences with clean design and smooth animations."
              }
            </motion.p>

            <motion.button
              variants={fadeIn}
              whileHover={{ scale: 1.03 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent',
                color: isPro ? '#2563eb' : '#ec4899',
                border: `1.5px solid ${isPro ? '#2563eb' : '#ec4899'}`,
                padding: '0.6rem 1.5rem',
                borderRadius: '2rem', fontWeight: 600,
                fontSize: '0.85rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              }}
            >
              More About Me
            </motion.button>

            {/* Education */}
            <div style={{ marginTop: '1.5rem' }}>
              {[
                { deg: 'MCA', detail: 'Master of Computer Applications · 2024–2026' },
                { deg: 'BCA', detail: 'Bachelor of Computer Applications · 2020–2023' },
              ].map((edu, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '1rem', alignItems: 'center',
                  padding: '0.7rem 1rem', marginBottom: '0.5rem',
                  background: isPro ? '#f8fafc' : 'rgba(168,85,247,0.05)',
                  borderRadius: '12px',
                  borderLeft: `3px solid ${isPro ? '#2563eb' : '#a855f7'}`
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isPro ? '#0f172a' : '#1e1b4b' }}>
                      {edu.deg}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {edu.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT - Skills Card (FROM API - FEATURED ONLY) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: isPro ? '#fff' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: '28px',
            padding: '2.5rem',
            border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.8)',
            boxShadow: isPro
              ? '0 4px 24px rgba(0,0,0,0.06)'
              : '0 8px 40px rgba(168,85,247,0.08)',
            height: '100%'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.8rem'
          }}>
            <div style={{
              display: 'inline-block',
              background: isPro ? 'rgba(37,99,235,0.08)' : 'rgba(255,97,210,0.12)',
              color: isPro ? '#2563eb' : '#c026d3',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.3rem 1rem', borderRadius: '2rem',
            }}>
              My Skills
            </div>

            {/* View All Button */}
            <a 
              href="/skills"
              style={{
                fontSize: '0.8rem',
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

          {skills.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
              No featured skills yet. Mark some skills as featured from admin panel!
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.06, y: -4 }}
                  onClick={() => setSelectedSkill(skill)}
                  style={{
                    background: isPro ? '#f8fafc' : '#fff',
                    borderRadius: '18px',
                    padding: '1.2rem 0.8rem',
                    textAlign: 'center',
                    border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: isPro ? 'none' : '0 2px 12px rgba(0,0,0,0.04)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    marginBottom: '0.6rem',
                    display: 'flex', justifyContent: 'center'
                  }}>
                    {skill.icon ? (
                      <Icon icon={skill.icon} width="40" height="40" />
                    ) : (
                      <div style={{ fontSize: '2rem' }}>🔧</div>
                    )}
                  </div>
                  <div style={{
                    fontWeight: 700, fontSize: '0.82rem',
                    color: isPro ? '#0f172a' : '#1e1b4b',
                    marginBottom: '0.4rem'
                  }}>
                    {skill.name}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: isPro ? '#2563eb' : '#a78bfa',
                    fontWeight: 600
                  }}>
                    {skill.proficiency_level || 'Intermediate'}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

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
            {/* Close Button */}
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

            {/* Icon */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              {selectedSkill.icon ? (
                <Icon icon={selectedSkill.icon} width="80" height="80" />
              ) : (
                <div style={{ fontSize: '4rem' }}>🔧</div>
              )}
            </div>

            {/* Name */}
            <h2 style={{
              fontSize: '1.8rem', fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 0.5rem 0',
              textAlign: 'center'
            }}>
              {selectedSkill.name}
            </h2>

            {/* Proficiency Badge */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
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

            {/* Description */}
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

            {/* Organization */}
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
    </section>
  )
}

export default About