import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { FiTrash2, FiMail, FiCheckCircle } from 'react-icons/fi'

const ManageMessages = () => {
  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages')
      setMessages(res.data)
    } catch (err) {
      toast.error('Failed to fetch messages')
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`)
      toast.success('Marked as read!')
      fetchMessages()
    } catch (err) {
      toast.error('Failed!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.delete(`/messages/${id}`)
      toast.success('Message deleted!')
      fetchMessages()
    } catch (err) {
      toast.error('Failed to delete!')
    }
  }

  if (messages.length === 0) {
    return (
      <div style={{
        padding: '3rem', textAlign: 'center',
        color: '#94a3b8', background: '#fff',
        borderRadius: '16px', border: '1px solid #e2e8f0'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Messages</h1>
        <p>No messages yet!</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Messages</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          {messages.filter(m => !m.is_read).length} unread
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#fff', borderRadius: '16px',
              padding: '1.2rem 1.5rem',
              border: msg.is_read ? '1px solid #e2e8f0' : '1px solid #818cf8',
              boxShadow: msg.is_read ? 'none' : '0 0 0 3px rgba(129,140,248,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: msg.is_read ? '#f1f5f9' : 'rgba(129,140,248,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: msg.is_read ? '#94a3b8' : '#6366f1',
                  fontWeight: 700, fontSize: '0.9rem'
                }}>
                  {msg.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{msg.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{msg.email}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {new Date(msg.created_at).toLocaleDateString()}
              </div>
            </div>

            <p style={{
              fontSize: '0.88rem', lineHeight: 1.7, color: '#374151',
              marginBottom: '1rem', padding: '0.8rem',
              background: '#f8fafc', borderRadius: '10px'
            }}>
              {msg.message}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!msg.is_read && (
                <button
                  onClick={() => handleMarkRead(msg.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                    background: 'rgba(16,185,129,0.1)', color: '#10b981',
                    cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                  }}
                >
                  <FiCheckCircle size={13} /> Mark Read
                </button>
              )}
              <a href={`mailto:${msg.email}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', borderRadius: '8px',
                background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600
              }}>
                <FiMail size={13} /> Reply
              </a>
              <button
                onClick={() => handleDelete(msg.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                }}
              >
                <FiTrash2 size={13} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ManageMessages