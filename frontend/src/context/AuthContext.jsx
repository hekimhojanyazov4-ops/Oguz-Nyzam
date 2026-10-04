import { useState } from 'react'
import { apiPost } from '../api'
import { AuthContext } from './PortalContext'

const STORAGE_KEY = 'oguz-nyzam-user'

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  async function login(credentials) {
    const result = await apiPost('/Auth/login', credentials)
    localStorage.setItem('oguz-nyzam-token', result.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
    setUser(result)
    return result
  }

  async function register(details) {
    return apiPost('/Auth/register', details)
  }

  function logout() {
    localStorage.removeItem('oguz-nyzam-token')
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

