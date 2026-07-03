const express = require('express')
const router = express.Router()
const { 
  getAllSkills, 
  getFeaturedSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill, 
  toggleFeatured 
} = require('../controllers/skillController')

const upload = require('../middleware/upload')

router.get('/', getAllSkills)
router.get('/featured', getFeaturedSkills)  // NEW route
router.post('/', upload.single('image'), createSkill)
router.put('/:id', upload.single('image'), updateSkill)
router.patch('/:id/feature', toggleFeatured)  // NEW route
router.delete('/:id', deleteSkill)

module.exports = router