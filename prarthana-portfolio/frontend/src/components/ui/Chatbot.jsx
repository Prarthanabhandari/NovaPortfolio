import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import api from '../../services/api'
import { useTheme } from '../../context/ThemeContext'
import useWindowSize from '../../hooks/useWindowSize'

const Chatbot = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const isPro = theme === 'professional'
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hi! I am Prarthana's digital portfolio assistant. Ask me anything about Prarthana's skills, projects, certificates, or work experience!"
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const quickPrompts = [
    { label: '👋 Intro', text: 'Who is Prarthana?' },
    { label: '🛠️ Skills', text: 'What technical skills do you have?' },
    { label: '📂 Projects', text: 'Show me your projects' },
    { label: '💼 Work', text: 'Tell me about your internship experience' },
    { label: '📞 Contact', text: 'How can I contact you?' }
  ]

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || inputText
    if (!messageText.trim()) return

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: messageText }])
    if (!textToSend) setInputText('')
    
    setIsTyping(true)

    try {
      const response = await api.post('/chatbot', { message: messageText })
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }])
    } catch (err) {
      console.error('Chatbot request failed:', err)
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: '⚠️ Sorry, I had trouble connecting. Please try again!' 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  // Parse custom markdown-like links, bolding, and linebreaks in response
  const formatText = (text) => {
    if (!text) return ''
    
    // Convert newlines to breaks
    let formatted = text.replace(/\n/g, '<br/>')
    
    // Bold text **text** -> <strong>text</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Markdown links [text](url) -> anchor tags
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: ${isPro ? '#3b82f6' : '#a78bfa'}; font-weight: 700; text-decoration: underline;">${label}</a>`
    })

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: isOpen ? -90 : 10 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isPro 
            ? '0 10px 25px rgba(59, 130, 246, 0.4)' 
            : '0 10px 25px rgba(167, 139, 250, 0.5)',
          background: isPro 
            ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' 
            : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          color: '#ffffff'
        }}
      >
        {isOpen ? (
          <Icon icon="ion:close-outline" width="32" height="32" />
        ) : (
          <Icon icon="carbon:bot" width="32" height="32" />
        )}
      </motion.button>

      {/* Chat window panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              bottom: '96px',
              right: isMobile ? '16px' : '24px',
              width: isMobile ? 'calc(100vw - 32px)' : '380px',
              height: isMobile ? '500px' : '550px',
              borderRadius: '24px',
              background: isPro ? '#ffffff' : 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.4)',
              zIndex: 9998,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.2rem 1.5rem',
              background: isPro 
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
                : 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon icon="carbon:bot" width="24" height="24" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Portfolio Assistant</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981'
                    }} />
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Active Now</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages Body */}
            <div style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: isPro ? '#f8fafc' : 'rgba(243, 244, 246, 0.5)'
            }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'user' 
                      ? (isPro ? '#3b82f6' : '#7c3aed') 
                      : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1f2937',
                    padding: '0.9rem 1.2rem',
                    borderRadius: msg.sender === 'user' 
                      ? '18px 18px 2px 18px' 
                      : '18px 18px 18px 2px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e5e7eb',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    wordBreak: 'break-word'
                  }}
                >
                  {formatText(msg.text)}
                </div>
              ))}

              {isTyping && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '18px 18px 18px 2px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                }}>
                  <span className="dot" style={{ display: 'inline-block', width: '6px', height: '6px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite alternate' }} />
                  <span className="dot" style={{ display: 'inline-block', width: '6px', height: '6px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite alternate 0.2s' }} />
                  <span className="dot" style={{ display: 'inline-block', width: '6px', height: '6px', background: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite alternate 0.4s' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Prompts */}
            <div style={{
              padding: '0.6rem 1rem',
              background: isPro ? '#f8fafc' : 'rgba(243, 244, 246, 0.5)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              borderTop: '1px solid #e5e7eb',
              overflowX: 'auto'
            }}>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt.text)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '20px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isPro ? '#4b5563' : '#6b21a8',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = isPro ? '#3b82f6' : '#a78bfa'
                    e.currentTarget.style.color = isPro ? '#3b82f6' : '#7c3aed'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.color = isPro ? '#4b5563' : '#6b21a8'
                  }}
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* Inputs Panel */}
            <div style={{
              padding: '1rem 1.5rem',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me about projects, skills, contact..."
                disabled={isTyping}
                style={{
                  flex: 1,
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = isPro ? '#3b82f6' : '#a78bfa'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                style={{
                  background: isPro ? '#3b82f6' : '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  opacity: !inputText.trim() || isTyping ? 0.6 : 1,
                  transition: 'background 0.2s ease'
                }}
              >
                <Icon icon="ion:send" width="18" height="18" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS for dot bouncing animation */}
      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}

export default Chatbot
