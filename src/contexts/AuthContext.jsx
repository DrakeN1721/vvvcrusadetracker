import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export const AuthContext = createContext()

// Development mode flag
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

// Mock user for development
const MOCK_USER = {
  id: 'dev-user-123',
  discord_id: '123456789',
  discord_username: 'DevUser',
  discord_avatar: null,
  x_username: 'devuser',
  x_connected: true
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (DEV_MODE) {
      // Auto-login in dev mode
      setUser(MOCK_USER)
      setLoading(false)
    } else {
      checkAuth()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (err) {
      localStorage.removeItem('auth_token')
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    if (DEV_MODE) {
      // Instant login in dev mode
      setUser(MOCK_USER)
      localStorage.setItem('auth_token', 'dev-token-123')
      navigate('/dashboard')
      return
    }

    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email`
    window.location.href = discordAuthUrl
  }

  const handleAuthCallback = async (code) => {
    if (DEV_MODE) {
      setUser(MOCK_USER)
      localStorage.setItem('auth_token', 'dev-token-123')
      navigate('/dashboard')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/discord/callback', { code })
      const { token, user } = response.data
      
      localStorage.setItem('auth_token', token)
      setUser(user)
      navigate('/dashboard')
    } catch (err) {
      setError('Authentication failed. Please try again.')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const connectX = async () => {
    if (DEV_MODE) {
      // Simulate X connection in dev mode
      setUser({ ...user, x_username: 'devuser', x_connected: true })
      alert('X account connected (dev mode)')
      return
    }

    try {
      const response = await api.post('/auth/x/connect')
      window.location.href = response.data.authUrl
    } catch (err) {
      setError('Failed to connect X account')
    }
  }

  const logout = async () => {
    if (!DEV_MODE) {
      try {
        await api.post('/auth/logout')
      } catch (err) {
        console.error('Logout error:', err)
      }
    }
    
    localStorage.removeItem('auth_token')
    setUser(null)
    navigate('/')
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    connectX,
    handleAuthCallback,
    checkAuth,
    isDevMode: DEV_MODE
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}