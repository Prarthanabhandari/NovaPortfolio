const express = require('express')
const router = express.Router()
const { getAllMessages, createMessage, markAsRead, deleteMessage } = require('../controllers/messageController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, getAllMessages)
router.post('/', createMessage)
router.put('/:id/read', protect, markAsRead)
router.delete('/:id', protect, deleteMessage)

module.exports = router