import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn, MdFileDownload } from 'react-icons/md'
import toast from 'react-hot-toast'
import api from '../../services/api'
import useWindowSize from '../../hooks/useWindowSize'

const Contact = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [socials, setSocials] = useState({
    github: 'https://github.com/prarthanabhandari',
    linkedin: 'https://www.linkedin.com/in/prarthana-bhandari-ab2a5a293/',
    youtube: 'https://youtube.com/@prarthana',
    instagram: 'https://instagram.com/prarthana'
  })

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await api.get('/settings/social')
        const links = {}
        res.data.forEach(item => {
          links[item.platform] = item.url
        })
        setSocials(prev => ({ ...prev, ...links }))
      } catch (err) {
        console.error('Failed to fetch social links in Contact:', err)
      }
    }
    fetchSocials()
  }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all fields!')
      return
    }
    try {
      setLoading(true)
      await api.post('/messages', form)
      toast.success('Message sent successfully!')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      toast.error('Failed to send message!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" style={{
      padding: isMobile ? '3rem 1rem' : '80px 2rem',
      background: isPro ? '#fff' : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block',
            background: isPro ? 'rgba(37,99,235,0.08)' : 'rgba(255,97,210,0.12)',
            color: isPro ? '#2563eb' : '#c026d3',
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '0.3rem 1rem', borderRadius: '2rem',
            marginBottom: '0.8rem'
          }}>
            Let's Connect
          </div>
          <h2 style={{
            fontSize: '2rem', fontWeight: 800,
            color: isPro ? '#0f172a' : '#1e1b4b'
          }}>
            Get In Touch
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '2rem' : '3rem', alignItems: 'start'
        }}>

          {/* LEFT - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Info items */}
            {[
              { 
                icon: <MdEmail size={20} />, 
                label: 'Email', 
                value: 'prarthanabhandari2003@gmail.com', 
                color: '#ec4899',
                link: 'mailto:prarthanabhandari2003@gmail.com'
              },
              { 
                icon: <MdPhone size={20} />, 
                label: 'Phone', 
                value: '+91 9880303752', 
                color: '#a855f7',
                link: 'tel:+919880303752'
              },
              { icon: <MdLocationOn size={20} />, label: 'Location', value: 'India', color: '#06b6d4' },
              { 
                icon: <MdFileDownload size={20} />, 
                label: 'Resume / CV', 
                value: 'Download Resume (PDF) ⬇', 
                color: '#10b981',
                link: '/Prarthana_Bhandari_Resume.pdf',
                download: 'Prarthana_Bhandari_Resume.pdf'
              },
            ].map((item, i) => {
              const cardContent = (
                <>
                  <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '12px',
                    background: `${item.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.72rem', color: isPro ? '#94a3b8' : '#9ca3af',
                      fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.08em', marginBottom: '0.2rem'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: '0.9rem', fontWeight: 600,
                      color: isPro ? '#0f172a' : '#1e1b4b'
                    }}>
                      {item.value}
                    </div>
                  </div>
                </>
              );

              const cardStyle = {
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.2rem',
                background: isPro ? '#f8fafc' : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                marginBottom: '1rem',
                border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.8)',
                textDecoration: 'none',
                cursor: item.link ? 'pointer' : 'default',
                boxShadow: '0 2px 8px rgba(15,23,42,0.02)'
              };

              if (item.link) {
                return (
                  <motion.a
                    key={i}
                    href={item.link}
                    download={item.download}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(16,185,129,0.15)' }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={cardStyle}
                  >
                    {cardContent}
                  </motion.a>
                );
              }

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={cardStyle}
                >
                  {cardContent}
                </motion.div>
              );
            })}

            {/* Social Links */}
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{
                fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: isPro ? '#94a3b8' : '#c084fc',
                marginBottom: '1rem'
              }}>
                Find me on
              </p>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {[
                  { icon: <FaGithub size={18} />, color: '#1f2937', url: socials.github },
                  { icon: <FaLinkedin size={18} />, color: '#0077b5', url: socials.linkedin },
                  { icon: <FaYoutube size={18} />, color: '#ff0000', url: socials.youtube },
                  { icon: <FaInstagram size={18} />, color: '#e1306c', url: socials.instagram },
                ].map((s, i) => (
                  <motion.a
                    key={i} 
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    style={{
                      width: '44px', height: '44px',
                      borderRadius: '12px',
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#64748b', textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = s.color;
                      e.currentTarget.style.borderColor = s.color + '44';
                      e.currentTarget.style.background = s.color + '0a';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: isPro ? '#fff' : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '2rem',
              border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.8)',
              boxShadow: isPro
                ? '0 4px 24px rgba(0,0,0,0.06)'
                : '0 8px 32px rgba(168,85,247,0.08)',
            }}
          >
            {/* Name + Email row */}
            <div style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '1rem', marginBottom: '1rem'
            }}>
              {['name', 'email'].map((field) => (
                <div key={field}>
                  <label style={{
                    display: 'block', fontSize: '0.75rem',
                    fontWeight: 600, color: isPro ? '#64748b' : '#9ca3af',
                    marginBottom: '0.4rem', textTransform: 'capitalize'
                  }}>
                    Your {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={field === 'name' ? 'Prarthana' : 'hello@email.com'}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    style={{
                      width: '100%', padding: '0.8rem 1rem',
                      border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(168,85,247,0.2)',
                      borderRadius: '12px', fontSize: '0.88rem',
                      background: isPro ? '#f8fafc' : 'rgba(255,255,255,0.8)',
                      color: isPro ? '#0f172a' : '#1e1b4b',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = isPro ? '#2563eb' : '#a855f7'}
                    onBlur={e => e.target.style.borderColor = isPro ? '#e2e8f0' : 'rgba(168,85,247,0.2)'}
                  />
                </div>
              ))}
            </div>

            {/* Message */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block', fontSize: '0.75rem',
                fontWeight: 600, color: isPro ? '#64748b' : '#9ca3af',
                marginBottom: '0.4rem'
              }}>
                Your Message
              </label>
              <textarea
                placeholder="I would like to discuss a project..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={5}
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(168,85,247,0.2)',
                  borderRadius: '12px', fontSize: '0.88rem',
                  background: isPro ? '#f8fafc' : 'rgba(255,255,255,0.8)',
                  color: isPro ? '#0f172a' : '#1e1b4b',
                  outline: 'none', resize: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = isPro ? '#2563eb' : '#a855f7'}
                onBlur={e => e.target.style.borderColor = isPro ? '#e2e8f0' : 'rgba(168,85,247,0.2)'}
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '1rem',
                background: isPro
                  ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                  : 'linear-gradient(135deg, #ec4899, #a855f7)',
                color: '#fff', border: 'none',
                borderRadius: '12px', fontWeight: 700,
                fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem',
                fontFamily: 'inherit'
              }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact