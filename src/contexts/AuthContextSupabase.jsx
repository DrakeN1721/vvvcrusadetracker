import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseAuth } from '../services/supabase'
import supabaseApi from '../services/supabaseApi'

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
  x_connected: true,
  email: 'dev@example.com'
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
      // Check for existing session
      checkAuth()
      
      // Set up auth state listener
      const { data: { subscription } } = supabaseAuth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await handleSignIn(session)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      if (session) {
        await handleSignIn(session)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Auth check error:', err)
      setError(err.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (session) => {
    try {
      // Get user profile data
      const { data: profileData, error: profileError } = await supabaseApi.auth.getCurrentUser()
      
      if (profileError) {
        console.error('Profile fetch error:', profileError)
      }
      
      // Create user object with Supabase user data and profile
      const userData = {
        id: session.user.id,
        email: session.user.email,
        discord_id: session.user.user_metadata?.provider_id || session.user.id,
        discord_username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        discord_avatar: session.user.user_metadata?.avatar_url,
        x_username: profileData?.profile?.x_username || null,
        x_connected: !!profileData?.profile?.x_username,
        ...profileData?.profile
      }
      
      setUser(userData)
      
      // Create or update profile if it doesn't exist
      if (!profileData?.profile) {
        await createProfile(userData)
      }
    } catch (err) {
      console.error('Handle sign in error:', err)
      setError('Failed to load user profile')
    }
  }

  const createProfile = async (userData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userData.id,
          discord_id: userData.discord_id,
          discord_username: userData.discord_username,
          discord_avatar: userData.discord_avatar,
          x_username: userData.x_username
        })
        .select()
        .single()
      
      if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error('Profile creation error:', error)
      }
    } catch (err) {
      console.error('Create profile error:', err)
    }
  }

  const login = async () => {
    if (DEV_MODE) {
      // Instant login in dev mode
      setUser(MOCK_USER)
      localStorage.setItem('auth_token', 'dev-token-123')
      navigate('/dashboard')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabaseApi.auth.signInWithDiscord()
      
      if (error) throw error
      
      // The redirect will happen automatically
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to initiate Discord login')
      setLoading(false)
    }
  }

  const handleAuthCallback = async () => {
    // With Supabase, the auth callback is handled automatically
    // The onAuthStateChange listener will pick up the new session
    navigate('/dashboard')
  }

  const connectX = async (xUsername) => {
    if (DEV_MODE) {
      // Simulate X connection in dev mode
      setUser({ ...user, x_username: 'devuser', x_connected: true })
      alert('X account connected (dev mode)')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabaseApi.auth.updateProfile({
        x_username: xUsername
      })
      
      if (error) throw error
      
      setUser({ ...user, x_username: xUsername, x_connected: true })
      return { success: true }
    } catch (err) {
      console.error('Connect X error:', err)
      setError('Failed to connect X account')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const disconnectX = async () => {
    if (DEV_MODE) {
      setUser({ ...user, x_username: null, x_connected: false })
      alert('X account disconnected (dev mode)')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabaseApi.auth.updateProfile({
        x_username: null
      })
      
      if (error) throw error
      
      setUser({ ...user, x_username: null, x_connected: false })
      return { success: true }
    } catch (err) {
      console.error('Disconnect X error:', err)
      setError('Failed to disconnect X account')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      
      if (!DEV_MODE) {
        const { error } = await supabaseApi.auth.signOut()
        if (error) throw error
      }
      
      localStorage.removeItem('auth_token')
      setUser(null)
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
      setError('Failed to log out')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      const { data, error } = await supabaseApi.auth.updateProfile(updates)
      
      if (error) throw error
      
      setUser({ ...user, ...data })
      return { success: true, data }
    } catch (err) {
      console.error('Update profile error:', err)
      setError('Failed to update profile')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    connectX,
    disconnectX,
    handleAuthCallback,
    checkAuth,
    updateProfile,
    isDevMode: DEV_MODE,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}