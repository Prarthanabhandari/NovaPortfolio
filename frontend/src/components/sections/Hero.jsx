import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa'
import { staggerContainer, fadeIn } from '../../utils/animations'
import avatarImg from '../../assets/avatar.png'
import photoImg from '../../assets/photo.jpg'
import useWindowSize from '../../hooks/useWindowSize'
import api from '../../services/api'

const Hero = () => {
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
        console.error('Failed to fetch social links:', err)
      }
    }
    fetchSocials()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (isPro) {
    return (
      <section id="home" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f4ff 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: '80px'
      }}>
        {/* dots pattern */}
        <div style={{
          position: 'absolute', right: '5%', top: '15%',
          width: '350px', height: '350px',
          backgroundImage: 'radial-gradient(circle, #2563eb22 1.5px, transparent 1.5px)',
          backgroundSize: '22px 22px', zIndex: 0
        }} />
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem',
          width: '100%', display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '3rem' : '2rem', alignItems: 'center', position: 'relative', zIndex: 1
        }}>
          {/* LEFT */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeIn} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.2)',
              borderRadius: '2rem', padding: '0.4rem 1.2rem',
              fontSize: '0.85rem', fontWeight: 500,
              color: '#2563eb', marginBottom: '1.5rem'
            }}>
              Full Stack Developer & MCA Graduate
            </motion.div>

            <motion.h1 variants={fadeIn} style={{
              fontSize: isMobile ? '2.5rem' : '3.5rem', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '1rem', color: '#0f172a'
            }}>
              Hi, I'm<br />
              <span style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Prarthana Bhandari
              </span>
            </motion.h1>

            <motion.p variants={fadeIn} style={{
              fontSize: '1rem', lineHeight: 1.8, color: '#64748b',
              marginBottom: '2rem', maxWidth: '460px'
            }}>
              Passionate Full Stack Developer who loves building user-friendly
              web applications and solving real-world problems.
            </motion.p>

            <motion.div variants={fadeIn} style={{
              display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap'
            }}>
              <button onClick={() => scrollTo('projects')} style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: '#fff', border: 'none', padding: '0.9rem 2rem',
                borderRadius: '3rem', fontWeight: 600, fontSize: '0.95rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(37,99,235,0.35)', transition: 'transform 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                View My Work →
              </button>
              <button onClick={() => scrollTo('contact')} style={{
                background: 'transparent', color: '#2563eb',
                border: '2px solid #2563eb', padding: '0.9rem 2rem',
                borderRadius: '3rem', fontWeight: 600, fontSize: '0.95rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2563eb' }}
              >
                Contact Me
              </button>
              <a href="/Prarthana_Bhandari_Resume.pdf" download="Prarthana_Bhandari_Resume.pdf" style={{
                background: 'transparent', color: '#7c3aed',
                border: '2px solid #7c3aed', padding: '0.9rem 2rem',
                borderRadius: '3rem', fontWeight: 600, fontSize: '0.95rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                textDecoration: 'none', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7c3aed' }}
              >
                Download CV ⬇
              </a>
            </motion.div>

            <motion.div variants={fadeIn}>
              <p style={{
                fontSize: '0.75rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', fontWeight: 600,
                color: '#94a3b8', marginBottom: '0.8rem'
              }}>Connect with me</p>
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
                      width: '40px', height: '40px', borderRadius: '50%',
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
            </motion.div>
          </motion.div>

          {/* RIGHT - photo circle (PROFESSIONAL MODE - uses photo.png) - MOVED UP */}
          <div style={{ 
            position: 'relative', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start',
            height: isMobile ? '370px' : '530px',
            paddingTop: '20px',
            marginTop: isMobile ? '0' : '-60px'
          }}>

            {/* Soft glow behind image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                position: 'absolute',
                width: isMobile ? '300px' : '500px',
                height: isMobile ? '300px' : '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(124,58,237,0.15) 40%, transparent 75%)',
                filter: 'blur(30px)',
                top: '0',
                zIndex: 1
              }}
            />

            {/* Decorative rotating dashed ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: isMobile ? '280px' : '460px',
                height: isMobile ? '280px' : '460px',
                borderRadius: '50%',
                border: '2px dashed rgba(37,99,235,0.2)',
                top: isMobile ? '10px' : '20px',
                zIndex: 1
              }}
            />

            {/* Smaller solid ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: isMobile ? '260px' : '440px',
                height: isMobile ? '260px' : '440px',
                borderRadius: '50%',
                border: '1px solid rgba(124,58,237,0.15)',
                top: isMobile ? '20px' : '30px',
                zIndex: 1
              }}
            />

            {/* Main photo - arch/dome look */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                width: isMobile ? '260px' : '380px',
                height: isMobile ? '330px' : '470px',
                borderRadius: isMobile ? '130px 130px 24px 24px' : '190px 190px 32px 32px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(37,99,235,0.2), 0 0 0 8px rgba(255,255,255,0.7), 0 0 0 12px rgba(37,99,235,0.08)',
                position: 'relative',
                zIndex: 2,
                marginTop: isMobile ? '25px' : '40px'
              }}
            >
              <img
                src={photoImg}
                alt="Prarthana"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  objectPosition: '50% 5%',
                  filter: 'saturate(1.02)'
                }}
              />
            </motion.div>

            {/* Floating tech badge - top right */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '40px',
                right: '5%',
                background: '#fff',
                borderRadius: '12px',
                padding: '0.6rem 1rem',
                boxShadow: '0 8px 24px rgba(37,99,235,0.15)',
                border: '1px solid rgba(37,99,235,0.1)',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>👨‍💻</span>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>Currently</div>
                <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>Available</div>
              </div>
            </motion.div>

            {/* Bottom badge - Open to Work */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '5%',
                background: '#fff',
                borderRadius: '12px',
                padding: '0.6rem 1rem',
                boxShadow: '0 8px 24px rgba(37,99,235,0.15)',
                border: '1px solid rgba(37,99,235,0.1)',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e'
              }} />
              <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>Open to Work</div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{
          position: isMobile ? 'relative' : 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid #e2e8f0',
          padding: isMobile ? '0.8rem 0.5rem' : '1.2rem 2rem',
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
          gap: isMobile ? '0.5rem' : '0'
        }}>
          {[
            { num: '10+', label: 'Projects' },
            { num: '5+', label: 'Techs' },
            { num: '8+', label: 'Certificates' },
            { num: '2+', label: 'Years' },
            { num: '100%', label: 'Dedication' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: isMobile ? '0.3rem 0.6rem' : '0.5rem 2.5rem',
              borderRight: i < 4 && !isMobile ? '1px solid #e2e8f0' : 'none',
              textAlign: 'center',
              flex: isMobile ? '1 1 30%' : 'none'
            }}>
              <div style={{ fontWeight: 800, fontSize: isMobile ? '1.1rem' : '1.4rem', color: '#0f172a' }}>{stat.num}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ============ CREATIVE MODE ============
  return (
    <section id="home" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 25%, #e8eaf6 50%, #e0f7fa 100%)',
      position: 'relative', overflow: 'hidden',
      paddingTop: '80px'
    }}>

      {/* Floating blobs */}
      {[
        { w: 300, h: 300, top: '-5%', left: '-5%', color: 'rgba(255,182,255,0.3)' },
        { w: 250, h: 250, top: '10%', right: '-5%', color: 'rgba(182,182,255,0.25)' },
        { w: 200, h: 200, bottom: '20%', left: '5%', color: 'rgba(182,255,255,0.25)' },
        { w: 180, h: 180, bottom: '5%', right: '10%', color: 'rgba(255,218,185,0.3)' },
      ].map((blob, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: blob.w, height: blob.h,
            borderRadius: '50%',
            background: blob.color,
            top: blob.top, left: blob.left,
            right: blob.right, bottom: blob.bottom,
            filter: 'blur(40px)', zIndex: 0
          }}
        />
      ))}

      {/* Floating sparkle dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [-20, 20, -20], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          style={{
            position: 'absolute',
            width: `${6 + i * 2}px`, height: `${6 + i * 2}px`,
            borderRadius: '50%',
            background: ['#ff61d2', '#a855f7', '#06b6d4', '#fbbf24', '#34d399', '#f472b6', '#818cf8', '#fb923c'][i],
            top: `${[15, 25, 45, 65, 75, 30, 55, 80][i]}%`,
            left: `${[8, 88, 92, 6, 82, 50, 15, 70][i]}%`,
            zIndex: 1
          }}
        />
      ))}

      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: isMobile ? '1rem' : '2rem 2rem',
        minHeight: 'calc(100vh - 80px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '45% 55%',
        gap: isMobile ? '3rem' : '2rem',
        alignItems: 'center',
        position: 'relative', zIndex: 2,
        paddingBottom: isMobile ? '100px' : '60px'
      }}>
        {/* LEFT TEXT */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ paddingRight: '2rem' }}
        >
          <motion.div variants={fadeIn} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.8)',
            borderRadius: '2rem', padding: '0.4rem 1.2rem',
            fontSize: '0.82rem', fontWeight: 500,
            color: '#7c3aed', marginBottom: '1.5rem'
          }}>
            Welcome to my world
          </motion.div>

          <motion.h1 variants={fadeIn} style={{
            fontSize: isMobile ? '2.8rem' : '3.8rem', fontWeight: 900,
            lineHeight: 1.05, marginBottom: '1rem',
            color: '#1e1b4b'
          }}>
            Hi, I'm{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff61d2, #a855f7, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              display: 'block'
            }}>
              Prarthana
            </span>
          </motion.h1>

          <motion.p variants={fadeIn} style={{
            fontSize: '1.15rem', fontWeight: 600,
            color: '#4c1d95', marginBottom: '0.8rem', lineHeight: 1.5
          }}>
            I build digital experiences<br />
            that are{' '}
            <span style={{ color: '#ff61d2' }}>beautiful</span>,{' '}
            <span style={{ color: '#a855f7' }}>fast</span> &{' '}
            <span style={{ color: '#06b6d4' }}>meaningful</span>.
          </motion.p>

          <motion.p variants={fadeIn} style={{
            fontSize: '0.95rem', lineHeight: 1.8,
            color: '#6b7280', marginBottom: '2rem', maxWidth: '400px'
          }}>
            I'm a passionate full-stack developer who loves turning
            ideas into real world web applications.
          </motion.p>

          <motion.div variants={fadeIn} style={{
            display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap'
          }}>
            <button onClick={() => scrollTo('projects')} style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: '#fff', border: 'none', padding: '0.9rem 2rem',
              borderRadius: '3rem', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View My Work →
            </button>
            <button onClick={() => scrollTo('contact')} style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              color: '#a855f7',
              border: '2px solid rgba(168,85,247,0.4)',
              padding: '0.9rem 2rem',
              borderRadius: '3rem', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              Contact Me
            </button>
            <a href="/Prarthana_Bhandari_Resume.pdf" download="Prarthana_Bhandari_Resume.pdf" style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              color: '#ec4899',
              border: '2px solid rgba(236,72,153,0.4)',
              padding: '0.9rem 2rem',
              borderRadius: '3rem', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              textDecoration: 'none', transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899, #a855f7)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = '#ec4899' }}
            >
              Download CV ⬇
            </a>
          </motion.div>

          {/* Social */}
          <motion.div variants={fadeIn}>
            <p style={{
              fontSize: '0.72rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', fontWeight: 700,
              color: '#c084fc', marginBottom: '0.8rem'
            }}>
              Let's Connect
            </p>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {[
                { icon: <FaGithub size={18} />, bg: 'rgba(99,102,241,0.15)', color: '#4f46e5', url: socials.github },
                { icon: <FaLinkedin size={18} />, bg: 'rgba(99,102,241,0.15)', color: '#6366f1', url: socials.linkedin },
                { icon: <FaYoutube size={18} />, bg: 'rgba(236,72,153,0.15)', color: '#ec4899', url: socials.youtube },
                { icon: <FaInstagram size={18} />, bg: 'rgba(236,72,153,0.15)', color: '#db2777', url: socials.instagram },
              ].map((s, i) => (
                <motion.a 
                  key={i} 
                  href={s.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }} 
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: s.bg, backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color, textDecoration: 'none'
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Scroll down */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={() => scrollTo('about')}
            style={{
              marginTop: '2rem', display: 'flex', alignItems: 'center',
              gap: '0.5rem', cursor: 'pointer', width: 'fit-content'
            }}
          >
            <div style={{
              width: '24px', height: '38px',
              border: '2px solid rgba(168,85,247,0.5)',
              borderRadius: '12px',
              display: 'flex', justifyContent: 'center', paddingTop: '6px'
            }}>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: '4px', height: '8px',
                  borderRadius: '2px', background: '#a855f7'
                }}
              />
            </div>
            <span style={{ fontSize: '0.82rem', color: '#a855f7', fontWeight: 500 }}>Scroll Down</span>
          </motion.div>
        </motion.div>

        {/* RIGHT - CIRCULAR IMAGE WITH EFFECTS (CREATIVE MODE - uses avatar.png) - MOVED UP */}
        <div style={{ 
          position: 'relative', 
          height: isMobile ? '320px' : '100%', 
          display: 'flex', 
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '20px',
          marginTop: isMobile ? '0' : '-60px'
        }}>

          {/* Background glow circle behind image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              position: 'absolute',
              width: isMobile ? '300px' : '480px',
              height: isMobile ? '300px' : '480px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.2) 40%, transparent 75%)',
              filter: 'blur(20px)',
              top: isMobile ? '50%' : '15%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          />

          {/* Decorative dashed rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: isMobile ? '280px' : '450px',
              height: isMobile ? '280px' : '450px',
              borderRadius: '50%',
              border: '2px dashed rgba(168,85,247,0.25)',
              top: isMobile ? '50%' : '15%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          />

          {/* Main girl image - centered circular */}
          <motion.img
            src={avatarImg}
            alt="Prarthana"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              width: isMobile ? '240px' : '420px',
              height: isMobile ? '240px' : '420px',
              objectFit: 'cover',
              borderRadius: '50%',
              filter: 'drop-shadow(0 25px 50px rgba(168,85,247,0.4))',
              position: 'relative',
              zIndex: 2,
              border: '4px solid rgba(255,255,255,0.6)'
            }}
          />

          {/* Floating tech chips */}
          {[
            { label: 'React', top: '10%', left: '0%', color: '#61dafb', bg: 'rgba(97,218,251,0.2)' },
            { label: 'Node.js', top: '35%', left: '-2%', color: '#68a063', bg: 'rgba(104,160,99,0.2)' },
            { label: 'PostgreSQL', top: '55%', right: '0%', color: '#336791', bg: 'rgba(51,103,145,0.2)' },
          ].map((chip, i) => (
            <motion.div key={i}
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
              style={{
                position: 'absolute',
                top: chip.top,
                left: chip.left,
                right: chip.right,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${chip.color}44`,
                borderRadius: '2rem',
                padding: '0.5rem 1.2rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: chip.color,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                zIndex: 3,
                whiteSpace: 'nowrap'
              }}
            >
              {chip.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        position: isMobile ? 'relative' : 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(168,85,247,0.15)',
        padding: isMobile ? '0.8rem 0.5rem' : '1rem 2rem',
        display: 'flex', justifyContent: 'center',
        flexWrap: 'wrap', zIndex: 10,
        gap: isMobile ? '0.5rem' : '0'
      }}>
        {[
          { num: '2+', label: 'Years' },
          { num: '10+', label: 'Projects' },
          { num: '5+', label: 'Certificates' },
          { num: '100%', label: 'Dedication' },
          { num: '24/7', label: 'Learning' },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: isMobile ? '0.3rem 0.6rem' : '0.4rem 2rem',
            borderRight: i < 4 && !isMobile ? '1px solid rgba(168,85,247,0.2)' : 'none',
            textAlign: 'center',
            flex: isMobile ? '1 1 30%' : 'none'
          }}>
            <div style={{
              fontWeight: 800, fontSize: isMobile ? '1.1rem' : '1.3rem',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {stat.num}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Hero