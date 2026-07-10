const pool = require('../config/db')

const parseTechnologies = (tech) => {
  if (!tech) return []
  if (Array.isArray(tech)) return tech
  if (typeof tech === 'string') {
    try {
      const parsed = JSON.parse(tech)
      if (Array.isArray(parsed)) return parsed
      return [parsed]
    } catch (e) {
      return tech.split(',').map(t => t.trim()).filter(Boolean)
    }
  }
  return []
}

const getAllProjects = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    const result = await pool.query('SELECT * FROM projects ORDER BY start_date DESC')
    const projects = result.rows.map(p => ({
      ...p,
      image_url: p.image_url ? `${host}${p.image_url}` : null,
      document_url: p.document_url ? `${host}${p.document_url}` : null,
      images: p.images ? p.images.map(img => `${host}${img}`) : []
    }))
    res.json(projects)
  } catch (err) {
    console.error('❌ Error getting projects:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// NEW: Featured projects only
const getFeaturedProjects = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    const result = await pool.query(
      'SELECT * FROM projects WHERE is_featured = true ORDER BY start_date DESC LIMIT 6'
    )
    const projects = result.rows.map(p => ({
      ...p,
      image_url: p.image_url ? `${host}${p.image_url}` : null,
      document_url: p.document_url ? `${host}${p.document_url}` : null,
      images: p.images ? p.images.map(img => `${host}${img}`) : []
    }))
    res.json(projects)
  } catch (err) {
    console.error('❌ Error getting featured projects:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const createProject = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    console.log('📝 Creating project')
    const { title, description, technologies, start_date, end_date, achievements, live_link, github_link, is_featured } = req.body
    const techArray = parseTechnologies(technologies)
    
    let image_url = null
    let document_url = null
    let images = []

    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        image_url = `/uploads/${req.files['image'][0].filename}`
      }
      if (req.files['images']) {
        images = req.files['images'].map(f => `/uploads/${f.filename}`)
      }
      if (req.files['document'] && req.files['document'][0]) {
        document_url = `/uploads/${req.files['document'][0].filename}`
      }
    }

    const sDate = start_date && typeof start_date === 'string' && start_date.trim() !== '' ? start_date : null
    const eDate = end_date && typeof end_date === 'string' && end_date.trim() !== '' ? end_date : null
    const achs = achievements && typeof achievements === 'string' && achievements.trim() !== '' ? achievements : null

    const result = await pool.query(
      'INSERT INTO projects (title, description, technologies, start_date, end_date, achievements, image_url, document_url, live_link, github_link, is_featured, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [title, description, techArray, sDate, eDate, achs, image_url, document_url, live_link, github_link, is_featured === 'true' || is_featured === true, images]
    )

    console.log('✅ Project created:', result.rows[0])
    res.status(201).json({
      ...result.rows[0],
      image_url: image_url ? `${host}${image_url}` : null,
      document_url: document_url ? `${host}${document_url}` : null,
      images: result.rows[0].images ? result.rows[0].images.map(img => `${host}${img}`) : []
    })
  } catch (err) {
    console.error('❌ Error creating project:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const updateProject = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    const { id } = req.params
    const { title, description, technologies, start_date, end_date, achievements, live_link, github_link, is_featured } = req.body
    const techArray = parseTechnologies(technologies)
    const featured = is_featured === 'true' || is_featured === true

    let image_url = null
    let document_url = null
    let images = []

    if (req.body.images) {
      try {
        images = JSON.parse(req.body.images)
      } catch (e) {
        if (typeof req.body.images === 'string') {
          images = req.body.images.split(',').map(img => img.trim()).filter(Boolean)
        }
      }
    }
    // Clean domain prefix dynamically
    images = images.map(img => img.replace(/^https?:\/\/[^\/]+/, ''))

    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) {
        image_url = `/uploads/${req.files['image'][0].filename}`
      }
      if (req.files['images']) {
        const newImages = req.files['images'].map(f => `/uploads/${f.filename}`)
        images = [...images, ...newImages]
      }
      if (req.files['document'] && req.files['document'][0]) {
        document_url = `/uploads/${req.files['document'][0].filename}`
      }
    }

    const sDate = start_date && typeof start_date === 'string' && start_date.trim() !== '' ? start_date : null
    const eDate = end_date && typeof end_date === 'string' && end_date.trim() !== '' ? end_date : null
    const achs = achievements && typeof achievements === 'string' && achievements.trim() !== '' ? achievements : null

    let query = 'UPDATE projects SET title=$1, description=$2, technologies=$3, start_date=$4, end_date=$5, achievements=$6, live_link=$7, github_link=$8, is_featured=$9, images=$10'
    const params = [title, description, techArray, sDate, eDate, achs, live_link, github_link, featured, images]
    let paramCounter = 11

    if (image_url) {
      query += `, image_url=$${paramCounter}`
      params.push(image_url)
      paramCounter++
    }
    if (document_url) {
      query += `, document_url=$${paramCounter}`
      params.push(document_url)
      paramCounter++
    }

    query += ` WHERE id=$${paramCounter} RETURNING *`
    params.push(id)

    const result = await pool.query(query, params)
    res.json({
      ...result.rows[0],
      image_url: result.rows[0].image_url ? `${host}${result.rows[0].image_url}` : null,
      document_url: result.rows[0].document_url ? `${host}${result.rows[0].document_url}` : null,
      images: result.rows[0].images ? result.rows[0].images.map(img => `${host}${img}`) : []
    })
  } catch (err) {
    console.error('❌ Error updating project:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// NEW: Toggle featured
const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'UPDATE projects SET is_featured = NOT is_featured WHERE id = $1 RETURNING *',
      [id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM projects WHERE id = $1', [id])
    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllProjects, getFeaturedProjects, createProject, updateProject, deleteProject, toggleFeatured }