import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiClock, FiVideo, FiTag, FiCalendar } from 'react-icons/fi'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import useWindowSize from '../hooks/useWindowSize'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const BlogDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`)
        setBlog(res.data)
      } catch (err) {
        console.error('Failed to fetch blog article:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const getYouTubeEmbedId = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const parseMarkdownToHTML = (content) => {
    if (!content) return ''
    
    let formatted = content
    
    // Format code blocks
    formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre style="background: #0f172a; color: #f8fafc; padding: 1.5rem; border-radius: 16px; overflow-x: auto; font-family: Consolas, Monaco, monospace; font-size: 0.88rem; line-height: 1.6; margin: 1.5rem 0; border: 1px solid rgba(255,255,255,0.06);"><code class="language-${lang}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
    })

    // Format headers
    formatted = formatted.replace(/^### (.*?)$/gm, '<h3 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 2rem 0 1rem 0; letter-spacing: -0.01em;">$1</h3>')
    formatted = formatted.replace(/^## (.*?)$/gm, '<h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 2.5rem 0 1rem 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; letter-spacing: -0.01em;">$1</h2>')
    formatted = formatted.replace(/^# (.*?)$/gm, '<h1 style="font-size: 2.15rem; font-weight: 900; color: #0f172a; margin: 3rem 0 1rem 0; letter-spacing: -0.02em;">$1</h1>')

    // Format bullet list items
    formatted = formatted.replace(/^\* (.*?)$/gm, '<li style="margin-left: 1.5rem; margin-bottom: 0.5rem; line-height: 1.8; color: #334155;">$1</li>')
    
    // Format bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Format links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: ${isPro ? '#2563eb' : '#a855f7'}; font-weight: 700; text-decoration: underline;">${label}</a>`
    })

    // Handle paragraphs separated by double carriage returns
    formatted = formatted.split('\n\n').map(p => {
      const trimmed = p.trim()
      if (trimmed.startsWith('<pre') || trimmed.startsWith('<h') || trimmed.startsWith('<li')) {
        return trimmed
      }
      return `<p style="line-height: 1.85; color: #334155; margin-bottom: 1.5rem; font-size: 1.05rem;">${trimmed.replace(/\n/g, '<br/>')}</p>`
    }).join('')

    return formatted
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '100vh' }}>
        Loading article...
      </div>
    )
  }

  if (!blog) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '100vh' }}>
        <h2>Article not found!</h2>
        <button onClick={() => navigate('/blogs')} style={{ marginTop: '1rem', background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
          Back to Blogs
        </button>
      </div>
    )
  }

  const embedId = getYouTubeEmbedId(blog.video_url)
  const wordCount = blog.content ? blog.content.split(/\s+/).length : 50
  const readTime = Math.max(1, Math.round(wordCount / 180))

  return (
    <>
      <Navbar />
      <div style={{
        padding: isMobile ? '100px 1rem 40px' : '120px 2rem 80px',
        background: isPro ? '#ffffff' : 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Back button */}
          <button
            onClick={() => navigate('/blogs')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', border: 'none',
              color: isPro ? '#2563eb' : '#7c3aed',
              fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', marginBottom: '2rem',
              outline: 'none'
            }}
          >
            <FiArrowLeft size={18} /> Back to Articles
          </button>

          {/* Category Badges & Read-time */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
            <span style={{
              background: isPro ? '#0f172a' : '#7c3aed',
              color: '#ffffff',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              {blog.category}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
              <FiClock /> {readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: isMobile ? '2.2rem' : '3.2rem',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            {blog.title}
          </h1>

          {/* Author/Date Row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1.5rem',
            borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0',
            padding: '1rem 0', marginBottom: '2.5rem',
            fontSize: '0.85rem', color: '#64748b', fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiCalendar />
              <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div>
              By <span style={{ color: '#0f172a' }}>Prarthana Bhandari</span>
            </div>
          </div>

          {/* Banner cover image or Video Player Embed */}
          {embedId ? (
            <div style={{ 
              position: 'relative', 
              paddingBottom: '56.25%', 
              height: 0, 
              overflow: 'hidden', 
              borderRadius: '24px', 
              marginBottom: '2.5rem', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.12)' 
            }}>
              <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/${embedId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={blog.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            blog.image_url && (
              <div style={{ 
                borderRadius: '24px', 
                overflow: 'hidden', 
                height: isMobile ? '260px' : '450px', 
                width: '100%', 
                marginBottom: '2.5rem',
                boxShadow: '0 15px 40px rgba(0,0,0,0.05)'
              }}>
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )
          )}

          {/* Article Text Content */}
          <div 
            style={{ 
              fontSize: '1.05rem', 
              lineHeight: '1.85', 
              color: '#334155' 
            }}
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(blog.content) }}
          />

          {/* Tags Footer Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.6rem', 
              marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              {blog.tags.map((tag, idx) => (
                <span key={idx} style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '0.3rem 0.9rem',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <FiTag size={12} /> #{tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}

export default BlogDetailPage
