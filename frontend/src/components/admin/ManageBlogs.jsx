import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload } from 'react-icons/fi'

const emptyForm = {
  title: '',
  summary: '',
  content: '',
  category: 'General',
  tags: '',
  video_url: '',
  is_published: false,
  image: null
}

const standardCategories = [
  'General',
  'Web Design',
  'Frontend',
  'Backend',
  'AI & ML',
  'DevOps',
  'Cyber Security',
  'Database',
  'Mobile Dev',
  'Cloud Computing'
]

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [isOtherSelected, setIsOtherSelected] = useState(false)
  const [deleteImageFlag, setDeleteImageFlag] = useState(false)

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs?admin=true')
      setBlogs(res.data)
    } catch (err) {
      toast.error('Failed to fetch blog posts')
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, image: file }))
      setDeleteImageFlag(false)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setForm(prev => ({ ...prev, image: null }))
    setDeleteImageFlag(true)
  }

  const handleEdit = (blog) => {
    setEditId(blog.id)
    const cat = blog.category || 'General'
    const isCustom = cat && !standardCategories.includes(cat)
    setIsOtherSelected(isCustom)
    setForm({
      title: blog.title,
      summary: blog.summary || '',
      content: blog.content,
      category: cat,
      tags: blog.tags ? blog.tags.join(', ') : '',
      video_url: blog.video_url || '',
      is_published: blog.is_published,
      image: null
    })
    setDeleteImageFlag(false)
    setImagePreview(blog.image_url)
    setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      toast.error('Title and Content are required!')
      return
    }
    
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('content', form.content)
      formData.append('summary', form.summary || '')
      formData.append('category', form.category || 'General')
      formData.append('tags', form.tags || '')
      formData.append('video_url', form.video_url || '')
      formData.append('is_published', form.is_published)
      formData.append('delete_image', deleteImageFlag)
      
      if (form.image) {
        formData.append('image', form.image)
      }

      if (editId) {
        await api.put(`/blogs/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Blog article updated successfully!')
      } else {
        await api.post('/blogs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Blog article published/saved successfully!')
      }

      setForm(emptyForm)
      setIsOtherSelected(false)
      setImagePreview(null)
      setDeleteImageFlag(false)
      setShowForm(false)
      setEditId(null)
      fetchBlogs()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (blog) => {
    try {
      await api.put(`/blogs/${blog.id}`, {
        is_published: !blog.is_published
      })
      toast.success(blog.is_published ? 'Changed to Draft' : 'Article Published!')
      fetchBlogs()
    } catch (err) {
      toast.error('Failed to change status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return
    try {
      await api.delete(`/blogs/${id}`)
      toast.success('Blog post deleted successfully!')
      fetchBlogs()
    } catch (err) {
      toast.error('Failed to delete blog post')
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Manage Blogs</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Write articles and publish technical posts on your site</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setForm(emptyForm)
              setIsOtherSelected(false)
              setImagePreview(null)
              setDeleteImageFlag(false)
              setEditId(null)
              setShowForm(true)
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: '#3b82f6', color: '#fff', border: 'none',
              padding: '0.6rem 1.2rem', borderRadius: '10px',
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
            }}
          >
            <FiPlus /> New Article
          </button>
        )}
      </div>

      {/* Editor Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: '16px', padding: '1.8rem', marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              {editId ? 'Edit Article' : 'Create New Article'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false)
                setForm(emptyForm)
                setDeleteImageFlag(false)
                setEditId(null)
              }}
              style={{
                background: '#f1f5f9', border: 'none',
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#64748b'
              }}
            >
              <FiX />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Building RESTful APIs with Node.js"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* Category + Tags + Video URL Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                  Category
                </label>
                <select
                  value={isOtherSelected ? 'Other' : (form.category || 'General')}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'Other') {
                      setIsOtherSelected(true);
                      setForm({ ...form, category: '' });
                    } else {
                      setIsOtherSelected(false);
                      setForm({ ...form, category: val });
                    }
                  }}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#fff', cursor: 'pointer' }}
                >
                  {standardCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Other">Other (Type Custom...)</option>
                </select>

                {isOtherSelected && (
                  <input
                    type="text"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    placeholder="Type custom category..."
                    style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. node, express, backend"
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                  Video URL (YouTube Link)
                </label>
                <input
                  type="text"
                  value={form.video_url}
                  onChange={e => setForm({ ...form, video_url: e.target.value })}
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                Summary
              </label>
              <textarea
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                rows={2}
                placeholder="A short description of this article to show on cards..."
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                Content (Supports Markdown titles, lists, and code blocks) *
              </label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                rows={10}
                placeholder="Write your article content here..."
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace' }}
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                Cover Image
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {imagePreview ? (
                  <div style={{ position: 'relative', width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute', top: '2px', right: '2px',
                        background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none',
                        width: '18px', height: '18px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: '10px', padding: 0
                      }}
                      title="Remove cover image"
                    >
                      <FiX size={10} />
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.2rem', border: '2px dashed #cbd5e1',
                    borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer',
                    fontWeight: 600, color: '#64748b'
                  }}>
                    <FiUpload /> Upload Image
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            </div>

            {/* Publish Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="is_published"
                checked={form.is_published}
                onChange={e => setForm({ ...form, is_published: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="is_published" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                Publish Article Immediately
              </label>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifySelf: 'end', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm)
                  setDeleteImageFlag(false)
                  setEditId(null)
                }}
                style={{ background: '#f1f5f9', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: '#3b82f6', color: '#fff', border: 'none',
                  padding: '0.7rem 2rem', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* List Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Post</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Category</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                  No blog articles found. Click "New Article" to write your first post!
                </td>
              </tr>
            ) : (
              blogs.map(blog => (
                <tr key={blog.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  {/* Post Details */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '50px', height: '38px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                        {blog.image_url ? (
                          <img src={blog.image_url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>✍️</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{blog.title}</div>
                        {blog.video_url && <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>🎥 Video Included</div>}
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                    {blog.category}
                  </td>
                  {/* Status */}
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      style={{
                        background: blog.is_published ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: blog.is_published ? '#10b981' : '#ef4444',
                        border: 'none', padding: '0.3rem 0.8rem', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                      }}
                    >
                      {blog.is_published ? (
                        <>
                          <FiCheck /> Published
                        </>
                      ) : (
                        <>
                          <FiX /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  {/* Date */}
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(blog)}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          padding: '0.4rem', color: '#64748b'
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#3b82f6'}
                        onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          padding: '0.4rem', color: '#64748b'
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                      >
                        <FiTrash2 size={16} />
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

export default ManageBlogs
