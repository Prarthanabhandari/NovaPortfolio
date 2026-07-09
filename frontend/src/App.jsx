import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import SkillsPage from './pages/SkillsPage'
import ProjectsPage from './pages/ProjectsPage'
import CertificatesPage from './pages/CertificatesPage'
import ExperiencePage from './pages/ExperiencePage'
import AchievementsPage from './pages/AchievementsPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import ScrollToTop from './components/layout/ScrollToTop'
import ThemeToggleFloating from './components/ui/ThemeToggleFloating'

function App() {
  const location = useLocation()
  const showThemeToggle = !location.pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        
        {/* New Full Page Routes */}
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
      </Routes>
      {showThemeToggle && <ThemeToggleFloating />}
    </>
  )
}

export default App