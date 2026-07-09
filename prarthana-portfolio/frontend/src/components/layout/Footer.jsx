import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa'
import useWindowSize from '../../hooks/useWindowSize'
import api from '../../services/api'

const Footer = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
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
        console.error('Failed to fetch social links in Footer:', err)
      }
    }
    fetchSocials()
  }, [])

  return (
    <footer style={{
      background: isPro ? '#0f172a' : 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
      color: '#fff', padding: isMobile ? '2rem 1rem 1.5rem' : '3rem 2rem 1.5rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: isMobile ? 'center' : 'left',
          flexWrap: 'wrap', gap: '1.5rem',
          paddingBottom: '2rem',
          borderBottom: `1px solid rgba(255,255,255,0.1)`
        }}>
          <div>
            <div 
              className={isPro ? 'logo-gradient-pro' : 'logo-gradient-creative'}
              style={{
                fontSize: '1.3rem', 
                fontWeight: 800,
                marginBottom: '0.4rem',
                display: 'inline-block'
              }}
            >
              Prarthana Bhandari
            </div>
            <p style={{
              fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)',
              maxWidth: '280px',
              margin: isMobile ? '0 auto' : '0'
            }}>
              Full Stack Developer & MCA Graduate building digital experiences.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            {[
              { icon: <FaGithub size={18} />, href: socials.github },
              { icon: <FaLinkedin size={18} />, href: socials.linkedin },
              { icon: <FaYoutube size={18} />, href: socials.youtube },
              { icon: <FaInstagram size={18} />, href: socials.instagram },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                width: '40px', height: '40px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center', paddingTop: '1.5rem',
          flexWrap: 'wrap', gap: '1rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
            © 2025 Prarthana Bhandari. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { name: 'GitHub', url: socials.github },
              { name: 'LinkedIn', url: socials.linkedin },
              { name: 'Instagram', url: socials.instagram }
            ].map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer