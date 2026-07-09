const express = require('express')
const router = express.Router()
const { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController')
const upload = require('../config/multer')
const { protect } = require('../middleware/authMiddleware')

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 }
])

router.get('/', getAllBlogs)
router.get('/:id', getBlogById)
router.post('/', protect, uploadFields, createBlog)
router.put('/:id', protect, uploadFields, updateBlog)
router.delete('/:id', protect, deleteBlog)

module.exports = router
