import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiFeather } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import useWindowSize from '../../hooks/useWindowSize'

const ThemeToggleFloating = () => {
  const { theme, toggleTheme } = useTheme()
  const { isMobile } = useWindowSize()
  const [isHovered, setIsHovered] = useState(false)
  const isPro = theme === 'professional'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '20px' : '24px',
        right: isMobile ? '20px' : '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Label */}
      <AnimatePresence>
        {isHovered && !isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: isPro ? '#0f172a' : '#7c3aed',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: isPro ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.2)',
            }}
          >
            Switch to {isPro ? 'Creative' : 'Professional'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circle Button */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          width: isMobile ? '52px' : '56px',
          height: isMobile ? '52px' : '56px',
          borderRadius: '50%',
          border: isPro ? '2px solid #2563eb' : '2px solid rgba(255,255,255,0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isPro 
            ? '0 8px 30px rgba(37, 99, 235, 0.25)' 
            : '0 8px 30px rgba(168, 85, 247, 0.35)',
          background: isPro 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          color: isPro ? '#2563eb' : '#ffffff',
          backdropFilter: 'blur(8px)',
          transition: 'border 0.3s, box-shadow 0.3s, background 0.3s',
        }}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isPro ? (
            <FiBriefcase size={isMobile ? 22 : 24} />
          ) : (
            <FiFeather size={isMobile ? 22 : 24} />
          )}
        </motion.div>
      </motion.button>
    </div>
  )
}

export default ThemeToggleFloating
