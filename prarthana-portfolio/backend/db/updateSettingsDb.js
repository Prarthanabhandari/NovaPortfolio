const pool = require('../config/db')

async function run() {
  try {
    console.log('⏳ Updating site settings in database...')
    
    await pool.query(
      "UPDATE site_settings SET value = $1 WHERE key = 'hero_subtitle'",
      ['Full Stack Developer & MCA Graduate']
    )
    console.log('✅ Updated hero_subtitle!')

    await pool.query(
      "UPDATE site_settings SET value = $1 WHERE key = 'about_text'",
      ['I am Prarthana Bhandari, a Full Stack Developer and recent MCA graduate (2024-2026). I enjoy turning complex ideas into beautiful, functional, and performant web experiences with clean design and smooth animations.']
    )
    console.log('✅ Updated about_text!')

    console.log('🎉 Site settings updated in database!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to update settings:', err.message)
    process.exit(1)
  }
}

run()
