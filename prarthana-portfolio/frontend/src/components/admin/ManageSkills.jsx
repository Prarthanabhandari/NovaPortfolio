import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiSearch, FiStar, FiUpload } from 'react-icons/fi'

const popularIcons = [
  'logos:react', 'logos:javascript', 'logos:typescript', 'logos:nodejs',
  'logos:python', 'logos:html-5', 'logos:css-3', 'logos:tailwindcss-icon',
  'logos:postgresql', 'logos:mongodb', 'logos:mysql', 'logos:redis',
  'logos:git-icon', 'logos:github-icon', 'logos:docker-icon', 'logos:aws',
  'logos:firebase', 'logos:vue', 'logos:angular-icon', 'logos:nextjs-icon',
  'logos:express', 'logos:bootstrap', 'logos:sass', 'logos:php',
  'logos:java', 'logos:c', 'logos:cplusplus', 'logos:csharp',
  'logos:figma', 'logos:visual-studio-code', 'logos:linux-tux', 'logos:graphql'
]

const emptyForm = {
  name: '',
  icon: '',
  description: '',
  proficiency_level: 'Intermediate',
  organization: '',
  is_featured: false,
  image: null,
  image_url: ''
}

const ManageSkills = () => {
  const [skills, setSkills] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [iconSearch, setIconSearch] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills')
      setSkills(res.data)
    } catch (err) {
      toast.error('Failed to fetch skills')
    }
  }

  useEffect(() => { fetchSkills() }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

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

  const displayedIcons = iconSearch.trim()
    ? apiIcons
    : popularIcons

  const featuredCount = skills.filter(s => s.is_featured).length

  const handleSubmit = async () => {
    if (!form.name || (!form.icon && !form.image && !form.image_url)) {
      toast.error('Name and either an Icon or custom Logo Image are required!')
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('icon', form.icon || '')
      formData.append('description', form.description || '')
      formData.append('proficiency_level', form.proficiency_level)
      formData.append('organization', form.organization || '')
      formData.append('is_featured', form.is_featured)
      if (form.image) {
        formData.append('image', form.image)
      }

      if (editId) {
        await api.put(`/skills/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Skill updated!')
      } else {
        await api.post('/skills', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Skill added!')
      }
      setForm(emptyForm)
      setImagePreview(null)
      setShowForm(false)
      setEditId(null)
      fetchSkills()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async (skill) => {
    try {
      // Limit to 9 featured
      if (!skill.is_featured && featuredCount >= 9) {
        toast.error('Maximum 9 skills can be featured on home page!')
        return
      }
      await api.patch(`/skills/${skill.id}/feature`)
      toast.success(skill.is_featured ? 'Removed from home' : 'Added to home!')
      fetchSkills()
    } catch (err) {
      toast.error('Failed to update!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return
    try {
      await api.delete(`/skills/${id}`)
      toast.success('Skill deleted!')
      fetchSkills()
    } catch (err) {
      toast.error('Failed to delete!')
    }
  }

  const handleEdit = (skill) => {
    setForm({
      name: skill.name,
      icon: skill.icon || '',
      description: skill.description || '',
      proficiency_level: skill.proficiency_level || 'Intermediate',
      organization: skill.organization || '',
      is_featured: skill.is_featured || false,
      image: null,
      image_url: skill.image_url || ''
    })
    setImagePreview(skill.image_url || null)
    setEditId(skill.id)
    setShowForm(true)
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
            Manage Skills
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {skills.length} total · <span style={{ color: '#f59e0b', fontWeight: 600 }}>⭐ {featuredCount}/9 on home</span>
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setImagePreview(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff', border: 'none', padding: '0.7rem 1.4rem',
            borderRadius: '12px', fontWeight: 600,
            fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <FiPlus size={16} /> Add Skill
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
              {editId ? 'Edit Skill' : 'Add Skill'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setImagePreview(null) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Skill Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Skill Name
            </label>
            <input
              type="text"
              placeholder="e.g., React, Python, Docker"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{
                width: '100%', padding: '0.7rem 0.9rem',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                fontSize: '0.85rem', background: '#f8fafc',
                color: '#0f172a', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Icon Picker with Search */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Icon (Selected: {form.icon || 'None'})
            </label>
            
            <div style={{ position: 'relative', marginBottom: '0.8rem' }}>
              <FiSearch size={16} style={{
                position: 'absolute', left: '0.8rem', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8'
              }} />
              <input
                type="text"
                placeholder="Search icons (e.g., react, python, docker)..."
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
                style={{
                  width: '100%', padding: '0.7rem 0.9rem 0.7rem 2.4rem',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.85rem', background: '#f8fafc',
                  color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {form.icon && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                padding: '0.8rem', background: '#f0f9ff',
                borderRadius: '10px', marginBottom: '0.8rem',
                border: '2px solid #7c3aed'
              }}>
                <Icon icon={form.icon} width="32" height="32" />
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  {form.icon}
                </span>
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
              gap: '0.5rem', maxHeight: '200px', overflowY: 'auto',
              padding: '0.8rem', background: '#f8fafc',
              borderRadius: '10px', border: '1px solid #e2e8f0'
            }}>
              {displayedIcons.map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => setForm({ ...form, icon: iconName })}
                  style={{
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: form.icon === iconName ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    background: form.icon === iconName ? 'rgba(124,58,237,0.1)' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={iconName}
                >
                  <Icon icon={iconName} width="24" height="24" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Logo Upload */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Custom Logo Image (Optional)
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

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Description
            </label>
            <textarea
              placeholder="Describe your experience with this skill..."
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

          {/* Proficiency + Organization */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '1rem', marginBottom: '1rem'
          }}>
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
              }}>
                Proficiency
              </label>
              <select
                value={form.proficiency_level}
                onChange={e => setForm({ ...form, proficiency_level: e.target.value })}
                style={{
                  width: '100%', padding: '0.7rem 0.9rem',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.85rem', background: '#f8fafc',
                  color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
              }}>
                Organization (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Coursera, Udemy"
                value={form.organization}
                onChange={e => setForm({ ...form, organization: e.target.value })}
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
                  Display this skill in the About section (max 9)
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

      {/* Skills Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem'
      }}>
        {skills.length === 0 ? (
          <div style={{
            gridColumn: '1/-1', padding: '3rem',
            textAlign: 'center', color: '#94a3b8',
            background: '#fff', borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            No skills yet. Add your first skill!
          </div>
        ) : (
          skills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: '#fff', borderRadius: '16px',
                padding: '1.2rem',
                border: skill.is_featured ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                position: 'relative'
              }}
            >
              {skill.is_featured && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '12px',
                  background: '#f59e0b',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  ⭐ On Home
                </div>
              )}
              
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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
                    {skill.image_url ? (
                      <img 
                        src={skill.image_url} 
                        alt={skill.name} 
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }} 
                      />
                    ) : skill.icon ? (
                      <Icon icon={skill.icon} width="28" height="28" />
                    ) : (
                      <div style={{ fontSize: '1.4rem' }}>🔧</div>
                    )}
                  </div>
                  <div>
                    <h3 style={{
                      fontWeight: 700, fontSize: '0.95rem',
                      color: '#0f172a', margin: 0
                    }}>
                      {skill.name}
                    </h3>
                    <p style={{
                      fontSize: '0.7rem', color: '#7c3aed',
                      margin: 0, fontWeight: 600
                    }}>
                      {skill.proficiency_level || 'Intermediate'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {/* Featured Toggle Button */}
                  <button
                    onClick={() => handleToggleFeatured(skill)}
                    title={skill.is_featured ? 'Remove from home' : 'Show on home'}
                    style={{
                      width: '28px', height: '28px',
                      borderRadius: '6px', border: 'none',
                      background: skill.is_featured ? '#f59e0b' : 'rgba(245,158,11,0.1)',
                      color: skill.is_featured ? '#fff' : '#f59e0b',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <FiStar size={13} fill={skill.is_featured ? '#fff' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleEdit(skill)}
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
                    onClick={() => handleDelete(skill.id)}
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
              {skill.description && (
                <p style={{
                  fontSize: '0.8rem', color: '#64748b',
                  lineHeight: 1.5, margin: 0
                }}>
                  {skill.description}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageSkills