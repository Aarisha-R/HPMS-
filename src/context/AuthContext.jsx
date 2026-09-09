import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

const normalizeRole = (role) => {
  if (!role) return 'PATIENT'
  return String(role).toUpperCase()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hpms_user')
    if (!stored) return null
    try {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        role: normalizeRole(parsed.role),
      }
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem('hpms_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('hpms_user')
    }
  }, [user])

  const login = async (identifier, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { identifier, password })
      localStorage.setItem('hpms_token', data.token)
      const loggedInUser = {
        id: data.userId,
        username: data.username,
        role: normalizeRole(data.role),
      }
      setUser(loggedInUser)
      return loggedInUser
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', payload)
      localStorage.setItem('hpms_token', data.token)
      const registeredUser = {
        id: data.userId,
        username: data.username,
        role: normalizeRole(data.role),
      }
      setUser(registeredUser)
      return registeredUser
    } finally {
      setLoading(false)
    }
  }

  const requestPasswordReset = async (identifier) => {
    const { data } = await api.post('/auth/forgot-password', { identifier })
    return data
  }

  const resetPassword = async (token, password) => {
    const { data } = await api.post('/auth/reset-password', { token, password })
    return data
  }

  const logout = () => {
    api.post('/auth/logout').catch(() => {})
    localStorage.removeItem('hpms_token')
    setUser(null)
  }

  const authValue = useMemo(
    () => ({ user, login, register, requestPasswordReset, resetPassword, logout, loading }),
    [user, loading]
  )

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
