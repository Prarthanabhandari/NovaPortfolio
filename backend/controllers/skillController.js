const pool = require('../config/db')

const getAllSkills = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    const result = await pool.query('SELECT * FROM skills ORDER BY id DESC')
    const skills = result.rows.map(s => ({
      ...s,
      image_url: s.image_url ? `${host}${s.image_url}` : null
    }))
    res.json(skills)
  } catch (err) {
    console.error('❌ Error getting skills:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// NEW: Get only featured skills (for home page)
const getFeaturedSkills = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    const result = await pool.query(
      'SELECT * FROM skills WHERE is_featured = true ORDER BY id DESC LIMIT 9'
    )
    const skills = result.rows.map(s => ({
      ...s,
      image_url: s.image_url ? `${host}${s.image_url}` : null
    }))
    res.json(skills)
  } catch (err) {
    console.error('❌ Error getting featured skills:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const createSkill = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    console.log('📝 Creating skill - Body:', req.body)
    const { name, icon, description, proficiency_level, organization, is_featured } = req.body
    let image_url = null
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`
    }

    const featured = is_featured === 'true' || is_featured === true

    const result = await pool.query(
      'INSERT INTO skills (name, icon, description, proficiency_level, organization, is_featured, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, icon || null, description, proficiency_level, organization, featured, image_url]
    )
    console.log('✅ Skill created:', result.rows[0])
    res.status(201).json({
      ...result.rows[0],
      image_url: image_url ? `${host}${image_url}` : null
    })
  } catch (err) {
    console.error('❌ Error creating skill:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const updateSkill = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    console.log('📝 Updating skill - Body:', req.body)
    const { id } = req.params
    const { name, icon, description, proficiency_level, organization, is_featured } = req.body
    let image_url = null
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`
    }

    const featured = is_featured === 'true' || is_featured === true

    let query = 'UPDATE skills SET name=$1, icon=$2, description=$3, proficiency_level=$4, organization=$5, is_featured=$6'
    const params = [name, icon || null, description, proficiency_level, organization, featured]
    let paramCounter = 7

    if (image_url) {
      query += `, image_url=$${paramCounter}`
      params.push(image_url)
      paramCounter++
    }

    query += ` WHERE id=$${paramCounter} RETURNING *`
    params.push(id)

    const result = await pool.query(query, params)
    console.log('✅ Skill updated:', result.rows[0])
    res.json({
      ...result.rows[0],
      image_url: result.rows[0].image_url ? `${host}${result.rows[0].image_url}` : null
    })
  } catch (err) {
    console.error('❌ Error updating skill:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// NEW: Toggle featured status
const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'UPDATE skills SET is_featured = NOT is_featured WHERE id = $1 RETURNING *',
      [id]
    )
    console.log('✅ Featured toggled:', result.rows[0])
    res.json(result.rows[0])
  } catch (err) {
    console.error('❌ Error toggling featured:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM skills WHERE id = $1', [id])
    res.json({ message: 'Skill deleted' })
  } catch (err) {
    console.error('❌ Error deleting skill:', err.message)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllSkills, getFeaturedSkills, createSkill, updateSkill, deleteSkill, toggleFeatured }