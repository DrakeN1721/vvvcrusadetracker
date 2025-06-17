// Mock API service for development mode
import { 
  mockCrusades, 
  mockEnrolledCrusades, 
  mockFitnessHistory, 
  mockMealHistory,
  mockLeaderboard,
  mockMealLeaderboard
} from './mockData'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  // Auth endpoints
  auth: {
    me: async () => {
      await delay(100)
      return {
        data: {
          user: {
            id: 'dev-user-123',
            discord_id: '123456789',
            discord_username: 'DevUser',
            discord_avatar: null,
            x_username: 'devuser',
            x_connected: true,
          }
        }
      }
    },
    logout: async () => {
      await delay(100)
      return { data: { message: 'Logged out successfully' } }
    }
  },

  // Crusades endpoints
  crusades: {
    getAll: async () => {
      await delay(200)
      return { data: { crusades: mockCrusades } }
    },
    getMy: async () => {
      await delay(200)
      return { data: { crusades: mockEnrolledCrusades } }
    },
    enroll: async (crusadeId) => {
      await delay(300)
      const crusade = mockCrusades.find(c => c.id === crusadeId)
      if (!mockEnrolledCrusades.includes(crusade)) {
        mockEnrolledCrusades.push(crusade)
      }
      return { data: { message: 'Successfully enrolled in crusade' } }
    },
    unenroll: async (crusadeId) => {
      await delay(300)
      const index = mockEnrolledCrusades.findIndex(c => c.id === crusadeId)
      if (index > -1) {
        mockEnrolledCrusades.splice(index, 1)
      }
      return { data: { message: 'Successfully unenrolled from crusade' } }
    }
  },

  // Progress endpoints
  progress: {
    submitFitness: async (data) => {
      await delay(500)
      const newEntry = {
        id: `progress-${Date.now()}`,
        user_id: 'dev-user-123',
        crusade_id: data.get('crusade_id'),
        exercise_type: data.get('exercise_type'),
        weight_kg: data.get('weight_kg'),
        weight_lbs: data.get('weight_lbs'),
        reps: parseInt(data.get('reps')),
        sets: parseInt(data.get('sets') || 1),
        notes: data.get('notes'),
        photo_urls: '[]',
        created_at: new Date().toISOString(),
      }
      mockFitnessHistory.unshift(newEntry)
      return { data: { message: 'Progress logged successfully', id: newEntry.id } }
    },
    submitMeal: async (data) => {
      await delay(500)
      const newEntry = {
        id: `meal-${Date.now()}`,
        user_id: 'dev-user-123',
        crusade_id: data.get('crusade_id'),
        meal_type: data.get('meal_type'),
        calories: parseInt(data.get('calories')),
        protein_g: data.get('protein_g') ? parseFloat(data.get('protein_g')) : null,
        carbs_g: data.get('carbs_g') ? parseFloat(data.get('carbs_g')) : null,
        fat_g: data.get('fat_g') ? parseFloat(data.get('fat_g')) : null,
        food_items: data.get('food_items'),
        notes: data.get('notes'),
        photo_urls: '[]',
        created_at: new Date().toISOString(),
      }
      mockMealHistory.unshift(newEntry)
      return { data: { message: 'Meal logged successfully', id: newEntry.id } }
    },
    getHistory: async (type) => {
      await delay(300)
      const entries = type === 'fitness' ? mockFitnessHistory : mockMealHistory
      return { data: { entries } }
    }
  },

  // Leaderboard endpoints
  leaderboard: {
    getCrusade: async (crusadeId, period) => {
      await delay(400)
      const crusade = mockCrusades.find(c => c.id === crusadeId)
      if (crusade?.type === 'meal') {
        return { data: { leaderboard: mockMealLeaderboard } }
      }
      return { data: { leaderboard: mockLeaderboard } }
    },
    getGlobal: async (period) => {
      await delay(400)
      return { data: { leaderboard: mockLeaderboard } }
    }
  },

  // Upload endpoints
  upload: {
    photo: async (data) => {
      await delay(800)
      return {
        data: {
          key: `dev-photo-${Date.now()}`,
          url: 'https://via.placeholder.com/400x300',
          size: 123456,
          type: 'image/jpeg'
        }
      }
    }
  }
}