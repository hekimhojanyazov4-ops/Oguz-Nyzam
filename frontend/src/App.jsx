import { useState } from 'react'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './hooks/useAuth'
import NavBar from './components/NavBar'
import AuthPage from './pages/AuthPage'
import OverviewPage from './pages/OverviewPage'
import AttendancePage from './pages/AttendancePage'
import StudentsPage from './pages/StudentsPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function Portal() {
  const { user, login, register, logout } = useAuth()
  const [page, setPage] = useState('overview')

  if (!user) return <AuthPage login={login} register={register} />

  return (
    <div className="app-frame">
      <NavBar user={user} activePage={page} onNavigate={setPage} onLogout={logout} />
      {page === 'overview' && <OverviewPage user={user} onNavigate={setPage} />}
      {page === 'attendance' && <AttendancePage user={user} />}
      {page === 'students' && <StudentsPage />}
      {page === 'admin' && user.roleId === 1 && <AdminPage />}
      {page === 'admin' && user.roleId !== 1 && <OverviewPage user={user} onNavigate={setPage} />}
      <footer className="app-footer"><span>OGUZ NYZAM</span><span>Campus records portal</span><span>V 1.0</span></footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider><Portal /></AuthProvider>
  )
}
