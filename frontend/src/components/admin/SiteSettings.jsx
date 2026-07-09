import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiSave } from 'react-icons/fi'

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    about_text: '',
    years_experience: '',
    projects_count: '',
    certificates_count: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings')
        setSettings(prev => ({ ...prev, ...res.data }))
      } catch (err) {
        toast.error('Failed to fetch settings')
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (key, value) => {
    try {
      setLoading(true)
      await api.post('/settings', { key, value })
      toast.success('Setting saved!')
    } catch (err) {
      toast.error('Failed to save!')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'hero_title', label: 'Hero Title', placeholder: "Hi, I'm Prarthana Bhandari" },
    { key: 'hero_subtitle', label: 'Hero Subtitle', placeholder: 'Full Stack Developer & MCA Graduate' },
    { key: 'hero_description', label: 'Hero Description', placeholder: 'Passionate developer...', textarea: true },
    { key: 'about_text', label: 'About Text', placeholder: 'About me...', textarea: true },
    { key: 'years_experience', label: 'Years Experience', placeholder: '2' },
    { key: 'projects_count', label: 'Projects Count', placeholder: '10' },
    { key: 'certificates_count', label: 'Certificates Count', placeholder: '5' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          Site Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Manage your portfolio content
        </p>
      </div>

      <div style={{
        background: '#fff', borderRadius: '16px',
        padding: '1.5rem', border: '1px solid #e2e8f0'
      }}>
        {fields.map((field, i) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <label style={{
              display: 'block', fontSize: '0.78rem', fontWeight: 700,
              color: '#374151', marginBottom: '0.4rem',
              textTransform: 'uppercase', letterSpacing: '0.06em'
            }}>
              {field.label}
            </label>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {field.textarea ? (
                <textarea
                  value={settings[field.key] || ''}
                  onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  rows={3}
                  style={{
                    flex: 1, padding: '0.7rem 0.9rem',
                    border: '1px solid #e2e8f0', borderRadius: '10px',
                    fontSize: '0.85rem', background: '#f8fafc',
                    color: '#0f172a', outline: 'none', resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={settings[field.key] || ''}
                  onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    flex: 1, padding: '0.7rem 0.9rem',
                    border: '1px solid #e2e8f0', borderRadius: '10px',
                    fontSize: '0.85rem', background: '#f8fafc',
                    color: '#0f172a', outline: 'none'
                  }}
                />
              )}
              <button
                onClick={() => handleSave(field.key, settings[field.key])}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.7rem 1.2rem', borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', fontWeight: 600,
                  fontSize: '0.82rem', cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <FiSave size={14} /> Save
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SiteSettings