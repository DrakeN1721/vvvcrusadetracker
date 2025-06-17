import { supabase, handleSupabaseError } from './supabase'

// Auth API
export const authApi = {
  // Sign in with Discord OAuth
  signInWithDiscord: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: window.location.origin,
          scopes: 'identify email'
        }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      // Get user profile from profiles table
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileError && profileError.code !== 'PGRST116') throw profileError
        
        return { 
          data: {
            ...user,
            profile: profile || null
          }, 
          error: null 
        }
      }
      
      return { data: null, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Update user profile
  updateProfile: async (updates) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  }
}

// Crusades API
export const crusadesApi = {
  // Get all crusades
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('crusades')
        .select('*')
        .order('start_date', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Get user's enrolled crusades
  getMyCrusades: async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      const { data, error } = await supabase
        .from('user_crusades')
        .select(`
          crusade_id,
          enrolled_at,
          crusades (*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false })
      
      if (error) throw error
      
      // Flatten the response
      const crusades = data.map(item => ({
        ...item.crusades,
        enrolled_at: item.enrolled_at
      }))
      
      return { data: crusades, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Enroll in a crusade
  enroll: async (crusadeId) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      const { data, error } = await supabase
        .from('user_crusades')
        .insert({
          user_id: user.id,
          crusade_id: crusadeId
        })
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Unenroll from a crusade
  unenroll: async (crusadeId) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      const { error } = await supabase
        .from('user_crusades')
        .delete()
        .eq('user_id', user.id)
        .eq('crusade_id', crusadeId)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Progress API
export const progressApi = {
  // Submit fitness progress
  submitFitness: async (progressData) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      // Convert weight to both kg and lbs
      const weightKg = progressData.weight_unit === 'kg' 
        ? progressData.current_weight 
        : progressData.current_weight * 0.453592
      const weightLbs = progressData.weight_unit === 'lbs' 
        ? progressData.current_weight 
        : progressData.current_weight * 2.20462
      
      const previousWeightKg = progressData.previous_weight && progressData.weight_unit === 'kg' 
        ? progressData.previous_weight 
        : progressData.previous_weight * 0.453592
      const previousWeightLbs = progressData.previous_weight && progressData.weight_unit === 'lbs' 
        ? progressData.previous_weight 
        : progressData.previous_weight * 2.20462
      
      const { data, error } = await supabase
        .from('exercise_progress')
        .insert({
          user_id: user.id,
          exercise_type: progressData.exercise_type,
          previous_weight_kg: progressData.previous_weight ? previousWeightKg : null,
          previous_weight_lbs: progressData.previous_weight ? previousWeightLbs : null,
          previous_reps: progressData.previous_reps || null,
          current_weight_kg: weightKg,
          current_weight_lbs: weightLbs,
          current_reps: progressData.current_reps,
          sets: progressData.sets || 1,
          notes: progressData.notes || null,
          photo_urls: progressData.photo_urls || [],
          x_post_url: progressData.x_post_url || null,
          crusade_id: progressData.crusade_id || null
        })
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Submit meal progress (if tracking meals)
  submitMeal: async (mealData) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      const { data, error } = await supabase
        .from('meal_progress')
        .insert({
          user_id: user.id,
          meal_type: mealData.meal_type,
          description: mealData.description,
          calories: mealData.calories || null,
          protein_g: mealData.protein_g || null,
          carbs_g: mealData.carbs_g || null,
          fat_g: mealData.fat_g || null,
          photo_urls: mealData.photo_urls || [],
          crusade_id: mealData.crusade_id || null
        })
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Get progress history
  getHistory: async (type = 'all', limit = 50) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      let query = supabase
        .from('exercise_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (type !== 'all') {
        query = query.eq('exercise_type', type)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Get progress stats
  getStats: async (crusadeId = null) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      let query = supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (crusadeId) {
        // Get stats for specific crusade
        query = supabase
          .from('exercise_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('crusade_id', crusadeId)
      }
      
      const { data, error } = await query
      
      if (error && error.code !== 'PGRST116') throw error
      return { data: data || null, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  }
}

// Leaderboard API
export const leaderboardApi = {
  // Get global leaderboard
  getGlobal: async (period = 'all') => {
    try {
      let query = supabase
        .from('user_stats')
        .select('*')
        .order('total_reps', { ascending: false })
        .limit(100)
      
      // Filter by period if needed
      if (period !== 'all') {
        const startDate = getStartDateForPeriod(period)
        // Would need a more complex query or view for period filtering
        // For now, returning all data
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Get crusade-specific leaderboard
  getCrusade: async (crusadeId, period = 'all') => {
    try {
      // Complex query to get crusade-specific stats
      const { data, error } = await supabase
        .rpc('get_crusade_leaderboard', {
          p_crusade_id: crusadeId,
          p_period: period
        })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      // Fallback to simpler query if RPC doesn't exist
      try {
        const { data, error } = await supabase
          .from('exercise_progress')
          .select(`
            user_id,
            profiles!inner(discord_username, discord_avatar, x_username),
            current_reps,
            sets
          `)
          .eq('crusade_id', crusadeId)
        
        if (error) throw error
        
        // Aggregate data client-side
        const userStats = {}
        data.forEach(record => {
          const userId = record.user_id
          if (!userStats[userId]) {
            userStats[userId] = {
              user_id: userId,
              discord_username: record.profiles.discord_username,
              discord_avatar: record.profiles.discord_avatar,
              x_username: record.profiles.x_username,
              total_reps: 0,
              total_workouts: 0
            }
          }
          userStats[userId].total_reps += record.current_reps * (record.sets || 1)
          userStats[userId].total_workouts += 1
        })
        
        const leaderboard = Object.values(userStats)
          .sort((a, b) => b.total_reps - a.total_reps)
        
        return { data: leaderboard, error: null }
      } catch (fallbackError) {
        return { data: null, ...handleSupabaseError(fallbackError) }
      }
    }
  }
}

// Upload API
export const uploadApi = {
  // Upload photo to Supabase Storage
  uploadPhoto: async (file, folder = 'progress-photos') => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${folder}/${fileName}`
      
      // Upload file
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)
      
      return { 
        data: {
          path: data.path,
          url: publicUrl
        }, 
        error: null 
      }
    } catch (error) {
      return { data: null, ...handleSupabaseError(error) }
    }
  },

  // Delete photo from storage
  deletePhoto: async (path) => {
    try {
      const { error } = await supabase.storage
        .from('photos')
        .remove([path])
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Helper function to get start date for period
function getStartDateForPeriod(period) {
  const now = new Date()
  switch (period) {
    case 'daily':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    case 'weekly':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      return weekStart
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1)
    default:
      return null
  }
}

// Export all APIs
export default {
  auth: authApi,
  crusades: crusadesApi,
  progress: progressApi,
  leaderboard: leaderboardApi,
  upload: uploadApi
}