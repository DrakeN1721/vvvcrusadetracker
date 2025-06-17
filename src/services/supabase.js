import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Supabase configuration error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'vvv-crusade-tracker'
    }
  }
})

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  
  if (error.code === 'PGRST301') {
    return { error: 'Database query returned no rows' }
  }
  
  if (error.code === '23505') {
    return { error: 'A record with this value already exists' }
  }
  
  if (error.code === '22P02') {
    return { error: 'Invalid input format' }
  }
  
  if (error.message?.includes('JWT')) {
    return { error: 'Authentication error. Please log in again.' }
  }
  
  if (error.message?.includes('NetworkError')) {
    return { error: 'Network error. Please check your connection.' }
  }
  
  return { error: error.message || 'An unexpected error occurred' }
}

// Helper function to check if user is authenticated
export const checkAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session, error: null }
  } catch (error) {
    return { session: null, error: handleSupabaseError(error) }
  }
}

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    return { user: null, error: handleSupabaseError(error) }
  }
}

// Export auth helper for easy access
export const supabaseAuth = supabase.auth