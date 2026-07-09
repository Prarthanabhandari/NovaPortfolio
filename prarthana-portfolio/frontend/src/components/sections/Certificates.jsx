import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import { FaGoogle, FaAws, FaFreeCodeCamp, FaMicrosoft, FaLinkedin, FaTimes } from 'react-icons/fa'
import { SiUdemy, SiCoursera } from 'react-icons/si'
import useWindowSize from '../../hooks/useWindowSize'

const platformIcons = {
  'Google': <FaGoogle size={60} color="#4285f4" />,
  'AWS': <FaAws size={60} color="#ff9900" />,
  'Udemy': <SiUdemy size={60} color="#a435f0" />,
  'Coursera': <SiCoursera size={60} color="#0056d2" />,
  'freeCodeCamp': <FaFreeCodeCamp size={60} color="#2bc48e" />,
  'Microsoft': <FaMicrosoft size={60} color="#00a4ef" />,
  'LinkedIn': <FaLinkedin size={60} color="#0077b5" />,
}

const Certificates = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates/featured')
        setCertificates(res.data)
      } catch (err) {
        console.log('Failed to fetch certificates')
      } finally {
        setLoading(false)
      }
    }
    fetchCertificates()
  }, [])

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>

  return (
    <section id="certificates" style={{
      padding: isMobile ? '3rem 1rem' : '80px 2rem',
      background: isPro ? '#ffffff' : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            background: isPro ? 'rgba(59,130,246,0.08)' : 'rgba(167,139,250,0.12)',
            color: isPro ? '#3b82f6' : '#a78bfa',
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '0.3rem 1rem', borderRadius: '2rem',
            marginBottom: '0.8rem'
          }}>
            Certifications
          </div>
          <h2 style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 800,
            color: isPro ? '#0f172a' : '#1e1b4b',
            margin: '0 0 0.5rem 0'
          }}>
            {isPro ? 'Professional Certifications' : 'Certificates I have earned'}
          </h2>
          <p style={{
            fontSize: '1rem', color: '#94a3b8',
            margin: 0
          }}>
            Recognized credentials from industry-leading platforms
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: isMobile ? '1.5rem' : '2rem'
        }}>
          {certificates.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              No certificates added yet.
            </div>
          ) : (
            certificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -12, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                style={{
                  background: isPro ? '#fff' : 'rgba(255,255,255,0.95)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.8)',
                  boxShadow: isPro ? '0 4px 20px rgba(0,0,0,0.06)' : '0 8px 32px rgba(167,139,250,0.12)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Image Preview */}
                <div style={{
                  height: '220px',
                  background: isPro ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' : 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {cert.image_url ? (
                    <img src={cert.image_url} alt={cert.title} style={{
                      width: '100%', height: '100%', objectFit: 'cover'
                    }} />
                  ) : (
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: '1rem'
                    }}>
                      {cert.logo_url ? (
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '16px',
                          background: '#fff',
                          border: '1px solid rgba(255,255,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          <img src={cert.logo_url} alt={cert.platform} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                      ) : platformIcons[cert.platform] || <div style={{ fontSize: '3rem' }}>🏆</div>}
                    </div>
                  )}
                  {cert.image_url && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
                      display: 'flex', alignItems: 'flex-end',
                      padding: '1.5rem',
                      color: '#fff'
                    }}>
                      {cert.logo_url ? (
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          <img src={cert.logo_url} alt={cert.platform} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                      ) : platformIcons[cert.platform] && (
                        <div style={{ fontSize: '2.5rem' }}>
                          {platformIcons[cert.platform]}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.8rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    fontSize: '1.2rem', fontWeight: 800,
                    color: isPro ? '#0f172a' : '#1e1b4b',
                    margin: '0 0 0.6rem 0',
                    lineHeight: 1.3
                  }}>
                    {cert.title}
                  </h3>

                  <p style={{
                    fontSize: '0.9rem', fontWeight: 700,
                    color: isPro ? '#3b82f6' : '#a78bfa',
                    margin: '0 0 1rem 0'
                  }}>
                    {cert.platform}
                  </p>

                  <p style={{
                    fontSize: '0.9rem', lineHeight: 1.6,
                    color: isPro ? '#64748b' : '#6b7280',
                    margin: '0 0 1.5rem 0',
                    flex: 1
                  }}>
                    {cert.description}
                  </p>

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: `1px solid ${isPro ? '#f1f5f9' : 'rgba(167,139,250,0.1)'}`
                  }}>
                    <span style={{
                      fontSize: '0.85rem', fontWeight: 600,
                      color: '#94a3b8'
                    }}>
                      {new Date(cert.issued_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short'
                      })}
                    </span>
                    <button
                      onClick={() => cert.image_url && setSelectedImage(cert.image_url)}
                      style={{
                        background: isPro ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.6rem 1.4rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: cert.image_url ? 'pointer' : 'default',
                        opacity: cert.image_url ? 1 : 0.5
                      }}
                    >
                      {cert.image_url ? 'View Certificate' : 'No Image'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal for viewing certificate image */}
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
              <FaTimes size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default Certificates