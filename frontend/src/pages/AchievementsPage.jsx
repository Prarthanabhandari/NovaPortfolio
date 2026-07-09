import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import useWindowSize from '../hooks/useWindowSize'

const AchievementsPage = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await api.get('/achievements')
        setAchievements(res.data)
      } catch (err) {
        console.log('Failed to fetch achievements')
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  const categories = ['all', ...new Set(achievements.map(a => a.category).filter(Boolean))]
  const filtered = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
        Loading achievements...
      </div>
    )
  }

  return (
    <div style={{
      padding: isMobile ? '40px 1rem' : '40px 2rem',
      background: isPro ? '#ffffff' : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            Achievements & Awards
          </h1>
          <p style={{
            fontSize: '1rem', color: '#94a3b8'
          }}>
            {achievements.length} achievements
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  border: selectedCategory === cat
                    ? `2px solid ${isPro ? '#3b82f6' : '#a78bfa'}`
                    : `1px solid ${isPro ? '#e2e8f0' : 'rgba(167,139,250,0.1)'}`,
                  background: selectedCategory === cat
                    ? isPro ? 'rgba(59,130,246,0.1)' : 'rgba(167,139,250,0.12)'
                    : 'transparent',
                  color: selectedCategory === cat
                    ? isPro ? '#3b82f6' : '#a78bfa'
                    : '#94a3b8',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Achievements Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {filtered.length === 0 ? (
            <div style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '3rem',
              color: '#94a3b8'
            }}>
              No achievements in this category
            </div>
          ) : (
            filtered.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                style={{
                  background: isPro ? '#fff' : 'rgba(255,255,255,0.95)',
                  borderRadius: '16px', overflow: 'hidden',
                  border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.6)',
                  boxShadow: isPro ? '0 4px 12px rgba(0,0,0,0.06)' : '0 8px 24px rgba(167,139,250,0.1)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image */}
                <div style={{
                  height: '150px',
                  background: isPro ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' : 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem'
                }}>
                  {achievement.image_url ? (
                    <img src={achievement.image_url} alt={achievement.title} style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover'
                    }} />
                  ) : (
                    '🏆'
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    fontSize: '1.1rem', fontWeight: 800,
                    color: isPro ? '#0f172a' : '#1e1b4b',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {achievement.title}
                  </h3>

                  {achievement.category && (
                    <p style={{
                      fontSize: '0.75rem', fontWeight: 700,
                      textTransform: 'uppercase',
                      color: isPro ? '#3b82f6' : '#a78bfa',
                      margin: '0 0 0.8rem 0',
                      letterSpacing: '0.05em'
                    }}>
                      {achievement.category}
                    </p>
                  )}

                  <p style={{
                    fontSize: '0.9rem', color: '#64748b',
                    lineHeight: 1.5, margin: '0 0 auto 0'
                  }}>
                    {achievement.description}
                  </p>

                  {achievement.date_achieved && (
                    <p style={{
                      fontSize: '0.8rem', color: '#94a3b8',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: `1px solid ${isPro ? '#f1f5f9' : 'rgba(167,139,250,0.1)'}`
                    }}>
                      {new Date(achievement.date_achieved).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementsPage