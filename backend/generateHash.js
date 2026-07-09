const bcrypt = require('bcryptjs')

async function generateHash() {
  const password = 'admin123'
  const hash = await bcrypt.hash(password, 10)
  console.log('Generated hash:')
  console.log(hash)
}

generateHash()