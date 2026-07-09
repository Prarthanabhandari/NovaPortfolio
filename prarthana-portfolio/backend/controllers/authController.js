const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    const adminExists = await pool.query('SELECT * FROM admin WHERE username = $1', [username])
    if (adminExists.rows.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newAdmin = await pool.query(
      'INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    )

    res.status(201).json({
      message: 'Admin created successfully',
      token: generateToken(newAdmin.rows[0].id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = await pool.query('SELECT * FROM admin WHERE username = $1', [username])
    if (admin.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, admin.rows[0].password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({
      message: 'Login successful',
      token: generateToken(admin.rows[0].id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAdminProfile = async (req, res) => {
  try {
    const admin = await pool.query(
      'SELECT id, username, created_at FROM admin WHERE id = $1',
      [req.admin.id]
    )
    res.json(admin.rows[0])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { registerAdmin, loginAdmin, getAdminProfile }