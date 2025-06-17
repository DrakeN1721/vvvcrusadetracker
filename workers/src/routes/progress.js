import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { generateId, insert, getAll, getOne } from '../utils/db'

const progress = new Hono()

// Log fitness progress
progress.post('/fitness', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const formData = await c.req.parseBody()
  
  const {
    crusade_id,
    exercise_type,
    weight_kg,
    weight_lbs,
    reps,
    sets,
    notes,
  } = formData

  // Validate required fields
  if (!crusade_id || !exercise_type || !reps) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  // Handle photo uploads
  const photoUrls = []
  for (let i = 0; i < 2; i++) {
    const photo = formData[`photos[${i}]`]
    if (photo && photo instanceof File) {
      const photoKey = `${userId}/${generateId()}-${photo.name}`
      await c.env.BUCKET.put(photoKey, photo.stream())
      photoUrls.push(photoKey)
    }
  }

  // Create progress entry
  const progressId = generateId()
  await insert(c.env.DB, 'fitness_progress', {
    id: progressId,
    user_id: userId,
    crusade_id,
    exercise_type,
    weight_kg: weight_kg || null,
    weight_lbs: weight_lbs || null,
    reps: parseInt(reps),
    sets: parseInt(sets || 1),
    notes: notes || null,
    photo_urls: JSON.stringify(photoUrls),
    created_at: new Date().toISOString(),
  })

  return c.json({ 
    message: 'Progress logged successfully',
    id: progressId 
  })
})

// Log meal progress
progress.post('/meal', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const formData = await c.req.parseBody()
  
  const {
    crusade_id,
    meal_type,
    calories,
    protein_g,
    carbs_g,
    fat_g,
    food_items,
    notes,
  } = formData

  // Validate required fields
  if (!crusade_id || !meal_type || !calories) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  // Handle photo uploads
  const photoUrls = []
  for (let i = 0; i < 2; i++) {
    const photo = formData[`photos[${i}]`]
    if (photo && photo instanceof File) {
      const photoKey = `${userId}/${generateId()}-${photo.name}`
      await c.env.BUCKET.put(photoKey, photo.stream())
      photoUrls.push(photoKey)
    }
  }

  // Create progress entry
  const progressId = generateId()
  await insert(c.env.DB, 'meal_progress', {
    id: progressId,
    user_id: userId,
    crusade_id,
    meal_type,
    calories: parseInt(calories),
    protein_g: protein_g ? parseFloat(protein_g) : null,
    carbs_g: carbs_g ? parseFloat(carbs_g) : null,
    fat_g: fat_g ? parseFloat(fat_g) : null,
    food_items: food_items || null,
    notes: notes || null,
    photo_urls: JSON.stringify(photoUrls),
    created_at: new Date().toISOString(),
  })

  return c.json({ 
    message: 'Meal logged successfully',
    id: progressId 
  })
})

// Get progress history
progress.get('/history', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const type = c.req.query('type') || 'fitness'
  
  let entries = []
  
  if (type === 'fitness') {
    entries = await getAll(
      c.env.DB,
      `SELECT fp.*, c.name as crusade_name
       FROM fitness_progress fp
       JOIN crusades c ON fp.crusade_id = c.id
       WHERE fp.user_id = ?
       ORDER BY fp.created_at DESC
       LIMIT 50`,
      [userId]
    )
  } else if (type === 'meal') {
    entries = await getAll(
      c.env.DB,
      `SELECT mp.*, c.name as crusade_name
       FROM meal_progress mp
       JOIN crusades c ON mp.crusade_id = c.id
       WHERE mp.user_id = ?
       ORDER BY mp.created_at DESC
       LIMIT 50`,
      [userId]
    )
  }

  return c.json({ entries })
})

// Get specific progress entry
progress.get('/:id', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const progressId = c.req.param('id')
  
  // Try fitness progress first
  let entry = await getOne(
    c.env.DB,
    'SELECT * FROM fitness_progress WHERE id = ? AND user_id = ?',
    [progressId, userId]
  )
  
  if (!entry) {
    // Try meal progress
    entry = await getOne(
      c.env.DB,
      'SELECT * FROM meal_progress WHERE id = ? AND user_id = ?',
      [progressId, userId]
    )
  }
  
  if (!entry) {
    return c.json({ error: 'Progress entry not found' }, 404)
  }

  return c.json({ entry })
})

export default progress