const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { 
  getAllProjects, 
  getFeaturedProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  toggleFeatured 
} = require('../controllers/projectController')

router.get('/', getAllProjects)
router.get('/featured', getFeaturedProjects)
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'document', maxCount: 1 }]), createProject)
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'document', maxCount: 1 }]), updateProject)
router.patch('/:id/feature', toggleFeatured)
router.delete('/:id', deleteProject)

module.exports = router