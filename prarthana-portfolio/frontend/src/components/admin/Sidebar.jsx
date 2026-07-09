import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiGrid, FiFolder, FiAward, FiCode,
  FiMessageSquare, FiSettings, FiLink,
  FiLogOut, FiExternalLink, FiBriefcase,
  FiBookOpen
} from 'react-icons/fi'

const menuItems = [
  { label: 'Dashboard', icon: <FiGrid size={18} />, path: '/admin/dashboard' },
  { label: 'Projects', icon: <FiFolder size={18} />, path: '/admin/dashboard/projects' },
  { label: 'Certificates', icon: <FiAward size={18} />, path: '/admin/dashboard/certificates' },
  { label: 'Skills', icon: <FiCode size={18} />, path: '/admin/dashboard/skills' },
  { label: 'Experience', icon: <FiBriefcase size={18} />, path: '/admin/dashboard/experience' },
  { label: 'Blogs', icon: <FiBookOpen size={18} />, path: '/admin/dashboard/blogs' },
  { label: 'Messages', icon: <FiMessageSquare size={18} />, path: '/admin/dashboard/messages' },
  { label: 'Site Settings', icon: <FiSettings size={18} />, path: '/admin/dashboard/settings' },
  { label: 'Social Links', icon: <FiLink size={18} />, path: '/admin/dashboard/social' },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0,
      width: '260px', height: '100vh',
      background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100, overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{
        padding: '2rem 1.5rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.8rem'
        }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1rem', color: '#fff'
          }}>
            P
          </div>
          <div>
            <div style={{
              fontWeight: 700, fontSize: '0.95rem', color: '#fff'
            }}>
              Admin Panel
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
              Prarthana Bhandari
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ padding: '1rem 0.8rem', flex: 1 }}>
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex',
                alignItems: 'center', gap: '0.8rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px', border: 'none',
                background: isActive
                  ? 'rgba(129,140,248,0.2)'
                  : 'transparent',
                color: isActive ? '#818cf8' : 'rgba(255,255,255,0.55)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.88rem', cursor: 'pointer',
                marginBottom: '0.2rem',
                textAlign: 'left',
                transition: 'all 0.2s',
                borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom buttons */}
      <div style={{
        padding: '1rem 0.8rem',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button
          onClick={() => window.open('/', '_blank')}
          style={{
            width: '100%', display: 'flex',
            alignItems: 'center', gap: '0.8rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px', border: 'none',
            background: 'transparent',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.88rem', cursor: 'pointer',
            marginBottom: '0.3rem', textAlign: 'left'
          }}
        >
          <FiExternalLink size={18} /> View Portfolio
        </button>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex',
            alignItems: 'center', gap: '0.8rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px', border: 'none',
            background: 'rgba(239,68,68,0.1)',
            color: '#f87171',
            fontSize: '0.88rem', cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar