import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload, FiStar } from 'react-icons/fi'
import { FaGoogle, FaAws, FaFreeCodeCamp, FaMicrosoft, FaLinkedin } from 'react-icons/fa'
import { SiUdemy, SiCoursera } from 'react-icons/si'

const platformIcons = {
  'Google': <FaGoogle size={18} color="#4285f4" />,
  'AWS': <FaAws size={18} color="#ff9900" />,
  'Udemy': <SiUdemy size={18} color="#a435f0" />,
  'Coursera': <SiCoursera size={18} color="#0056d2" />,
  'freeCodeCamp': <FaFreeCodeCamp size={18} color="#2bc48e" />,
  'Microsoft': <FaMicrosoft size={18} color="#00a4ef" />,
  'LinkedIn': <FaLinkedin size={18} color="#0077b5" />,
}

const platformList = Object.keys(platformIcons)

const emptyForm = {
  title: '',
  platform: '',
  description: '',
  issued_date: '',
  credential_url: '',
  is_featured: false,
  image: null,
  image_url: '',
  logo: null,
  logo_url: ''
}

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPlatformPicker, setShowPlatformPicker] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates')
      setCertificates(res.data)
    } catch (err) {
      toast.error('Failed to fetch certificates')
    }
  }

  const featuredCount = certificates.filter(c => c.is_featured).length

  const handleToggleFeatured = async (cert) => {
    try {
      if (!cert.is_featured && featuredCount >= 6) {
        toast.error('Maximum 6 certificates can be featured on home page!')
        return
      }
      await api.patch(`/certificates/${cert.id}/feature`)
      toast.success(cert.is_featured ? 'Removed from home' : 'Added to home!')
      fetchCertificates()
    } catch (err) {
      toast.error('Failed to update!')
    }
  }

  useEffect(() => { fetchCertificates() }, [])

  const handleSelectPlatform = (platform) => {
    setForm({ ...form, platform })
    setShowPlatformPicker(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, image: file })
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, logo: file }))
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!form.title || !form.platform || !form.description || !form.issued_date) {
      toast.error('All fields required!')
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('platform', form.platform)
      formData.append('description', form.description)
      formData.append('issued_date', form.issued_date)
      formData.append('credential_url', form.credential_url)
      formData.append('is_featured', form.is_featured)
      if (form.image) formData.append('image', form.image)
      if (form.logo) formData.append('logo', form.logo)

      if (editId) {
        await api.put(`/certificates/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Certificate updated!')
      } else {
        await api.post('/certificates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Certificate added!')
      }
      setForm(emptyForm)
      setImagePreview(null)
      setLogoPreview(null)
      setShowForm(false)
      setEditId(null)
      fetchCertificates()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return
    try {
      await api.delete(`/certificates/${id}`)
      toast.success('Certificate deleted!')
      fetchCertificates()
    } catch (err) {
      toast.error('Failed to delete!')
    }
  }

  const handleEdit = (cert) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      return dateStr.split('T')[0]
    }
    setForm({
      title: cert.title,
      platform: cert.platform,
      description: cert.description || '',
      issued_date: formatDate(cert.issued_date),
      credential_url: cert.credential_url || '',
      is_featured: cert.is_featured || false,
      image: null,
      image_url: cert.image_url || '',
      logo: null,
      logo_url: cert.logo_url || ''
    })
    setEditId(cert.id)
    setShowForm(true)
    setImagePreview(cert.image_url || null)
    setLogoPreview(cert.logo_url || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Manage Certificates
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {certificates.length} total · <span style={{ color: '#f59e0b', fontWeight: 600 }}>⭐ {featuredCount}/6 on home</span>
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setImagePreview(null); setLogoPreview(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff', border: 'none', padding: '0.7rem 1.4rem',
            borderRadius: '12px', fontWeight: 600,
            fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <FiPlus size={16} /> Add Certificate
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff', borderRadius: '16px',
            padding: '1.5rem', border: '1px solid #e2e8f0',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '1.2rem'
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              {editId ? 'Edit Certificate' : 'Add Certificate'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setImagePreview(null) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Certificate Image
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', border: '2px dashed #e2e8f0',
              borderRadius: '10px', background: '#f8fafc'
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.85rem'
              }}>
                <FiUpload size={14} /> Upload Image
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
              {imagePreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={imagePreview} alt="preview" style={{
                    width: '48px', height: '48px',
                    borderRadius: '8px', objectFit: 'contain',
                    border: '1px solid #e2e8f0', background: '#fff', padding: '2px'
                  }} />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setForm(prev => ({ ...prev, image: null, image_url: '' }))
                    }}
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Platform Picker */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Platform
            </label>
            <button
              onClick={() => setShowPlatformPicker(!showPlatformPicker)}
              style={{
                width: '100%', padding: '0.8rem',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                background: '#f8fafc', color: '#0f172a',
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontWeight: 600, fontSize: '0.9rem'
              }}
            >
              {form.platform ? (
                <>
                  {platformIcons[form.platform]}
                  {form.platform}
                </>
              ) : 'Choose a platform...'}
            </button>

            {showPlatformPicker && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem', marginTop: '0.8rem',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                padding: '1rem', background: '#f8fafc'
              }}>
                {platformList.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handleSelectPlatform(platform)}
                    style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '0.4rem',
                      padding: '0.8rem',
                      borderRadius: '10px',
                      border: form.platform === platform ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                      background: form.platform === platform ? 'rgba(124,58,237,0.1)' : '#fff',
                      cursor: 'pointer',
                      fontWeight: form.platform === platform ? 600 : 400,
                      fontSize: '0.75rem', color: '#0f172a'
                    }}
                  >
                    {platformIcons[platform]}
                    {platform}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Platform Logo Upload */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Platform Logo Image (Optional)
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', border: '2px dashed #e2e8f0',
              borderRadius: '10px', background: '#f8fafc'
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.85rem'
              }}>
                <FiUpload size={14} /> Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
              </label>
              {logoPreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={logoPreview} alt="preview" style={{
                    width: '48px', height: '48px',
                    borderRadius: '8px', objectFit: 'contain',
                    border: '1px solid #e2e8f0', background: '#fff', padding: '2px'
                  }} />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null)
                      setForm(prev => ({ ...prev, logo: null, logo_url: '' }))
                    }}
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
              }}>
                Certificate Title
              </label>
              <input
                type="text"
                placeholder="e.g., Cloud Fundamentals"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{
                  width: '100%', padding: '0.7rem 0.9rem',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.85rem', background: '#f8fafc',
                  color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
              }}>
                Issue Date
              </label>
              <input
                type="date"
                value={form.issued_date}
                onChange={e => setForm({ ...form, issued_date: e.target.value })}
                style={{
                  width: '100%', padding: '0.7rem 0.9rem',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.85rem', background: '#f8fafc',
                  color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Description
            </label>
            <textarea
              placeholder="Certificate description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              style={{
                width: '100%', padding: '0.7rem 0.9rem',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                fontSize: '0.85rem', background: '#f8fafc',
                color: '#0f172a', outline: 'none', resize: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Credential URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={form.credential_url}
              onChange={e => setForm({ ...form, credential_url: e.target.value })}
              style={{
                width: '100%', padding: '0.7rem 0.9rem',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                fontSize: '0.85rem', background: '#f8fafc',
                color: '#0f172a', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Show on Home Toggle */}
          <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: form.is_featured ? 'rgba(245,158,11,0.1)' : '#f8fafc',
            borderRadius: '10px',
            border: form.is_featured ? '2px solid #f59e0b' : '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <FiStar size={20} color={form.is_featured ? '#f59e0b' : '#94a3b8'} fill={form.is_featured ? '#f59e0b' : 'none'} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  Show on Home Page
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Display this certificate on home page (max 6)
                </div>
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: form.is_featured ? '#f59e0b' : '#e2e8f0',
              borderRadius: '12px',
              position: 'relative',
              transition: 'all 0.3s'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                background: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: form.is_featured ? '23px' : '3px',
                transition: 'all 0.3s'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff', border: 'none', padding: '0.7rem 1.4rem',
                borderRadius: '10px', fontWeight: 600,
                fontSize: '0.85rem', cursor: 'pointer'
              }}
            >
              <FiCheck size={16} />
              {loading ? 'Saving...' : editId ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setImagePreview(null) }}
              style={{
                background: '#f1f5f9', color: '#64748b',
                border: 'none', padding: '0.7rem 1.4rem',
                borderRadius: '10px', fontWeight: 600,
                fontSize: '0.85rem', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Certificates Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem'
      }}>
        {certificates.length === 0 ? (
          <div style={{
            gridColumn: '1/-1', padding: '3rem',
            textAlign: 'center', color: '#94a3b8',
            background: '#fff', borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            No certificates yet. Add your first certificate!
          </div>
        ) : (
          certificates.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: '#fff', borderRadius: '16px',
                padding: '1.2rem', border: '1px solid #e2e8f0'
              }}
            >
              {cert.image_url && (
                <img src={cert.image_url} alt={cert.title} style={{
                  width: '100%', height: '150px',
                  borderRadius: '10px', objectFit: 'cover',
                  marginBottom: '1rem'
                }} />
              )}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '0.8rem'
              }}>
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
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  flexShrink: 0
                }}>
                  {cert.logo_url ? (
                    <img 
                      src={cert.logo_url} 
                      alt={cert.platform} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  ) : platformIcons[cert.platform] ? (
                    platformIcons[cert.platform]
                  ) : (
                    <div style={{ fontSize: '1.4rem' }}>🏆</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleToggleFeatured(cert)}
                    title={cert.is_featured ? 'Remove from home' : 'Show on home'}
                    style={{
                      width: '28px', height: '28px',
                      borderRadius: '6px', border: 'none',
                      background: cert.is_featured ? '#f59e0b' : 'rgba(245,158,11,0.1)',
                      color: cert.is_featured ? '#fff' : '#f59e0b',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <FiStar size={13} fill={cert.is_featured ? '#fff' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleEdit(cert)}
                    style={{
                      width: '28px', height: '28px',
                      borderRadius: '6px', border: 'none',
                      background: 'rgba(124,58,237,0.1)',
                      color: '#7c3aed', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    style={{
                      width: '28px', height: '28px',
                      borderRadius: '6px', border: 'none',
                      background: 'rgba(239,68,68,0.1)',
                      color: '#ef4444', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
              <h3 style={{
                fontWeight: 700, fontSize: '0.95rem',
                color: '#0f172a', marginBottom: '0.3rem'
              }}>
                {cert.title}
              </h3>
              <p style={{
                fontSize: '0.75rem', fontWeight: 600,
                color: '#7c3aed', marginBottom: '0.5rem'
              }}>
                {cert.platform}
              </p>
              <p style={{
                fontSize: '0.8rem', color: '#64748b',
                lineHeight: 1.5, marginBottom: '0.8rem'
              }}>
                {cert.description}
              </p>
              <p style={{
                fontSize: '0.75rem', color: '#94a3b8'
              }}>
                {new Date(cert.issued_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageCertificates