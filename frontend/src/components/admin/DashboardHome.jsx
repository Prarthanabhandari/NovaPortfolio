import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../services/api'
import {
  FiFolder, FiAward, FiCode,
  FiMessageSquare, FiEye, FiPlus
} from 'react-icons/fi'

const DashboardHome = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    projects: 0, certificates: 0,
    skills: 0, messages: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [proj, cert, skill, msg] = await Promise.all([
          api.get('/projects'),
          api.get('/certificates'),
          api.get('/skills'),
          api.get('/messages'),
        ])
        setStats({
          projects: proj.data.length,
          certificates: cert.data.length,
          skills: skill.data.length,
          messages: msg.data.length,
        })
      } catch (err) {
        console.log(err)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: <FiFolder size={22} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Certificates', value: stats.certificates, icon: <FiAward size={22} />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    { label: 'Skills', value: stats.skills, icon: <FiCode size={22} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Messages', value: stats.messages, icon: <FiMessageSquare size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ]

  const quickActions = [
    { label: 'Add New Project', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', path: '/admin/dashboard/projects' },
    { label: 'Upload Certificate', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', path: '/admin/dashboard/certificates' },
    { label: 'Update Skills', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', path: '/admin/dashboard/skills' },
    { label: 'View Messages', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', path: '/admin/dashboard/messages' },
    { label: 'Site Settings', color: '#10b981', bg: 'rgba(16,185,129,0.1)', path: '/admin/dashboard/settings' },
    { label: 'Social Links', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', path: '/admin/dashboard/social' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.8rem', fontWeight: 800,
            color: '#0f172a', marginBottom: '0.3rem'
          }}>
            Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Welcome back, Prarthana! Here's what's happening.
          </p>
        </div>
        <button
          onClick={() => window.open('/', '_blank')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none',
            padding: '0.7rem 1.4rem',
            borderRadius: '12px', fontWeight: 600,
            fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <FiEye size={16} /> View Portfolio
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.2rem', marginBottom: '2rem'
      }}>
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: '#fff', borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '1rem'
            }}>
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '12px',
                background: stat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color
              }}>
                {stat.icon}
              </div>
            </div>
            <div style={{
              fontSize: '2rem', fontWeight: 800,
              color: '#0f172a', marginBottom: '0.2rem'
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#fff', borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '1rem', fontWeight: 700,
          color: '#0f172a', marginBottom: '1.2rem'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.8rem'
        }}>
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.8rem 1rem',
                background: action.bg,
                border: 'none', borderRadius: '12px',
                color: action.color, fontWeight: 600,
                fontSize: '0.85rem', cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <FiPlus size={16} />
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome