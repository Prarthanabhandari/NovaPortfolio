const pool = require('../config/db')

// Get all blogs (Admin gets all, Public gets only published)
exports.getAllBlogs = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true'
    let queryStr = 'SELECT * FROM blogs WHERE is_published = true ORDER BY created_at DESC'
    
    if (isAdmin) {
      queryStr = 'SELECT * FROM blogs ORDER BY created_at DESC'
    }

    const result = await pool.query(queryStr)
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching blogs:', err.message)
    res.status(500).json({ error: 'Server error fetching blogs' })
  }
}

// Get single blog post
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id])
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Error fetching blog:', err.message)
    res.status(500).json({ error: 'Server error fetching blog post' })
  }
}

// Create new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, summary, category, tags, video_url, is_published } = req.body
    
    let imageUrl = ''
    if (req.files && req.files['image']) {
      imageUrl = `/uploads/${req.files['image'][0].filename}`
    }

    // Process tags (convert string comma-separated list into array if necessary)
    let tagsArray = []
    if (tags) {
      tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    const queryStr = `
      INSERT INTO blogs (title, content, summary, category, tags, image_url, video_url, is_published, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `
    const values = [
      title,
      content,
      summary || '',
      category || 'General',
      tagsArray,
      imageUrl,
      video_url || '',
      is_published === 'true' || is_published === true
    ]

    const result = await pool.query(queryStr, values)
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error creating blog:', err.message)
    res.status(500).json({ error: 'Server error creating blog post' })
  }
}

// Update blog post
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, summary, category, tags, video_url, is_published } = req.body

    // Check if exists
    const checkExist = await pool.query('SELECT * FROM blogs WHERE id = $1', [id])
    if (checkExist.rowCount === 0) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    const currentBlog = checkExist.rows[0]
    
    let imageUrl = currentBlog.image_url
    if (req.files && req.files['image']) {
      imageUrl = `/uploads/${req.files['image'][0].filename}`
    }

    let tagsArray = currentBlog.tags
    if (tags !== undefined) {
      tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    const queryStr = `
      UPDATE blogs 
      SET title = $1, content = $2, summary = $3, category = $4, tags = $5, image_url = $6, video_url = $7, is_published = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `
    const values = [
      title || currentBlog.title,
      content || currentBlog.content,
      summary !== undefined ? summary : currentBlog.summary,
      category || currentBlog.category,
      tagsArray,
      imageUrl,
      video_url !== undefined ? video_url : currentBlog.video_url,
      is_published !== undefined ? (is_published === 'true' || is_published === true) : currentBlog.is_published,
      id
    ]

    const result = await pool.query(queryStr, values)
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error updating blog:', err.message)
    res.status(500).json({ error: 'Server error updating blog post' })
  }
}

// Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params
    const checkExist = await pool.query('SELECT id FROM blogs WHERE id = $1', [id])
    if (checkExist.rowCount === 0) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    await pool.query('DELETE FROM blogs WHERE id = $1', [id])
    res.json({ message: 'Blog post deleted successfully' })
  } catch (err) {
    console.error('Error deleting blog:', err.message)
    res.status(500).json({ error: 'Server error deleting blog post' })
  }
}
