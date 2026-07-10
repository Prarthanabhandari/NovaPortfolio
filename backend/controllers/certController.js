const pool = require('../config/db')

const getAllCertificates = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    const result = await pool.query(
      'SELECT * FROM certificates ORDER BY issued_date DESC'
    )
    const certificates = result.rows.map(c => ({
      ...c,
      image_url: c.image_url ? `${host}${c.image_url}` : null,
      logo_url: c.logo_url ? `${host}${c.logo_url}` : null
    }))
    res.json(certificates)
  } catch (err) {
    console.error('❌ Error getting certificates:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// NEW: Get featured certificates (limit to 6)
const getFeaturedCertificates = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    const result = await pool.query(
      'SELECT * FROM certificates WHERE is_featured = true ORDER BY issued_date DESC LIMIT 6'
    )
    const certificates = result.rows.map(c => ({
      ...c,
      image_url: c.image_url ? `${host}${c.image_url}` : null,
      logo_url: c.logo_url ? `${host}${c.logo_url}` : null
    }))
    res.json(certificates)
  } catch (err) {
    console.error('❌ Error getting featured certificates:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const createCertificate = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    console.log('📝 Received request to create certificate')
    console.log('Body:', req.body)
    console.log('Files:', req.files)
    
    const { title, platform, description, issued_date, credential_url, is_featured } = req.body
    const image_url = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null
    const logo_url = req.files?.logo ? `/uploads/${req.files.logo[0].filename}` : null
    const featured = is_featured === 'true' || is_featured === true

    const result = await pool.query(
      'INSERT INTO certificates (title, platform, description, issued_date, credential_url, image_url, logo_url, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, platform, description, issued_date, credential_url || null, image_url, logo_url, featured]
    )

    console.log('✅ Certificate created:', result.rows[0])

    res.status(201).json({
      ...result.rows[0],
      image_url: image_url ? `${host}${image_url}` : null,
      logo_url: logo_url ? `${host}${logo_url}` : null
    })
  } catch (err) {
    console.error('❌ Error creating certificate:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const updateCertificate = async (req, res) => {
  try {
    const host = req.protocol + '://' + req.get('host')
    console.log('📝 Received request to update certificate')
    const { id } = req.params
    const { title, platform, description, issued_date, credential_url, is_featured } = req.body
    const featured = is_featured === 'true' || is_featured === true
    
    const image_url = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null
    const logo_url = req.files?.logo ? `/uploads/${req.files.logo[0].filename}` : null

    // Build dynamic query
    const fields = ['title=$1', 'platform=$2', 'description=$3', 'issued_date=$4', 'credential_url=$5', 'is_featured=$6']
    const values = [title, platform, description, issued_date, credential_url || null, featured]
    let paramIdx = 7

    if (image_url) {
      fields.push(`image_url=$${paramIdx++}`)
      values.push(image_url)
    }
    if (logo_url) {
      fields.push(`logo_url=$${paramIdx++}`)
      values.push(logo_url)
    }

    values.push(id)
    const query = `UPDATE certificates SET ${fields.join(', ')} WHERE id=$${paramIdx} RETURNING *`
    const result = await pool.query(query, values)
    
    console.log('✅ Certificate updated:', result.rows[0])
    
    res.json({
      ...result.rows[0],
      image_url: result.rows[0].image_url ? `${host}${result.rows[0].image_url}` : null,
      logo_url: result.rows[0].logo_url ? `${host}${result.rows[0].logo_url}` : null
    })
  } catch (err) {
    console.error('❌ Error updating certificate:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// NEW: Toggle featured status
const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'UPDATE certificates SET is_featured = NOT is_featured WHERE id = $1 RETURNING *',
      [id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error('❌ Error toggling certificate featured:', err.message)
    res.status(500).json({ message: err.message })
  }
}

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM certificates WHERE id = $1', [id])
    console.log('✅ Certificate deleted:', id)
    res.json({ message: 'Certificate deleted' })
  } catch (err) {
    console.error('❌ Error deleting certificate:', err.message)
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAllCertificates,
  getFeaturedCertificates,
  createCertificate,
  updateCertificate,
  toggleFeatured,
  deleteCertificate
}