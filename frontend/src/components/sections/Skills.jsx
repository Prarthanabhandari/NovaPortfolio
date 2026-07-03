import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import { FiArrowRight } from 'react-icons/fi'
import { Icon } from '@iconify/react'

const SkillsPreview = () => {
  const { theme } = useTheme()
  const isPro = theme === 'professional'
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills')
        setSkills(res.data.slice(0, 6)) // Show only first 6
      } catch (err) {
        console.log('Failed to fetch skills')
      }
    }
    fetchSkills()
  }, [])

  return (
    <section id="skills" style={{
      padding: '80px 2rem',
      background: isPro ? '#f8fafc' : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block',
            background: isPro ? 'rgba(59,130,246,0.08)' : 'rgba(167,139,250,0.12)',
            color: isPro ? '#3b82f6' : '#a78bfa',
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '0.3rem 1rem', borderRadius: '2rem',
            marginBottom: '0.8rem'
          }}>
            My Skills
          </div>
          <h2 style={{
            fontSize: '2.5rem', fontWeight: 800,
            color: isPro ? '#0f172a' : '#1e1b4b',
            margin: '0 0 0.5rem 0'
          }}>
            Technical Expertise
          </h2>
          <p style={{
            fontSize: '1rem', color: '#94a3b8',
            margin: 0
          }}>
            Click a skill to learn more
          </p>
        </div>

        {/* Skills Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {skills.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8' }}>
              No skills added yet
            </div>
          ) : (
            skills.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                onClick={() => navigate('/skills')}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.6)',
                  boxShadow: isPro ? '0 4px 12px rgba(0,0,0,0.06)' : '0 8px 24px rgba(167,139,250,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
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
                  margin: '0 auto 1.2rem auto',
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
                    <Icon 
                      icon={skill.icon} 
                      width="36" 
                      height="36" 
                      style={{ color: isPro ? '#3b82f6' : '#a78bfa' }} 
                    />
                  ) : (
                    <div style={{ fontSize: '2rem' }}>🔧</div>
                  )}
                </div>
                <h3 style={{
                  fontWeight: 700, fontSize: '1.1rem',
                  color: isPro ? '#0f172a' : '#1e1b4b',
                  margin: '0 0 0.3rem 0'
                }}>
                  {skill.name}
                </h3>
                <p style={{
                  fontSize: '0.8rem',
                  color: isPro ? '#3b82f6' : '#a78bfa',
                  margin: 0,
                  fontWeight: 600
                }}>
                  {skill.proficiency_level || 'Intermediate'}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* View All Button */}
        {skills.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate('/skills')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: isPro ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                color: '#fff',
                border: 'none',
                padding: '0.9rem 2rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: isPro ? '0 4px 12px rgba(59,130,246,0.3)' : '0 4px 12px rgba(167,139,250,0.3)'
              }}
            >
              View All Skills <FiArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Skills