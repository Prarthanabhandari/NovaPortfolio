const express = require('express')
const router = express.Router()
const { registerAdmin, loginAdmin, getAdminProfile } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.get('/profile', protect, getAdminProfile)

module.exports = router