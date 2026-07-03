const express = require('express')
const router = express.Router()
const { getAllSettings, updateSetting, getAllSocialLinks, updateSocialLink } = require('../controllers/settingsController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getAllSettings)
router.post('/', protect, updateSetting)
router.get('/social', getAllSocialLinks)
router.post('/social', protect, updateSocialLink)

module.exports = router