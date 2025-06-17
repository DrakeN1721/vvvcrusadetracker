import { Hono } from 'hono'
import { getAll } from '../utils/db'

const leaderboard = new Hono()

// Get leaderboard for specific crusade
leaderboard.get('/:crusadeId', async (c) => {
  const crusadeId = c.req.param('crusadeId')
  const period = c.req.query('period') || 'weekly'
  
  // Calculate date range based on period
  const now = new Date()
  let startDate = new Date()
  
  switch (period) {
    case 'daily':
      startDate.setDate(now.getDate() - 1)
      break
    case 'weekly':
      startDate.setDate(now.getDate() - 7)
      break
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1)
      break
    case 'all_time':
      startDate = new Date('2020-01-01')
      break
  }

  // Get crusade type to determine query
  const crusade = await getAll(
    c.env.DB,
    'SELECT type FROM crusades WHERE id = ?',
    [crusadeId]
  )

  if (crusade.length === 0) {
    return c.json({ error: 'Crusade not found' }, 404)
  }

  let leaderboardData = []

  if (crusade[0].type === 'fitness') {
    leaderboardData = await getAll(
      c.env.DB,
      `SELECT 
        u.id as user_id,
        u.discord_id,
        u.discord_username,
        u.discord_avatar,
        u.x_username,
        COUNT(DISTINCT fp.id) as workouts,
        SUM(fp.reps * fp.sets) as total_reps,
        MAX(fp.weight_kg) as max_weight_kg
       FROM users u
       JOIN fitness_progress fp ON u.id = fp.user_id
       WHERE fp.crusade_id = ? AND fp.created_at >= ?
       GROUP BY u.id
       ORDER BY total_reps DESC
       LIMIT 50`,
      [crusadeId, startDate.toISOString()]
    )
  } else if (crusade[0].type === 'meal') {
    leaderboardData = await getAll(
      c.env.DB,
      `SELECT 
        u.id as user_id,
        u.discord_id,
        u.discord_username,
        u.discord_avatar,
        u.x_username,
        COUNT(DISTINCT mp.id) as meals,
        SUM(mp.calories) as total_calories,
        AVG(mp.calories) as avg_calories
       FROM users u
       JOIN meal_progress mp ON u.id = mp.user_id
       WHERE mp.crusade_id = ? AND mp.created_at >= ?
       GROUP BY u.id
       ORDER BY meals DESC
       LIMIT 50`,
      [crusadeId, startDate.toISOString()]
    )
  }

  return c.json({ leaderboard: leaderboardData })
})

// Get global leaderboard
leaderboard.get('/global', async (c) => {
  const period = c.req.query('period') || 'weekly'
  
  // Calculate date range based on period
  const now = new Date()
  let startDate = new Date()
  
  switch (period) {
    case 'daily':
      startDate.setDate(now.getDate() - 1)
      break
    case 'weekly':
      startDate.setDate(now.getDate() - 7)
      break
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1)
      break
    case 'all_time':
      startDate = new Date('2020-01-01')
      break
  }

  const leaderboardData = await getAll(
    c.env.DB,
    `SELECT 
      u.id as user_id,
      u.discord_id,
      u.discord_username,
      u.discord_avatar,
      u.x_username,
      (
        SELECT COUNT(*) FROM fitness_progress 
        WHERE user_id = u.id AND created_at >= ?
      ) + (
        SELECT COUNT(*) FROM meal_progress 
        WHERE user_id = u.id AND created_at >= ?
      ) as entries,
      (
        SELECT COUNT(DISTINCT crusade_id) FROM user_crusades 
        WHERE user_id = u.id
      ) as active_crusades,
      CAST(
        COALESCE((
          SELECT SUM(reps * sets) FROM fitness_progress 
          WHERE user_id = u.id AND created_at >= ?
        ), 0) + 
        COALESCE((
          SELECT COUNT(*) * 100 FROM meal_progress 
          WHERE user_id = u.id AND created_at >= ?
        ), 0) AS INTEGER
      ) as score
     FROM users u
     WHERE EXISTS (
       SELECT 1 FROM fitness_progress WHERE user_id = u.id
       UNION
       SELECT 1 FROM meal_progress WHERE user_id = u.id
     )
     GROUP BY u.id
     ORDER BY score DESC
     LIMIT 50`,
    [startDate.toISOString(), startDate.toISOString(), startDate.toISOString(), startDate.toISOString()]
  )

  return c.json({ leaderboard: leaderboardData })
})

export default leaderboard