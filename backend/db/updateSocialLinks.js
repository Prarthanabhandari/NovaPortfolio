const pool = require('../config/db')

async function run() {
  try {
    console.log('⏳ Updating social links in database...')
    await pool.query(
      "UPDATE social_links SET url = $1 WHERE platform = 'github'",
      ['https://github.com/prarthanabhandari']
    )
    console.log('✅ Updated GitHub link!')

    await pool.query(
      "UPDATE social_links SET url = $1 WHERE platform = 'linkedin'",
      ['https://www.linkedin.com/in/prarthana-bhandari-ab2a5a293/']
    )
    console.log('✅ Updated LinkedIn link!')

    console.log('🎉 Social links update complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to update social links:', err.message)
    process.exit(1)
  }
}

run()
