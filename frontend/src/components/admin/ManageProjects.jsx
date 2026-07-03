import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'
import useWindowSize from '../../hooks/useWindowSize'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload, FiStar } from 'react-icons/fi'
import { FaReact, FaNode, FaDatabase, FaHtml5, FaCss3, FaJs, FaPython, FaJava, FaPhp, FaGitAlt, FaDocker, FaAws } from 'react-icons/fa'
import { SiPostgresql, SiMongodb, SiMysql, SiRedis, SiTailwindcss, SiVuedotjs, SiAngular, SiGraphql, SiFirebase, SiExpress } from 'react-icons/si'

const techIcons = {
  'React': <FaReact size={18} color="#61dafb" />,
  'Node.js': <FaNode size={18} color="#68a063" />,
  'JavaScript': <FaJs size={18} color="#f7df1e" />,
  'TypeScript': <FaJs size={18} color="#3178c6" />,
  'Python': <FaPython size={18} color="#3776ab" />,
  'Java': <FaJava size={18} color="#007396" />,
  'PHP': <FaPhp size={18} color="#777bb4" />,
  'Express.js': <SiExpress size={18} color="#000" />,
  'PostgreSQL': <SiPostgresql size={18} color="#336791" />,
  'MongoDB': <SiMongodb size={18} color="#4db33d" />,
  'MySQL': <SiMysql size={18} color="#00758f" />,
  'Redis': <SiRedis size={18} color="#dc382d" />,
  'HTML5': <FaHtml5 size={18} color="#e34f26" />,
  'CSS3': <FaCss3 size={18} color="#264de4" />,
  'Tailwind CSS': <SiTailwindcss size={18} color="#06b6d4" />,
  'Vue.js': <SiVuedotjs size={18} color="#4fc08d" />,
  'Angular': <SiAngular size={18} color="#dd0031" />,
  'GraphQL': <SiGraphql size={18} color="#e10098" />,
  'Firebase': <SiFirebase size={18} color="#ffa000" />,
  'Docker': <FaDocker size={18} color="#2496ed" />,
  'Git': <FaGitAlt size={18} color="#f1502f" />,
  'AWS': <FaAws size={18} color="#ff9900" />,
}

const techList = Object.keys(techIcons)

const emptyForm = {
  title: '', description: '', technologies: [],
  github_link: '', live_link: '', status: 'published', image: null,
  images: [], existingImages: [],
  document: null, document_url: '',
  is_featured: false,
  start_date: '', end_date: '', achievements: ''
}

