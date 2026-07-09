const { Pool } = require('pg')
require('dotenv').config()

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    })

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message)
  } else {
    console.log('✅ PostgreSQL Connected Successfully!')
    release()
  }
})

module.exports = pool