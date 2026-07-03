const express = require('express')
const router = express.Router()
const { 
  getAllCertificates, 
  getFeaturedCertificates, 
  createCertificate, 
  updateCertificate, 
  toggleFeatured, 
  deleteCertificate 
} = require('../controllers/certController')
const upload = require('../config/multer')
const { protect } = require('../middleware/authMiddleware')

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
])

router.get('/', getAllCertificates)
router.get('/featured', getFeaturedCertificates)
router.post('/', protect, uploadFields, createCertificate)
router.put('/:id', protect, uploadFields, updateCertificate)
router.patch('/:id/feature', protect, toggleFeatured)
router.delete('/:id', protect, deleteCertificate)

module.exports = router