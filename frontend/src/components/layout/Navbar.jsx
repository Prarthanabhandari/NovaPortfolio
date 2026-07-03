import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import useWindowSize from '../../hooks/useWindowSize'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { isMobile } = useWindowSize()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // All nav links - some go to pages, some scroll
  const navLinks = [
    { name: 'Home', path: null, scrollTo: 'home' },           // scroll on home
    { name: 'About', path: null, scrollTo: 'about' },         // scroll on home
    { name: 'Skills', path: '/skills' },                       // FULL PAGE
    { name: 'Projects', path: '/projects' },                   // FULL PAGE
    { name: 'Experience', path: '/experience' },               // FULL PAGE
    { name: 'Certificates', path: '/certificates' },           // FULL PAGE
    { name: 'Blog', path: '/blogs' },                   // FULL PAGE
    { name: 'Contact', path: null, scrollTo: 'contact' }      // scroll on home
  ]

  const handleNavClick = (link) => {
    setMenuOpen(false)

    // If has path → ALWAYS go to full page
    if (link.path) {
      navigate(link.path)
      return
    }

    // For About/Contact → scroll if on home, else navigate home and scroll
    if (location.pathname === '/') {
      const el = document.getElementById(link.scrollTo)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(link.scrollTo)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    }
  }

  const handleNameClick = () => navigate('/admin/login')

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled
        ? theme === 'professional'
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(253,244,255,0.95)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.3s ease',
      padding: isMobile ? '0.8rem 1rem' : '1rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>

        {/* Logo - clicking goes home, double-click opens admin */}
        <span
          onClick={() => navigate('/')}
          onDoubleClick={handleNameClick}
          className={theme === 'professional' ? 'logo-gradient-pro' : 'logo-gradient-creative'}
          style={{
            cursor: 'pointer',
            fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.3rem',
            userSelect: 'none'
          }}
        >
          Prarthana Bhandari
        </span>

        {/* Desktop Nav */}
        <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '2rem' }}
          className="desktop-nav">
          {navLinks.map(link => (
            <button key={link.name}
              onClick={() => handleNavClick(link)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.95rem', fontWeight: 500,
                color: location.pathname === link.path
                  ? (theme === 'professional' ? '#2563eb' : '#a855f7')
                  : (theme === 'professional' ? '#374151' : '#6b21a8'),
                transition: 'color 0.3s'
              }}
            >
              {link.name}
            </button>
          ))}

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: isMobile ? 'block' : 'none', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '1.5rem',
            color: theme === 'professional' ? '#2563eb' : '#a855f7'
          }}
          className="mobile-menu-btn"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && isMobile && (
        <div style={{
          background: theme === 'professional' ? '#fff' : '#fdf4ff',
          padding: '1rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          marginTop: '0.8rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {navLinks.map(link => (
            <button key={link.name}
              onClick={() => handleNavClick(link)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1rem', fontWeight: 500, textAlign: 'left',
                color: theme === 'professional' ? '#374151' : '#6b21a8',
              }}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar