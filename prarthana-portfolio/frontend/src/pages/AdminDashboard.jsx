import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/admin/Sidebar'
import DashboardHome from '../components/admin/DashboardHome'
import { Routes, Route } from 'react-router-dom'
import ManageProjects from '../components/admin/ManageProjects'
import ManageCertificates from '../components/admin/ManageCertificates'
import ManageSkills from '../components/admin/ManageSkills'
import ManageMessages from '../components/admin/ManageMessages'
import SiteSettings from '../components/admin/SiteSettings'
import SocialLinks from '../components/admin/SocialLinks'
import ManageExperience from '../components/admin/ManageExperience'
import ManageBlogs from '../components/admin/ManageBlogs'
const AdminDashboard = () => {
  const { admin, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !admin) navigate('/admin/login')
  }, [admin, loading])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', padding: '2.5rem 2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/projects" element={<ManageProjects />} />
            <Route path="/certificates" element={<ManageCertificates />} />
            <Route path="/skills" element={<ManageSkills />} />
            <Route path="/messages" element={<ManageMessages />} />
            <Route path="/settings" element={<SiteSettings />} />
            <Route path="/social" element={<SocialLinks />} />
            <Route path="experience" element={<ManageExperience />} />
            <Route path="/blogs" element={<ManageBlogs />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard