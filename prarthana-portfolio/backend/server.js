const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.CLIENT_URL
  ],
  credentials: true
}))

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Database Connection
const pool = require('./config/db')
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err)
  } else {
    console.log('✅ PostgreSQL Connected Successfully!')
  }
})

// Routes
const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoutes')
const skillRoutes = require('./routes/skillRoutes')
const certRoutes = require('./routes/certRoutes')
const experienceRoutes = require('./routes/experienceRoutes')
const achievementRoutes = require('./routes/achievementRoutes')
const messageRoutes = require('./routes/messageRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const chatbotRoutes = require('./routes/chatbotRoutes')
const blogRoutes = require('./routes/blogRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/certificates', certRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use('/api/blogs', blogRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})