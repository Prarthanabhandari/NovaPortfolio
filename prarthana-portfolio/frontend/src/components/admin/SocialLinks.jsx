import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiSave } from 'react-icons/fi'
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa'

const SocialLinks = () => {
  const [links, setLinks] = useState({
    github: '', linkedin: '', youtube: '', instagram: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await api.get('/settings/social')
        const linkMap = {}
        res.data.forEach(l => { linkMap[l.platform] = l.url })
        setLinks(prev => ({ ...prev, ...linkMap }))
      } catch (err) {
        toast.error('Failed to fetch social links')
      }
    }
    fetchLinks()
  }, [])

  const handleSave = async (platform) => {
    try {
      setLoading(true)
      await api.post('/settings/social', { platform, url: links[platform] })
      toast.success(`${platform} link saved!`)
    } catch (err) {
      toast.error('Failed to save!')
    } finally {
      setLoading(false)
    }
  }

  const socialFields = [
    { key: 'github', label: 'GitHub', icon: <FaGithub size={20} />, color: '#374151', placeholder: 'https://github.com/username' },
    { key: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin size={20} />, color: '#0077b5', placeholder: 'https://linkedin.com/in/username' },
    { key: 'youtube', label: 'YouTube', icon: <FaYoutube size={20} />, color: '#ff0000', placeholder: 'https://youtube.com/@username' },
    { key: 'instagram', label: 'Instagram', icon: <FaInstagram size={20} />, color: '#e1306c', placeholder: 'https://instagram.com/username' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          Social Links
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Manage your social media links
        </p>
      </div>

      <div style={{
        background: '#fff', borderRadius: '16px',
        padding: '1.5rem', border: '1px solid #e2e8f0'
      }}>
        {socialFields.map((field, i) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ marginBottom: '1.2rem' }}
          >
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.82rem', fontWeight: 700,
              color: field.color, marginBottom: '0.4rem'
            }}>
              {field.icon} {field.label}
            </label>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <input
                type="url"
                value={links[field.key] || ''}
                onChange={e => setLinks({ ...links, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                style={{
                  flex: 1, padding: '0.7rem 0.9rem',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.85rem', background: '#f8fafc',
                  color: '#0f172a', outline: 'none'
                }}
              />
              <button
                onClick={() => handleSave(field.key)}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.7rem 1.2rem', borderRadius: '10px',
                  border: 'none',
                  background: `${field.color}20`,
                  color: field.color, fontWeight: 600,
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

export default SocialLinks