const pool = require('../config/db')

const getAllExperience = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experience ORDER BY start_date DESC')
    const experience = result.rows.map(e => ({
      ...e,
      image_url: e.image_url ? `http://localhost:5000${e.image_url}` : null,
      offer_letter: e.offer_letter ? `http://localhost:5000${e.offer_letter}` : null,
      completion_certificate: e.completion_certificate ? `http://localhost:5000${e.completion_certificate}` : null
    }))
    res.json(experience)
  } catch (err) {
    console.error('❌ Error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const createExperience = async (req, res) => {
  try {
    console.log('📝 Creating experience - Body:', req.body)
    console.log('📝 Files:', req.files)
    const { job_title, company, location, description, start_date, end_date, is_current, icon } = req.body
    
    const image_url = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null
    const offer_letter = req.files?.offer_letter ? `/uploads/${req.files.offer_letter[0].filename}` : null
    const completion_certificate = req.files?.completion_certificate ? `/uploads/${req.files.completion_certificate[0].filename}` : null

    const result = await pool.query(
      'INSERT INTO experience (job_title, company, location, description, start_date, end_date, is_current, icon, image_url, offer_letter, completion_certificate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [job_title, company, location, description, start_date, end_date || null, is_current === 'true' || is_current === true, icon, image_url, offer_letter, completion_certificate]
    )

    console.log('✅ Experience created:', result.rows[0])
    res.status(201).json({
      ...result.rows[0],
      image_url: image_url ? `http://localhost:5000${image_url}` : null,
      offer_letter: offer_letter ? `http://localhost:5000${offer_letter}` : null,
      completion_certificate: completion_certificate ? `http://localhost:5000${completion_certificate}` : null
    })
  } catch (err) {
    console.error('❌ Error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params
    const { job_title, company, location, description, start_date, end_date, is_current, icon } = req.body
    
    const image_url = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null
    const offer_letter = req.files?.offer_letter ? `/uploads/${req.files.offer_letter[0].filename}` : null
    const completion_certificate = req.files?.completion_certificate ? `/uploads/${req.files.completion_certificate[0].filename}` : null

    // Build dynamic query
    const fields = ['job_title=$1', 'company=$2', 'location=$3', 'description=$4', 'start_date=$5', 'end_date=$6', 'is_current=$7', 'icon=$8']
    const values = [job_title, company, location, description, start_date, end_date || null, is_current === 'true' || is_current === true, icon]
    let paramIdx = 9

    if (image_url) {
      fields.push(`image_url=$${paramIdx++}`)
      values.push(image_url)
    }
    if (offer_letter) {
      fields.push(`offer_letter=$${paramIdx++}`)
      values.push(offer_letter)
    }
    if (completion_certificate) {
      fields.push(`completion_certificate=$${paramIdx++}`)
      values.push(completion_certificate)
    }

    values.push(id)
    const query = `UPDATE experience SET ${fields.join(', ')} WHERE id=$${paramIdx} RETURNING *`

    const result = await pool.query(query, values)
    res.json({
      ...result.rows[0],
      image_url: result.rows[0].image_url ? `http://localhost:5000${result.rows[0].image_url}` : null,
      offer_letter: result.rows[0].offer_letter ? `http://localhost:5000${result.rows[0].offer_letter}` : null,
      completion_certificate: result.rows[0].completion_certificate ? `http://localhost:5000${result.rows[0].completion_certificate}` : null
    })
  } catch (err) {
    console.error('❌ Error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM experience WHERE id = $1', [id])
    res.json({ message: 'Experience deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllExperience, createExperience, updateExperience, deleteExperience }