const ManageProjects = () => {
  const { isMobile } = useWindowSize()
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imagesPreview, setImagesPreview] = useState([])
  const [showTechPicker, setShowTechPicker] = useState(false)

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setProjects(res.data)
    } catch (err) {
      toast.error('Failed to fetch projects')
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const featuredCount = projects.filter(p => p.is_featured).length

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, image: file })
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }))

      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagesPreview(prev => [...prev, { file, url: reader.result }])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeExistingImage = (imgUrl) => {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img !== imgUrl)
    }))
  }

  const removeNewImage = (fileToRemove) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(f => f !== fileToRemove)
    }))
    setImagesPreview(prev => prev.filter(p => p.file !== fileToRemove))
  }

  const handleDocumentChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, document: file }))
    }
  }

  const toggleTechnology = (tech) => {
    setForm(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }))
  }

  const removeTechnology = (tech) => {
    setForm(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description || form.technologies.length === 0) {
      toast.error('Title, description, and at least one technology required!')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('technologies', JSON.stringify(form.technologies))
      formData.append('github_link', form.github_link)
      formData.append('live_link', form.live_link)
      formData.append('status', form.status)
      formData.append('is_featured', form.is_featured)
      formData.append('start_date', form.start_date)
      formData.append('end_date', form.end_date)
      formData.append('achievements', form.achievements)
      if (form.image) formData.append('image', form.image)
      if (form.document) formData.append('document', form.document)

      formData.append('images', JSON.stringify(form.existingImages))
      form.images.forEach(file => {
        formData.append('images', file)
      })

      if (editId) {
        await api.put(`/projects/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Project updated!')
      } else {
        await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Project added!')
      }

      setForm(emptyForm)
      setImagePreview(null)
      setImagesPreview([])
      setShowForm(false)
      setEditId(null)
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      return dateStr.split('T')[0]
    }
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies || [],
      github_link: project.github_link || '',
      live_link: project.live_link || '',
      status: project.status || 'published',
      image: null,
      images: [],
      existingImages: project.images || [],
      document: null,
      document_url: project.document_url || '',
      is_featured: project.is_featured || false,
      start_date: formatDate(project.start_date),
      end_date: formatDate(project.end_date),
      achievements: project.achievements || ''
    })
    setImagePreview(project.image_url || null)
    setImagesPreview([])
    setEditId(project.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleFeatured = async (project) => {
    try {
      if (!project.is_featured && featuredCount >= 6) {
        toast.error('Maximum 6 projects can be featured on home page!')
        return
      }
      await api.patch(`/projects/${project.id}/feature`)
      toast.success(project.is_featured ? 'Removed from home' : 'Added to home!')
      fetchProjects()
    } catch (err) {
      toast.error('Failed to update!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success('Project deleted!')
      fetchProjects()
    } catch (err) {
      toast.error('Failed to delete!')
    }
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Manage Projects
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {projects.length} total · <span style={{ color: '#f59e0b', fontWeight: 600 }}>⭐ {featuredCount}/6 on home</span>
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setImagePreview(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none', padding: '0.7rem 1.4rem',
            borderRadius: '12px', fontWeight: 600,
            fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <FiPlus size={16} /> Add Project
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
              {editId ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditId(null); setImagePreview(null) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Project Image & Screenshots */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Cover Image */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
              }}>
                Cover Image
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem', border: '2px dashed #e2e8f0',
                borderRadius: '10px', background: '#f8fafc',
                height: '80px', boxSizing: 'border-box'
              }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap'
                }}>
                  <FiUpload size={14} /> Upload Cover
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
                {imagePreview && (
                  <div style={{ position: 'relative' }}>
                    <img src={imagePreview} alt="preview" style={{
                      width: '50px', height: '50px',
                      borderRadius: '8px', objectFit: 'cover'
                    }} />
                    <button type="button" onClick={() => { setForm({ ...form, image: null }); setImagePreview(null) }} style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      background: '#ef4444', color: '#fff', border: 'none',
                      borderRadius: '50%', width: '16px', height: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', cursor: 'pointer'
                    }}>
                      <FiX size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Screenshots Gallery */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
              }}>
                Project Screenshots / Gallery
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem', border: '2px dashed #e2e8f0',
                borderRadius: '10px', background: '#f8fafc',
                height: '80px', boxSizing: 'border-box', overflowX: 'auto'
              }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#fff', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap'
                }}>
                  <FiUpload size={14} /> Upload Screenshots
                  <input type="file" multiple accept="image/*" onChange={handleMultipleImagesChange} style={{ display: 'none' }} />
                </label>
                
                {/* Previews list */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowY: 'hidden' }}>
                  {form.existingImages && form.existingImages.map((imgUrl, idx) => (
                    <div key={`exist-${idx}`} style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={imgUrl} alt="gallery" style={{
                        width: '50px', height: '50px',
                        borderRadius: '8px', objectFit: 'cover',
                        border: '1px solid #cbd5e1'
                      }} />
                      <button type="button" onClick={() => removeExistingImage(imgUrl)} style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        background: '#ef4444', color: '#fff', border: 'none',
                        borderRadius: '50%', width: '16px', height: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', cursor: 'pointer'
                      }}>
                        <FiX size={10} />
                      </button>
                    </div>
                  ))}
                  {imagesPreview.map((preview, idx) => (
                    <div key={`new-${idx}`} style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={preview.url} alt="new-gallery" style={{
                        width: '50px', height: '50px',
                        borderRadius: '8px', objectFit: 'cover',
                        border: '1px solid #93c5fd'
                      }} />
                      <button type="button" onClick={() => removeNewImage(preview.file)} style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        background: '#ef4444', color: '#fff', border: 'none',
                        borderRadius: '50%', width: '16px', height: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', cursor: 'pointer'
                      }}>
                        <FiX size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Project Document / PDF (e.g. Architecture, Reports, Diagrams)
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', border: '2px dashed #e2e8f0',
              borderRadius: '10px', background: '#f8fafc'
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.85rem'
              }}>
                <FiUpload size={14} /> Upload PDF/Doc
                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleDocumentChange} style={{ display: 'none' }} />
              </label>
              <div>
                {form.document ? (
                  <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }}>
                    📁 {form.document.name}
                  </span>
                ) : form.document_url ? (
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Current document: <a href={form.document_url} target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'underline', fontWeight: 600 }}>View Document</a>
                  </span>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    No document uploaded (PDF, Word, PPT)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Project Title & Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
              }}>
                Project Title
              </label>
              <input
                type="text"
                placeholder="E-Commerce Website"
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
                GitHub Link
              </label>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={form.github_link}
                onChange={e => setForm({ ...form, github_link: e.target.value })}
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
                Live Link
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={form.live_link}
                onChange={e => setForm({ ...form, live_link: e.target.value })}
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
                Status
              </label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                style={{
                  width: '100%', padding: '0.7rem 0.9rem',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.85rem', background: '#f8fafc',
                  color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Project Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 600,
                color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
              }}>
                Start Date
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })}
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
                End Date (Optional)
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={e => setForm({ ...form, end_date: e.target.value })}
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

          {/* Achievements / Key Highlights */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Achievements / Key Highlights (Markdown or text)
            </label>
            <textarea
              placeholder="E.g., Optimized page load times by 40%..."
              value={form.achievements}
              onChange={e => setForm({ ...form, achievements: e.target.value })}
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

          {/* Technologies Picker */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase'
            }}>
              Technologies
            </label>
            
            {form.technologies.length > 0 && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
                marginBottom: '0.8rem'
              }}>
                {form.technologies.map(tech => (
                  <div
                    key={tech}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.4rem 0.8rem',
                      background: 'rgba(99,102,241,0.1)',
                      borderRadius: '20px',
                      border: '1px solid #6366f1'
                    }}
                  >
                    {techIcons[tech]}
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600,
                      color: '#6366f1'
                    }}>
                      {tech}
                    </span>
                    <button
                      onClick={() => removeTechnology(tech)}
                      style={{
                        background: 'none', border: 'none',
                        color: '#6366f1', cursor: 'pointer',
                        fontSize: '1rem', padding: '0',
                        marginLeft: '0.2rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowTechPicker(!showTechPicker)}
              style={{
                width: '100%', padding: '0.8rem',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                background: '#f8fafc', color: '#0f172a',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
              }}
            >
              + Add Technology
            </button>

            {showTechPicker && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem', marginTop: '0.8rem',
                maxHeight: '250px', overflowY: 'auto',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                padding: '1rem', background: '#f8fafc'
              }}>
                {techList.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechnology(tech)}
                    style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '0.4rem',
                      padding: '0.8rem',
                      borderRadius: '10px',
                      border: form.technologies.includes(tech) ? '2px solid #6366f1' : '1px solid #e2e8f0',
                      background: form.technologies.includes(tech) ? 'rgba(99,102,241,0.1)' : '#fff',
                      cursor: 'pointer',
                      fontWeight: form.technologies.includes(tech) ? 600 : 400,
                      fontSize: '0.75rem', color: '#0f172a',
                      transition: 'all 0.2s'
                    }}
                  >
                    {techIcons[tech]}
                    {tech}
                  </button>
                ))}
              </div>
            )}
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
              placeholder="Project description..."
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
                  Display this project on home page (max 6)
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
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', padding: '0.7rem 1.4rem',
                borderRadius: '10px', fontWeight: 600,
                fontSize: '0.85rem', cursor: 'pointer'
              }}
            >
              <FiCheck size={16} />
              {loading ? 'Saving...' : editId ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null) }}
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

      {/* Projects List */}
      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Title', 'Technologies', 'Status', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '1rem 1.2rem', textAlign: 'left',
                  fontSize: '0.75rem', fontWeight: 700,
                  color: '#64748b', textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} style={{
                  padding: '3rem', textAlign: 'center',
                  color: '#94a3b8', fontSize: '0.88rem'
                }}>
                  No projects yet. Add your first project!
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.2s',
                  background: project.is_featured ? 'rgba(245,158,11,0.05)' : 'transparent'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = project.is_featured ? 'rgba(245,158,11,0.05)' : 'transparent'}
                >
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      {project.image_url && (
                        <img src={project.image_url} alt={project.title} style={{
                          width: '40px', height: '40px',
                          borderRadius: '8px', objectFit: 'cover'
                        }} />
                      )}
                      <div>
                        <div style={{ 
                          fontWeight: 600, fontSize: '0.88rem', color: '#0f172a',
                          display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                          {project.title}
                          {project.is_featured && (
                            <span style={{
                              background: '#f59e0b',
                              color: '#fff',
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              ⭐ Home
                            </span>
                          )}
                        </div>
                        <div style={{
                          fontSize: '0.75rem', color: '#94a3b8',
                          maxWidth: '200px', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <div key={i} style={{
                          fontSize: '0.8rem', display: 'flex',
                          alignItems: 'center', gap: '0.3rem',
                          padding: '0.3rem 0.6rem',
                          background: 'rgba(99,102,241,0.08)',
                          color: '#6366f1', borderRadius: '6px'
                        }}>
                          {techIcons[tech]}
                          {tech}
                        </div>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span style={{
                          fontSize: '0.75rem', padding: '0.3rem 0.6rem',
                          color: '#94a3b8'
                        }}>
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700,
                      padding: '0.25rem 0.7rem', borderRadius: '2rem',
                      background: project.status === 'published'
                        ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: project.status === 'published' ? '#10b981' : '#f59e0b'
                    }}>
                      {project.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {/* Featured Toggle */}
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        title={project.is_featured ? 'Remove from home' : 'Show on home'}
                        style={{
                          width: '32px', height: '32px',
                          borderRadius: '8px', border: 'none',
                          background: project.is_featured ? '#f59e0b' : 'rgba(245,158,11,0.1)',
                          color: project.is_featured ? '#fff' : '#f59e0b',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <FiStar size={14} fill={project.is_featured ? '#fff' : 'none'} />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        style={{
                          width: '32px', height: '32px',
                          borderRadius: '8px', border: 'none',
                          background: 'rgba(99,102,241,0.1)',
                          color: '#6366f1', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        style={{
                          width: '32px', height: '32px',
                          borderRadius: '8px', border: 'none',
                          background: 'rgba(239,68,68,0.1)',
                          color: '#ef4444', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageProjects