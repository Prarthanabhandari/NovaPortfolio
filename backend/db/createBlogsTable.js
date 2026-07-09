const pool = require('../config/db')

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category VARCHAR(100),
    tags TEXT[],
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`

async function run() {
  try {
    console.log('⏳ Creating blogs table in database...')
    await pool.query(createTableQuery)
    console.log('✅ Blogs table created successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to create blogs table:', err.message)
    process.exit(1)
  }
}

run()
