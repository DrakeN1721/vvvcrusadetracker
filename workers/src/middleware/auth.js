import jwt from 'jsonwebtoken'

export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, c.env.JWT_SECRET)
    c.set('userId', decoded.userId)
    c.set('user', decoded)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}