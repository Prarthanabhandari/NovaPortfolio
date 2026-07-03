import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiClock, FiVideo, FiSearch, FiHeart, FiMessageSquare, FiBookmark, FiTrendingUp } from 'react-icons/fi'
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
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeTab, setActiveTab] = useState('for-you') // 'for-you' | 'featured'
  const [categories, setCategories] = useState(['All'])
  
  // Interactive claps (likes) state saved locally
  const [claps, setClaps] = useState({})
  const [hasLiked, setHasLiked] = useState({})

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

    // Load claps state from localStorage
    const savedClaps = localStorage.getItem('portfolio_blog_claps')
    const savedLikes = localStorage.getItem('portfolio_blog_likes_state')
    if (savedClaps) {
      try { setClaps(JSON.parse(savedClaps)) } catch (e) {}
    }
    if (savedLikes) {
      try { setHasLiked(JSON.parse(savedLikes)) } catch (e) {}
    }
  }, [])

  // Handle claps interaction
  const handleLike = (blogId, e) => {
    e.stopPropagation()
    const currentlyLiked = hasLiked[blogId]
    const updatedLikes = { ...hasLiked, [blogId]: !currentlyLiked }
    const updatedClaps = {
      ...claps,
      [blogId]: (claps[blogId] || 0) + (currentlyLiked ? -1 : 1)
    }

    setHasLiked(updatedLikes)
    setClaps(updatedClaps)
    localStorage.setItem('portfolio_blog_likes_state', JSON.stringify(updatedLikes))
    localStorage.setItem('portfolio_blog_claps', JSON.stringify(updatedClaps))
  }

  // Generate deterministic baseline stats to make empty profiles look popular
  const getClapCount = (blogId) => {
    const base = (blogId * 13) % 47 + 15
    const userOffset = claps[blogId] || 0
    return base + userOffset
  }

  const getCommentCount = (blogId) => {
    return (blogId * 7) % 11 + 2
  }

  // Filter logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (blog.tags && blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesTab = activeTab === 'for-you' || (activeTab === 'featured' && (blog.video_url || blog.id % 2 === 0))
    
    return matchesCategory && matchesSearch && matchesTab
  })

  // Popular / Staff Picks (top 3 posts)
  const popularPicks = [...blogs].slice(0, 3)

  if (loading) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', minHeight: '100vh' }}>
        Loading articles...
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{
        padding: isMobile ? '90px 1rem 40px' : '110px 2rem 80px',
        background: isPro ? '#ffffff' : 'linear-gradient(135deg, #fdf4ff 0%, #f0f4ff 100%)',
        minHeight: '100vh',
        color: isPro ? '#0f172a' : '#1e1b4b'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            borderBottom: `1px solid ${isPro ? '#f1f5f9' : 'rgba(168,85,247,0.1)'}`,
            paddingBottom: '1.5rem'
          }}>
            <div>
              <button
                onClick={() => navigate('/')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'transparent', border: 'none',
                  color: isPro ? '#2563eb' : '#c026d3',
                  fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer', marginBottom: '0.5rem',
                  padding: 0
                }}
              >
                <FiArrowLeft size={16} /> Back to Home
              </button>
              <h1 style={{ 
                fontSize: isMobile ? '1.8rem' : '2.4rem', 
                fontWeight: 800, 
                margin: 0,
                fontFamily: 'serif' 
              }}>
                {isPro ? 'Engineering Journal' : 'Creative thoughts'}
              </h1>
            </div>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: isMobile ? '140px' : '220px' }}>
              <FiSearch style={{
                position: 'absolute', left: '0.8rem', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8'
              }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem 0.5rem 2.2rem',
                  borderRadius: '2rem',
                  border: `1px solid ${isPro ? '#e2e8f0' : 'rgba(168,85,247,0.2)'}`,
                  background: isPro ? '#f8fafc' : 'rgba(255,255,255,0.7)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Grid Layout: Feed Left, Sidebar Right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '7fr 3.5fr',
            gap: isMobile ? '2.5rem' : '4rem',
            alignItems: 'start'
          }}>
            
            {/* LEFT COLUMN: Feed */}
            <div>
              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                marginBottom: '2rem',
                fontSize: '0.9rem'
              }}>
                <button
                  onClick={() => setActiveTab('for-you')}
                  style={{
                    padding: '0.6rem 0',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: activeTab === 'for-you' ? `2px solid ${isPro ? '#2563eb' : '#c026d3'}` : 'none',
                    fontWeight: activeTab === 'for-you' ? 700 : 500,
                    color: activeTab === 'for-you' ? (isPro ? '#2563eb' : '#c026d3') : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  For you
                </button>
                <button
                  onClick={() => setActiveTab('featured')}
                  style={{
                    padding: '0.6rem 0',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: activeTab === 'featured' ? `2px solid ${isPro ? '#2563eb' : '#c026d3'}` : 'none',
                    fontWeight: activeTab === 'featured' ? 700 : 500,
                    color: activeTab === 'featured' ? (isPro ? '#2563eb' : '#c026d3') : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Featured
                </button>
              </div>

              {/* Feed Articles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {filteredBlogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
                    <span style={{ fontSize: '2.5rem' }}>🔍</span>
                    <h3 style={{ marginTop: '1rem', color: isPro ? '#0f172a' : '#1e1b4b' }}>No articles match your query</h3>
                    <p style={{ fontSize: '0.85rem' }}>Try searching something else or switching categories.</p>
                  </div>
                ) : (
                  filteredBlogs.map((blog) => {
                    const wordCount = blog.content ? blog.content.split(/\s+/).length : 60
                    const readTime = Math.max(1, Math.round(wordCount / 180))
                    
                    return (
                      <article 
                        key={blog.id}
                        onClick={() => navigate(`/blogs/${blog.id}`)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '1.5rem',
                          paddingBottom: '2rem',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          alignItems: 'flex-start'
                        }}
                      >
                        {/* Feed Left: Content details */}
                        <div style={{ flexGrow: 1, maxWidth: '75%' }}>
                          
                          {/* Author badge */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.8rem',
                            color: '#64748b',
                            marginBottom: '0.6rem'
                          }}>
                            <div style={{
                              width: '20px', height: '20px',
                              borderRadius: '50%',
                              background: isPro ? '#e2e8f0' : '#fbcfe8',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.65rem', fontWeight: 800, color: isPro ? '#475569' : '#db2777'
                            }}>
                              P
                            </div>
                            <span style={{ fontWeight: 600, color: isPro ? '#334155' : '#4c1d95' }}>Prarthana Bhandari</span>
                            <span>•</span>
                            <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>

                          {/* Title */}
                          <h2 style={{
                            fontSize: isMobile ? '1.1rem' : '1.35rem',
                            fontWeight: 800,
                            margin: '0 0 0.4rem 0',
                            color: isPro ? '#0f172a' : '#1e1b4b',
                            lineHeight: 1.3,
                            fontFamily: 'sans-serif'
                          }}>
                            {blog.title}
                          </h2>

                          {/* Summary */}
                          <p style={{
                            fontSize: '0.88rem',
                            color: isPro ? '#475569' : '#6b7280',
                            lineHeight: 1.5,
                            margin: '0 0 1rem 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {blog.summary || (blog.content ? blog.content.substring(0, 120) + '...' : '')}
                          </p>

                          {/* Footer details row */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                              <span style={{
                                background: isPro ? '#f1f5f9' : 'rgba(168,85,247,0.1)',
                                color: isPro ? '#64748b' : '#a855f7',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '1rem',
                                fontWeight: 700,
                                fontSize: '0.7rem'
                              }}>
                                {blog.category}
                              </span>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                <FiClock size={12} /> {readTime} min read
                              </span>
                              {blog.video_url && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#ef4444' }}>
                                  <FiVideo size={12} /> Video
                                </span>
                              )}
                            </div>

                            {/* Toolbar Buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <button
                                onClick={(e) => handleLike(blog.id, e)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: hasLiked[blog.id] ? '#ef4444' : '#94a3b8',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  fontSize: '0.8rem',
                                  padding: '0.2rem',
                                  borderRadius: '50%',
                                  transition: 'color 0.2s'
                                }}
                              >
                                <FiHeart size={14} fill={hasLiked[blog.id] ? '#ef4444' : 'transparent'} />
                                <span>{getClapCount(blog.id)}</span>
                              </button>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                                <FiMessageSquare size={14} />
                                <span>{getCommentCount(blog.id)}</span>
                              </span>
                              <FiBookmark size={14} style={{ color: '#94a3b8' }} />
                            </div>
                          </div>
                        </div>

                        {/* Feed Right: Cover Thumbnail image */}
                        <div style={{
                          width: isMobile ? '80px' : '110px',
                          height: isMobile ? '80px' : '110px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: '#f1f5f9'
                        }}>
                          {blog.image_url ? (
                            <img
                              src={blog.image_url}
                              alt={blog.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%', height: '100%',
                              background: isPro ? 'linear-gradient(135deg, #e0f2fe, #dbeafe)' : 'linear-gradient(135deg, #f5d0fe, #e0e7ff)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '1.5rem'
                            }}>
                              ✍️
                            </div>
                          )}
                        </div>

                      </article>
                    )
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar (Hidden on mobile or stacks cleanly) */}
            <div>
              <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {/* Section 1: Staff Picks */}
                <div>
                  <h3 style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: isPro ? '#0f172a' : '#7c3aed',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <FiTrendingUp size={14} /> Popular Stories
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {popularPicks.map((pick) => (
                      <div 
                        key={pick.id}
                        onClick={() => navigate(`/blogs/${pick.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 800, color: '#475569' }}>
                            P
                          </div>
                          <span style={{ fontWeight: 600 }}>Prarthana Bhandari</span>
                        </div>
                        <h4 style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          margin: 0,
                          color: isPro ? '#1e293b' : '#3b0764',
                          lineHeight: 1.3
                        }}>
                          {pick.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Recommended Topics */}
                <div>
                  <h3 style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: isPro ? '#0f172a' : '#7c3aed',
                    marginBottom: '1rem'
                  }}>
                    Recommended Topics
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          background: selectedCategory === cat
                            ? (isPro ? '#0f172a' : '#7c3aed')
                            : (isPro ? '#f1f5f9' : 'rgba(255,255,255,0.7)'),
                          color: selectedCategory === cat ? '#ffffff' : (isPro ? '#475569' : '#6b21a8'),
                          border: 'none',
                          padding: '0.4rem 0.9rem',
                          borderRadius: '2rem',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Footer small details */}
                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1rem',
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.8rem'
                }}>
                  <span>Help</span>
                  <span>Privacy</span>
                  <span>Terms</span>
                  <span>About</span>
                  <span>© {new Date().getFullYear()} Journal</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default BlogsPage
