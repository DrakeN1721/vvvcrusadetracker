import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { mockApi } from './mockApi'
import supabaseApi from './supabaseApi'

// Check if we're in dev mode
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

// Check if Supabase is configured
const SUPABASE_CONFIGURED = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

// Create axios instance for legacy API (Cloudflare Workers)
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// API wrapper that switches between Supabase, mock, or legacy API based on configuration
const api = {
  get: async (url, config) => {
    if (DEV_MODE) {
      // Route to mock endpoints
      if (url === '/auth/me') return mockApi.auth.me()
      if (url === '/crusades') return mockApi.crusades.getAll()
      if (url === '/crusades/my') return mockApi.crusades.getMy()
      if (url === '/progress/history') return mockApi.progress.getHistory(config?.params?.type)
      if (url.startsWith('/leaderboard/global')) return mockApi.leaderboard.getGlobal(config?.params?.period)
      if (url.match(/\/leaderboard\/.+/)) {
        const crusadeId = url.split('/').pop()
        return mockApi.leaderboard.getCrusade(crusadeId, config?.params?.period)
      }
      
      // Default mock response
      return { data: {} }
    }
    
    // Use Supabase if configured
    if (SUPABASE_CONFIGURED) {
      try {
        // Route to Supabase endpoints
        if (url === '/auth/me') {
          const result = await supabaseApi.auth.getCurrentUser()
          return result.error ? Promise.reject(result.error) : { data: { user: result.data } }
        }
        if (url === '/crusades') {
          const result = await supabaseApi.crusades.getAll()
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
        if (url === '/crusades/my') {
          const result = await supabaseApi.crusades.getMyCrusades()
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
        if (url === '/progress/history') {
          const result = await supabaseApi.progress.getHistory(config?.params?.type)
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
        if (url.startsWith('/leaderboard/global')) {
          const result = await supabaseApi.leaderboard.getGlobal(config?.params?.period)
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
        if (url.match(/\/leaderboard\/.+/)) {
          const crusadeId = url.split('/').pop()
          const result = await supabaseApi.leaderboard.getCrusade(crusadeId, config?.params?.period)
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
      } catch (error) {
        console.error('Supabase API error:', error)
        throw error
      }
    }
    
    // Fallback to legacy API
    return axiosInstance.get(url, config)
  },

  post: async (url, data, config) => {
    if (DEV_MODE) {
      // Route to mock endpoints
      if (url === '/auth/logout') return mockApi.auth.logout()
      if (url.match(/\/crusades\/.+\/enroll/)) {
        const crusadeId = url.split('/')[2]
        return mockApi.crusades.enroll(crusadeId)
      }
      if (url === '/progress/fitness') return mockApi.progress.submitFitness(data)
      if (url === '/progress/meal') return mockApi.progress.submitMeal(data)
      if (url === '/upload/photo') return mockApi.upload.photo(data)
      
      // Default mock response
      return { data: { message: 'Success (dev mode)' } }
    }
    
    // Use Supabase if configured
    if (SUPABASE_CONFIGURED) {
      try {
        // Route to Supabase endpoints
        if (url === '/auth/logout') {
          const result = await supabaseApi.auth.signOut()
          return result.error ? Promise.reject(result.error) : { data: { message: 'Logged out' } }
        }
        if (url.match(/\/crusades\/.+\/enroll/)) {
          const crusadeId = url.split('/')[2]
          const result = await supabaseApi.crusades.enroll(crusadeId)
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
        if (url === '/progress/fitness') {
          const result = await supabaseApi.progress.submitFitness(data)
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
        if (url === '/progress/meal') {
          const result = await supabaseApi.progress.submitMeal(data)
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
        if (url === '/upload/photo') {
          const result = await supabaseApi.upload.uploadPhoto(data)
          return result.error ? Promise.reject(result.error) : { data: result.data }
        }
      } catch (error) {
        console.error('Supabase API error:', error)
        throw error
      }
    }
    
    // Fallback to legacy API
    return axiosInstance.post(url, data, config)
  },

  delete: async (url) => {
    if (DEV_MODE) {
      // Route to mock endpoints
      if (url.match(/\/crusades\/.+\/enroll/)) {
        const crusadeId = url.split('/')[2]
        return mockApi.crusades.unenroll(crusadeId)
      }
      
      // Default mock response
      return { data: { message: 'Deleted (dev mode)' } }
    }
    
    // Use Supabase if configured
    if (SUPABASE_CONFIGURED) {
      try {
        if (url.match(/\/crusades\/.+\/enroll/)) {
          const crusadeId = url.split('/')[2]
          const result = await supabaseApi.crusades.unenroll(crusadeId)
          return result.error ? Promise.reject(result.error) : { data: { message: 'Unenrolled' } }
        }
      } catch (error) {
        console.error('Supabase API error:', error)
        throw error
      }
    }
    
    // Fallback to legacy API
    return axiosInstance.delete(url)
  },

  put: async (url, data) => {
    if (DEV_MODE) {
      // Default mock response
      return { data: { message: 'Updated (dev mode)' } }
    }
    
    // Fallback to legacy API
    return axiosInstance.put(url, data)
  }
}

export default api