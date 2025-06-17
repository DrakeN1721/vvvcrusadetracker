import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/auth'
import crusadeRoutes from './routes/crusades'
import progressRoutes from './routes/progress'
import leaderboardRoutes from './routes/leaderboard'
import uploadRoutes from './routes/upload'
import { errorHandler } from './middleware/errorHandler'

const app = new Hono()

// CORS configuration
app.use('*', cors({
  origin: (origin) => origin,
  credentials: true,
}))

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.route('/api/auth', authRoutes)
app.route('/api/crusades', crusadeRoutes)
app.route('/api/progress', progressRoutes)
app.route('/api/leaderboard', leaderboardRoutes)
app.route('/api/upload', uploadRoutes)

// Error handling
app.onError(errorHandler)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

export default app