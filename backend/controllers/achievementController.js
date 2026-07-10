const pool = require('../config/db')

const getAllAchievements = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    const result = await pool.query(
      'SELECT * FROM achievements ORDER BY date_achieved DESC'
    )
    const achievements = result.rows.map(a => ({
      ...a,
      image_url: a.image_url ? `${host}${a.image_url}` : null
    }))
    res.json(achievements)
  } catch (err) {
    console.error('❌ Error getting achievements:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const createAchievement = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    console.log('📝 Creating achievement')
    const { title, description, category, date_achieved, icon } = req.body
    const image_url = req.file ? `/uploads/${req.file.filename}` : null

    const result = await pool.query(
      'INSERT INTO achievements (title, description, category, date_achieved, icon, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, category, date_achieved || null, icon, image_url]
    )

    console.log('✅ Achievement created:', result.rows[0])

    res.status(201).json({
      ...result.rows[0],
      image_url: image_url ? `${host}${image_url}` : null
    })
  } catch (err) {
    console.error('❌ Error creating achievement:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const updateAchievement = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    console.log('📝 Updating achievement')
    const { id } = req.params
    const { title, description, category, date_achieved, icon } = req.body
    
    let image_url = null
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`
    }

    const query = image_url
      ? 'UPDATE achievements SET title=$1, description=$2, category=$3, date_achieved=$4, icon=$5, image_url=$6 WHERE id=$7 RETURNING *'
      : 'UPDATE achievements SET title=$1, description=$2, category=$3, date_achieved=$4, icon=$5 WHERE id=$6 RETURNING *'

    const params = image_url
      ? [title, description, category, date_achieved || null, icon, image_url, id]
      : [title, description, category, date_achieved || null, icon, id]

    const result = await pool.query(query, params)
    
    console.log('✅ Achievement updated:', result.rows[0])
    
    res.json({
      ...result.rows[0],
      image_url: result.rows[0].image_url ? `${host}${result.rows[0].image_url}` : null
    })
  } catch (err) {
    console.error('❌ Error updating achievement:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM achievements WHERE id = $1', [id])
    console.log('✅ Achievement deleted:', id)
    res.json({ message: 'Achievement deleted' })
  } catch (err) {
    console.error('❌ Error deleting achievement:', err.message)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllAchievements, createAchievement, updateAchievement, deleteAchievement }