export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api'

export const EXERCISES = {
  bench_press: {
    name: 'Bench Press',
    type: 'weighted',
    units: ['kg', 'lbs'],
    trackSets: true,
    icon: '🏋️',
    defaultUnit: 'kg'
  },
  deadlift: {
    name: 'Deadlift',
    type: 'weighted',
    units: ['kg', 'lbs'],
    trackSets: true,
    icon: '🏋️',
    defaultUnit: 'kg'
  },
  squat: {
    name: 'Squat',
    type: 'weighted',
    units: ['kg', 'lbs'],
    trackSets: true,
    icon: '🏋️',
    defaultUnit: 'kg'
  },
  overhead_press: {
    name: 'Overhead Press',
    type: 'weighted',
    units: ['kg', 'lbs'],
    trackSets: true,
    icon: '🏋️',
    defaultUnit: 'kg'
  },
  pushups: {
    name: 'Push-ups',
    type: 'bodyweight',
    units: ['reps'],
    trackSets: true,
    icon: '💪',
    defaultUnit: 'reps'
  },
  pullups: {
    name: 'Pull-ups',
    type: 'bodyweight',
    units: ['reps'],
    trackSets: true,
    icon: '💪',
    defaultUnit: 'reps'
  }
}

export const MEAL_TYPES = {
  breakfast: { name: 'Breakfast', icon: '🌅' },
  lunch: { name: 'Lunch', icon: '☀️' },
  dinner: { name: 'Dinner', icon: '🌙' },
  snack: { name: 'Snack', icon: '🍎' }
}

export const CRUSADE_TYPES = {
  fitness: { name: 'Fitness' },
  meal: { name: 'Meal Accountability' },
  daily: { name: 'Daily Workout' }
}

export const LEADERBOARD_PERIODS = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  all_time: 'All Time'
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
export const DISCORD_REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback'

export const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/identicon/svg?seed=vvv'