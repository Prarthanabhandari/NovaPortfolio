const express = require('express')
const router = express.Router()
const { getAllAchievements, createAchievement, updateAchievement, deleteAchievement } = require('../controllers/achievementController')
const upload = require('../config/multer')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getAllAchievements)
router.post('/', protect, upload.single('image'), createAchievement)
router.put('/:id', protect, upload.single('image'), updateAchievement)
router.delete('/:id', protect, deleteAchievement)

module.exports = router