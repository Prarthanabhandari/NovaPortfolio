import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload, FiSearch, FiFileText, FiAward } from 'react-icons/fi'

const popularIcons = [
  'logos:google-icon', 'logos:microsoft-icon', 'logos:amazon-icon',
  'logos:meta-icon', 'logos:netflix', 'logos:apple', 'logos:tesla-9',
  'logos:github-icon', 'logos:gitlab', 'logos:bitbucket',
  'logos:slack-icon', 'logos:zoom', 'logos:discord-icon',
  'logos:notion-icon', 'logos:figma', 'logos:adobe',
  'mdi:briefcase', 'mdi:office-building', 'mdi:laptop',
  'mdi:account-tie', 'mdi:school', 'mdi:rocket-launch',
  'mdi:domain', 'mdi:store', 'mdi:bank',
  'logos:ibm', 'logos:oracle', 'logos:salesforce',
  'logos:linkedin-icon', 'logos:twitter', 'logos:youtube-icon',
  'logos:spotify-icon', 'logos:airbnb-icon', 'logos:uber',
  'logos:dropbox', 'logos:stripe', 'logos:paypal',
  'logos:shopify', 'logos:wordpress-icon', 'logos:wix'
]

const emptyForm = {
  job_title: '',
  company: '',
  location: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: false,
  icon: '',
  image: null,
  offer_letter: null,
  completion_certificate: null
}

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [iconSearch, setIconSearch] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [offerLetterName, setOfferLetterName] = useState('')
  const [certificateName, setCertificateName] = useState('')
  const [apiIcons, setApiIcons] = useState([])
  const [searchingIcons, setSearchingIcons] = useState(false)

  useEffect(() => {
    if (!iconSearch.trim()) {
      setApiIcons([])
      return
    }
    setSearchingIcons(true)
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(iconSearch)}&limit=40`)
        const data = await res.json()
        setApiIcons(data.icons || [])
      } catch (err) {
        console.error('Failed to search icons:', err)
      } finally {
        setSearchingIcons(false)
      }
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [iconSearch])

  const fetchExperience = async () => {
    try {
      const res = await api.get('/experience')
      setExperiences(res.data)
    } catch (err) {
      toast.error('Failed to fetch experience')
    }
  }

  useEffect(() => { fetchExperience() }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, image: file })
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleOfferLetterChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, offer_letter: file })
      setOfferLetterName(file.name)
    }
  }

  const handleCertificateChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, completion_certificate: file })
      setCertificateName(file.name)
    }
  }

  const handleSubmit = async () => {
    if (!form.job_title || !form.company || !form.start_date) {
      toast.error('Job Title, Company, and Start Date required!')
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('job_title', form.job_title)
      formData.append('company', form.company)
      formData.append('location', form.location)
      formData.append('description', form.description)
      formData.append('start_date', form.start_date)
      formData.append('end_date', form.end_date)
      formData.append('is_current', form.is_current)
      formData.append('icon', form.icon)
      if (form.image) formData.append('image', form.image)
      if (form.offer_letter) formData.append('offer_letter', form.offer_letter)
      if (form.completion_certificate) formData.append('completion_certificate', form.completion_certificate)

      if (editId) {
        await api.put(`/experience/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Experience updated!')
      } else {
        await api.post('/experience', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Experience added!')
      }
      setForm(emptyForm)
      setImagePreview(null)
      setOfferLetterName('')
      setCertificateName('')
      setShowForm(false)
      setEditId(null)
      fetchExperience()
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return
    try {
      await api.delete(`/experience/${id}`)
      toast.success('Deleted!')
      fetchExperience()
    } catch (err) {
      toast.error('Failed to delete!')
    }
  }

  const handleEdit = (exp) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      return dateStr.split('T')[0]
    }
    setForm({
      ...exp,
      start_date: formatDate(exp.start_date),
      end_date: formatDate(exp.end_date)
    })
    setEditId(exp.id)
    setShowForm(true)
    setImagePreview(exp.image_url || null)
    setOfferLetterName(exp.offer_letter_url ? 'Current Offer Letter' : '')
    setCertificateName(exp.completion_certificate_url ? 'Current Certificate' : '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const displayedIcons = iconSearch.trim()
    ? apiIcons
    : popularIcons

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Manage Experience
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {experiences.length} experiences total
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setImagePreview(null); setOfferLetterName(''); setCertificateName(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff', border: 'none', padding: '0.7rem 1.4rem',
            borderRadius: '12px', fontWeight: 600,
            fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <FiPlus size={16} /> Add Experience
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
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
              {editId ? 'Edit Experience' : 'Add Experience'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setImagePreview(null); setOfferLetterName(''); setCertificateName('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Company Logo / Image
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
                <FiUpload size={14} /> Upload
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

          {/* OFFER LETTER UPLOAD */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              📄 Offer Letter (PDF / Image)
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', border: '2px dashed #3b82f6',
              borderRadius: '10px', background: 'rgba(59,130,246,0.05)'
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                color: '#fff', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.85rem'
              }}>
                <FiFileText size={14} /> Upload Offer Letter
                <input type="file" accept=".pdf,image/*" onChange={handleOfferLetterChange} style={{ display: 'none' }} />
              </label>
              {offerLetterName && (
                <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>
                  ✓ {offerLetterName}
                </span>
              )}
            </div>
          </div>

          {/* COMPLETION CERTIFICATE UPLOAD */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              🏆 Experience Completion Certificate (PDF / Image)
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', border: '2px dashed #22c55e',
              borderRadius: '10px', background: 'rgba(34,197,94,0.05)'
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#fff', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.85rem'
              }}>
                <FiAward size={14} /> Upload Certificate
                <input type="file" accept=".pdf,image/*" onChange={handleCertificateChange} style={{ display: 'none' }} />
              </label>
              {certificateName && (
                <span style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 600 }}>
                  ✓ {certificateName}
                </span>
              )}
            </div>
          </div>

          {/* Icon Search */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Icon (Selected: {form.icon || 'none'})
            </label>
            <div style={{ position: 'relative', marginBottom: '0.8rem' }}>
              <FiSearch style={{
                position: 'absolute', left: '0.8rem', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8'
              }} size={16} />
              <input
                type="text"
                placeholder="Search icons (e.g., google, microsoft, github)..."
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
                style={{
                  width: '100%', padding: '0.7rem 0.9rem 0.7rem 2.5rem',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.85rem', boxSizing: 'border-box'
                }}
              />
            </div>
            {form.icon && (
              <div style={{
                padding: '1rem', border: '2px solid #7c3aed',
                borderRadius: '10px', background: 'rgba(124,58,237,0.05)',
                marginBottom: '0.8rem',
                display: 'flex', alignItems: 'center', gap: '1rem'
              }}>
                <Icon icon={form.icon} width="40" height="40" />
                <span style={{ fontWeight: 600 }}>{form.icon}</span>
              </div>
            )}

            {searchingIcons && (
              <p style={{ fontSize: '0.8rem', color: '#7c3aed', margin: '0 0 0.6rem 0.2rem', fontWeight: 600 }}>
                🔍 Searching Iconify database...
              </p>
            )}
            {!searchingIcons && iconSearch.trim() !== '' && apiIcons.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: '0 0 0.6rem 0.2rem', fontWeight: 600 }}>
                ❌ No icons found for "{iconSearch}"
              </p>
            )}

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '0.5rem', maxHeight: '250px', overflowY: 'auto',
              border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.8rem'
            }}>
              {displayedIcons.map((iconName, i) => (
                <button
                  key={i}
                  onClick={() => setForm({ ...form, icon: iconName })}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0.8rem', borderRadius: '8px',
                    border: form.icon === iconName ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    background: '#fff', cursor: 'pointer',
                    minHeight: '50px'
                  }}
                  title={iconName}
                >
                  <Icon icon={iconName} width="28" height="28" />
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              💡 Type any Iconify name like "logos:google-icon", "mdi:briefcase", "carbon:building"
            </p>
          </div>

          {/* Job Title & Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Software Engineer"
                value={form.job_title}
                onChange={e => setForm({ ...form, job_title: e.target.value })}
                style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Company *
              </label>
              <input
                type="text"
                placeholder="e.g., Google"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., Bangalore, India"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Start Date *
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })}
                style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                End Date {form.is_current && '(Disabled)'}
              </label>
              <input
                type="date"
                disabled={form.is_current}
                value={form.end_date}
                onChange={e => setForm({ ...form, end_date: e.target.value })}
                style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', boxSizing: 'border-box', opacity: form.is_current ? 0.5 : 1 }}
              />
            </div>
          </div>

          {/* Currently Working */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600
            }}>
              <input
                type="checkbox"
                checked={form.is_current}
                onChange={e => setForm({ ...form, is_current: e.target.checked, end_date: e.target.checked ? '' : form.end_date })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              I currently work here
            </label>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Description
            </label>
            <textarea
              placeholder="Describe your role and achievements..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
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
              onClick={() => { setShowForm(false); setEditId(null); setImagePreview(null); setOfferLetterName(''); setCertificateName('') }}
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

      {/* List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {experiences.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            No experiences yet. Add your first!
          </div>
        ) : (
          experiences.map(exp => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: '#fff', borderRadius: '16px',
                padding: '1.2rem', border: '1px solid #e2e8f0',
                display: 'flex', gap: '1rem', alignItems: 'center'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
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
                {exp.image_url ? (
                  <img 
                    src={exp.image_url} 
                    alt={exp.company} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                ) : exp.icon ? (
                  <Icon icon={exp.icon} width="28" height="28" />
                ) : (
                  <div style={{ fontSize: '1.4rem' }}>💼</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 0.2rem 0', color: '#0f172a' }}>
                  {exp.job_title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#7c3aed', margin: '0 0 0.3rem 0', fontWeight: 600 }}>
                  {exp.company} {exp.is_current && '• CURRENT'}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                  {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {exp.offer_letter && (
                    <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 600 }}>📄 Offer Letter</span>
                  )}
                  {exp.completion_certificate && (
                    <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>🏆 Certificate</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(exp)}
                  style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', cursor: 'pointer' }}
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageExperience