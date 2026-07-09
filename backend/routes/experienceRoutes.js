const express = require('express')
const router = express.Router()
const { getAllExperience, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController')
const upload = require('../config/multer')
const { protect } = require('../middleware/authMiddleware')

// Use multer fields for multiple file types
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'offer_letter', maxCount: 1 },
  { name: 'completion_certificate', maxCount: 1 }
])

router.get('/', getAllExperience)
router.post('/', protect, uploadFields, createExperience)
router.put('/:id', protect, uploadFields, updateExperience)
router.delete('/:id', protect, deleteExperience)

module.exports = router