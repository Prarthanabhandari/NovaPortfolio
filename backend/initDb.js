const fs = require('fs')
const path = require('path')
const pool = require('./config/db')

async function initDb() {
  try {
    console.log('⏳ Connecting to PostgreSQL database to initialize schema...')
    const sqlPath = path.join(__dirname, 'db', 'schema.sql')
    let sql = fs.readFileSync(sqlPath, 'utf8')

    // Remove DB creation commands as we connect directly to the existing DB via pool config
    sql = sql.replace(/CREATE DATABASE prarthana_portfolio;/gi, '')
    sql = sql.replace(/\\c prarthana_portfolio;/gi, '')

    // Strip SQL line comments
    sql = sql.replace(/--.*$/gm, '')

    // Split by semicolon, clean queries
    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0)

    for (const query of queries) {
      console.log(`Executing: ${query.substring(0, 60).replace(/\n/g, ' ')}...`)
      await pool.query(query)
    }

    console.log('✅ Database schema and resume seed data loaded successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message)
    process.exit(1)
  }
}

initDb()
