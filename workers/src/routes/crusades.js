import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { getAll, getOne, insert, executeSql, generateId } from '../utils/db'

const crusades = new Hono()

// Get all active crusades
crusades.get('/', async (c) => {
  const allCrusades = await getAll(
    c.env.DB,
    'SELECT * FROM crusades WHERE is_active = 1 ORDER BY created_at DESC'
  )

  return c.json({ crusades: allCrusades })
})

// Get user's enrolled crusades
crusades.get('/my', authMiddleware, async (c) => {
  const userId = c.get('userId')
  
  const enrolledCrusades = await getAll(
    c.env.DB,
    `SELECT c.* FROM crusades c
     JOIN user_crusades uc ON c.id = uc.crusade_id
     WHERE uc.user_id = ? AND c.is_active = 1
     ORDER BY uc.enrolled_at DESC`,
    [userId]
  )

  return c.json({ crusades: enrolledCrusades })
})

// Enroll in a crusade
crusades.post('/:id/enroll', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const crusadeId = c.req.param('id')

  // Check if crusade exists
  const crusade = await getOne(
    c.env.DB,
    'SELECT * FROM crusades WHERE id = ? AND is_active = 1',
    [crusadeId]
  )

  if (!crusade) {
    return c.json({ error: 'Crusade not found' }, 404)
  }

  // Check if already enrolled
  const existing = await getOne(
    c.env.DB,
    'SELECT * FROM user_crusades WHERE user_id = ? AND crusade_id = ?',
    [userId, crusadeId]
  )

  if (existing) {
    return c.json({ error: 'Already enrolled in this crusade' }, 400)
  }

  // Enroll user
  await insert(c.env.DB, 'user_crusades', {
    user_id: userId,
    crusade_id: crusadeId,
    enrolled_at: new Date().toISOString(),
  })

  return c.json({ message: 'Successfully enrolled in crusade' })
})

// Unenroll from a crusade
crusades.delete('/:id/enroll', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const crusadeId = c.req.param('id')

  await executeSql(
    c.env.DB,
    'DELETE FROM user_crusades WHERE user_id = ? AND crusade_id = ?',
    [userId, crusadeId]
  )

  return c.json({ message: 'Successfully unenrolled from crusade' })
})

// Initialize default crusades (run once)
crusades.post('/init', async (c) => {
  const defaultCrusades = [
    {
      id: generateId(),
      name: 'Strength Training Challenge',
      type: 'fitness',
      description: 'Track your strength progress with bench press, deadlifts, squats, and more',
      icon: '💪',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Bodyweight Warriors',
      type: 'fitness',
      description: 'Master bodyweight exercises like push-ups and pull-ups',
      icon: '🏋️',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Meal Accountability',
      type: 'meal',
      description: 'Track your daily meals and stay accountable to your nutrition goals',
      icon: '🍽️',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: 'Daily Grind',
      type: 'daily',
      description: 'Log your daily workouts and build consistency',
      icon: '📅',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ]

  for (const crusade of defaultCrusades) {
    await insert(c.env.DB, 'crusades', crusade)
  }

  return c.json({ message: 'Default crusades created', crusades: defaultCrusades })
})

export default crusades