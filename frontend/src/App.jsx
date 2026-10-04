import './i18n'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './hooks/useAuth'
import NavBar from './components/NavBar'
import LanguageSelector from './components/LanguageSelector'
import AuthPage from './pages/AuthPage'
import OverviewPage from './pages/OverviewPage'
import AttendancePage from './pages/AttendancePage'
import StudentsPage from './pages/StudentsPage'
import AdminPage from './pages/AdminPage'
import RevealSections from './components/RevealSections'
import './App.css'

function Portal() {
  const { user, login, register, logout } = useAuth()
  const { t } = useTranslation()
  const [page, setPage] = useState('overview')

  if (!user) return <><LanguageSelector className="auth-language-selector" /><RevealSections page="auth" /><AuthPage login={login} register={register} /></>

  return (
    <div className="app-frame">
      <NavBar user={user} activePage={page} onNavigate={setPage} onLogout={logout} />
      <RevealSections page={page} />
      {page === 'overview' && <OverviewPage user={user} onNavigate={setPage} />}
      {page === 'attendance' && <AttendancePage user={user} />}
      {page === 'students' && <StudentsPage />}
      {page === 'admin' && user.roleId === 1 && <AdminPage />}
      {page === 'admin' && user.roleId !== 1 && <OverviewPage user={user} onNavigate={setPage} />}
      <footer className="app-footer"><span>{t('footer.title')}</span><span>{t('footer.subtitle')}</span><span>{t('footer.version')}</span></footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider><Portal /></AuthProvider>
  )
}
