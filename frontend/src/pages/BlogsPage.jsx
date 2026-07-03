import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiClock, FiVideo, FiBookOpen } from 'react-icons/fi'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useWindowSize from '../hooks/useWindowSize'

const BlogsPage = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const navigate = useNavigate()
  
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs')
        setBlogs(res.data)
        
        // Extract unique categories
        const cats = ['All', ...new Set(res.data.map(b => b.category).filter(Boolean))]
        setCategories(cats)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory)

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '100vh' }}>
        Loading articles...
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{
        padding: isMobile ? '100px 1rem 40px' : '120px 2rem 80px',
        background: isPro ? '#f8fafc' : 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Glow Spheres for Creative Theme */}
        {!isPro && (
          <>
            <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(168,85,247,0.15)', filter: 'blur(100px)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '-10%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(236,72,153,0.12)', filter: 'blur(80px)', zIndex: 0 }} />
          </>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Back Navigation */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', border: 'none',
              color: isPro ? '#2563eb' : '#7c3aed',
              fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', marginBottom: '1.5rem',
              outline: 'none'
            }}
          >
            <FiArrowLeft size={18} /> Back to Home
          </button>

          {/* Unique Header Section */}
          <div style={{ marginBottom: '3.5rem', textAlign: isMobile ? 'center' : 'left' }}>
            <span style={{
              display: 'inline-block',
              background: isPro ? 'rgba(37,99,235,0.08)' : 'rgba(124,58,237,0.12)',
              color: isPro ? '#2563eb' : '#7c3aed',
              fontSize: '0.75rem', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              padding: '0.4rem 1.2rem', borderRadius: '2rem',
              marginBottom: '1rem'
            }}>
              Blogs & Articles
            </span>
            <h1 style={{
              fontSize: isMobile ? '2.5rem' : '3.8rem', fontWeight: 900,
              color: isPro ? '#0f172a' : '#1e1b4b',
              margin: '0 0 1rem 0',
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              Tech <span style={{
                background: isPro 
                  ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
                  : 'linear-gradient(135deg, #ff61d2, #a855f7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Journal</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
              A collection of development stories, engineering guides, and video walk-throughs covering full-stack concepts, databases, and mobile applications.
            </p>
          </div>

          {/* Interactive Tag Filters */}
          <div style={{
            display: 'flex', gap: '0.6rem',
            overflowX: 'auto', paddingBottom: '1rem',
            marginBottom: '3rem',
            scrollbarWidth: 'none'
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat
                    ? (isPro ? '#2563eb' : 'linear-gradient(135deg, #a855f7, #ec4899)')
                    : (isPro ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'),
                  color: selectedCategory === cat ? '#ffffff' : (isPro ? '#64748b' : '#6b21a8'),
                  border: isPro 
                    ? `1px solid ${selectedCategory === cat ? '#2563eb' : '#e2e8f0'}`
                    : `1px solid ${selectedCategory === cat ? 'transparent' : 'rgba(255, 255, 255, 0.6)'}`,
                  padding: '0.6rem 1.4rem',
                  borderRadius: '2rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: selectedCategory === cat 
                    ? '0 8px 20px rgba(168,85,247,0.15)' 
                    : '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Asymmetric Offset Layout Grid */}
          {filteredBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '3rem' }}>📝</span>
              <h3 style={{ margin: '1rem 0 0.5rem 0', color: '#0f172a' }}>No articles published yet</h3>
              <p style={{ color: '#64748b', margin: 0 }}>Check back soon for software engineering walk-throughs!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
              gap: isMobile ? '2rem' : '2.5rem'
            }}>
              {filteredBlogs.map((blog, i) => {
                // Determine card shape span dynamically for an offset design
                // i % 3 === 0: Featured card (span 8)
                // i % 3 === 1: Narrow card (span 4)
                // i % 3 === 2: Medium card (span 6)
                const isFeatured = i % 3 === 0 && !isMobile
                const isMedium = i % 3 === 2 && !isMobile
                const gridSpan = isFeatured ? 'span 8' : (isMedium ? 'span 6' : 'span 4')
                
                // Estimate reading time (roughly 200 words/min)
                const wordCount = blog.content ? blog.content.split(/\s+/).length : 50
                const readTime = Math.max(1, Math.round(wordCount / 180))

                return (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(0,0,0,0.08)' }}
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                    style={{
                      gridColumn: gridSpan,
                      background: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.7)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Cover image wrap */}
                    <div style={{
                      position: 'relative',
                      height: isFeatured ? '320px' : '220px',
                      width: '100%',
                      overflow: 'hidden',
                      background: '#f1f5f9'
                    }}>
                      {blog.image_url ? (
                        <img
                          src={blog.image_url}
                          alt={blog.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: isPro ? 'linear-gradient(135deg, #e0f2fe, #dbeafe)' : 'linear-gradient(135deg, #f5d0fe, #e0e7ff)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '3rem' }}>✍️</span>
                        </div>
                      )}

                      {/* Floating Badges */}
                      <div style={{
                        position: 'absolute', top: '1rem', left: '1rem',
                        display: 'flex', gap: '0.5rem', zIndex: 2
                      }}>
                        <span style={{
                          background: isPro ? '#0f172a' : 'rgba(124, 58, 237, 0.9)',
                          color: '#ffffff',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          {blog.category}
                        </span>

                        {blog.video_url && (
                          <span style={{
                            background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                            color: '#ffffff',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
                          }}>
                            <FiVideo size={12} /> Video
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Wrap */}
                    <div style={{
                      padding: '1.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1
                    }}>
                      {/* Meta Info */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        fontSize: '0.78rem', color: '#94a3b8',
                        marginBottom: '0.8rem', fontWeight: 600
                      }}>
                        <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FiClock /> {readTime} min read
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontSize: isFeatured ? '1.5rem' : '1.2rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.3,
                        margin: '0 0 0.8rem 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {blog.title}
                      </h3>

                      {/* Summary */}
                      <p style={{
                        fontSize: '0.88rem',
                        color: '#64748b',
                        lineHeight: 1.6,
                        margin: '0 0 1.5rem 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flexGrow: 1
                      }}>
                        {blog.summary || (blog.content ? blog.content.substring(0, 150) + '...' : '')}
                      </p>

                      {/* Footer tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
                          {blog.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: '#f1f5f9',
                              color: '#64748b',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px'
                            }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default BlogsPage
