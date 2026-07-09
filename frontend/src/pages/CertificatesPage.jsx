import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiX } from 'react-icons/fi'
import useWindowSize from '../hooks/useWindowSize'
import { FaGoogle, FaAws, FaFreeCodeCamp, FaMicrosoft, FaLinkedin } from 'react-icons/fa'
import { SiUdemy, SiCoursera } from 'react-icons/si'

const platformIcons = {
  'Google': <FaGoogle size={40} color="#4285f4" />,
  'AWS': <FaAws size={40} color="#ff9900" />,
  'Udemy': <SiUdemy size={40} color="#a435f0" />,
  'Coursera': <SiCoursera size={40} color="#0056d2" />,
  'freeCodeCamp': <FaFreeCodeCamp size={40} color="#2bc48e" />,
  'Microsoft': <FaMicrosoft size={40} color="#00a4ef" />,
  'LinkedIn': <FaLinkedin size={40} color="#0077b5" />,
}

const CertificatesPage = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates')
        setCertificates(res.data)
      } catch (err) {
        console.log('Failed to fetch certificates')
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh' }}>
        Loading certificates...
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
            Certifications
          </h1>
          <p style={{
            fontSize: '1rem', color: '#94a3b8'
          }}>
            {certificates.length} certifications earned
          </p>
        </div>

        {/* Certificates Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              style={{
                background: isPro ? '#fff' : 'rgba(255,255,255,0.95)',
                borderRadius: '16px', overflow: 'hidden',
                border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.6)',
                boxShadow: isPro ? '0 4px 12px rgba(0,0,0,0.06)' : '0 8px 24px rgba(167,139,250,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Image Preview */}
              <div style={{
                height: '180px',
                background: isPro ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' : 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {cert.image_url ? (
                  <>
                    <img src={cert.image_url} alt={cert.title} style={{
                      width: '100%', height: '100%', objectFit: 'cover'
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
                      display: 'flex', alignItems: 'flex-end',
                      padding: '1rem'
                    }}>
                      {cert.logo_url ? (
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          <img src={cert.logo_url} alt={cert.platform} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                      ) : platformIcons[cert.platform] && (
                        <div style={{ fontSize: '1.8rem' }}>
                          {platformIcons[cert.platform]}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cert.logo_url ? (
                      <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '14px',
                        background: '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <img src={cert.logo_url} alt={cert.platform} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    ) : platformIcons[cert.platform] || <div style={{ fontSize: '2.5rem' }}>🏆</div>}
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.1rem', fontWeight: 800,
                  color: isPro ? '#0f172a' : '#1e1b4b',
                  margin: '0 0 0.3rem 0'
                }}>
                  {cert.title}
                </h3>

                <p style={{
                  fontSize: '0.85rem', fontWeight: 600,
                  color: isPro ? '#3b82f6' : '#a78bfa',
                  margin: '0 0 0.8rem 0'
                }}>
                  {cert.platform}
                </p>

                <p style={{
                  fontSize: '0.85rem', color: '#64748b',
                  lineHeight: 1.5, margin: '0 0 1rem 0'
                }}>
                  {cert.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: `1px solid ${isPro ? '#f1f5f9' : 'rgba(167,139,250,0.1)'}`
                }}>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 600,
                    color: '#94a3b8'
                  }}>
                    {new Date(cert.issued_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </span>
                  {cert.image_url && (
                    <button
                      onClick={() => setSelectedImage(cert.image_url)}
                      style={{
                        background: isPro ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
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
              maxWidth: '90%',
              maxHeight: '90vh',
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          >
            <img src={selectedImage} alt="Certificate" style={{
              width: '100%', height: '100%',
              objectFit: 'contain'
            }} />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                border: 'none',
                width: '50px', height: '50px',
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiX size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CertificatesPage