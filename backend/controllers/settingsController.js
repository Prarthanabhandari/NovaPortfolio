const pool = require('../config/db')

const getAllSettings = async (req, res) => {
  try {
    const settings = await pool.query('SELECT * FROM site_settings')
    const result = {}
    settings.rows.forEach(row => {
      result[row.key] = row.value
    })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body
    await pool.query(
      `INSERT INTO site_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()`,
      [key, value]
    )
    res.json({ message: 'Setting updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllSocialLinks = async (req, res) => {
  try {
    const links = await pool.query('SELECT * FROM social_links')
    res.json(links.rows)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateSocialLink = async (req, res) => {
  try {
    const { platform, url } = req.body
    await pool.query(
      `INSERT INTO social_links (platform, url) VALUES ($1, $2)
       ON CONFLICT (platform) DO UPDATE SET url=$2, updated_at=NOW()`,
      [platform, url]
    )
    res.json({ message: 'Social link updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAllSettings, updateSetting, getAllSocialLinks, updateSocialLink }