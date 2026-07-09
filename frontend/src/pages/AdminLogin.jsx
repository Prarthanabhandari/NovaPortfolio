import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      toast.error('Please fill all fields!')
      return
    }
    try {
      setLoading(true)
      await login(form.username, form.password)
      toast.success('Welcome back, Prarthana!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error('Invalid credentials!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>

      {/* Background blobs */}
      {[
        { w: 300, h: 300, top: '-10%', left: '-5%', color: 'rgba(255,255,255,0.08)' },
        { w: 250, h: 250, bottom: '-5%', right: '-5%', color: 'rgba(255,255,255,0.06)' },
        { w: 200, h: 200, top: '40%', right: '10%', color: 'rgba(255,255,255,0.05)' },
      ].map((blob, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: blob.w, height: blob.h,
          borderRadius: '50%',
          background: blob.color,
          top: blob.top, left: blob.left,
          right: blob.right, bottom: blob.bottom,
        }} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: '3rem',
          width: '100%', maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          position: 'relative', zIndex: 1
        }}
      >
        {/* Lock icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '70px', height: '70px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(102,126,234,0.4)'
          }}>
            <FiLock size={28} color="#fff" />
          </div>
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 800,
            color: '#0f172a', marginBottom: '0.3rem'
          }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Username */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block', fontSize: '0.78rem',
            fontWeight: 600, color: '#64748b',
            marginBottom: '0.4rem', textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Username
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}>
              <FiUser size={16} />
            </div>
            <input
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px', fontSize: '0.9rem',
                background: '#f8fafc', color: '#0f172a',
                outline: 'none', transition: 'border-color 0.2s',
                fontFamily: 'inherit', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block', fontSize: '0.78rem',
            fontWeight: 600, color: '#64748b',
            marginBottom: '0.4rem', textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', color: '#94a3b8'
            }}>
              <FiLock size={16} />
            </div>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '0.9rem 3rem 0.9rem 2.8rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px', fontSize: '0.9rem',
                background: '#f8fafc', color: '#0f172a',
                outline: 'none', transition: 'border-color 0.2s',
                fontFamily: 'inherit', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute', right: '14px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: '#94a3b8', padding: 0
              }}
            >
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '1rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff', border: 'none',
            borderRadius: '12px', fontWeight: 700,
            fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontFamily: 'inherit',
            boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </motion.button>

        {/* Back to portfolio */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', color: '#94a3b8',
              fontSize: '0.82rem', fontFamily: 'inherit'
            }}
          >
            ← Back to Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin