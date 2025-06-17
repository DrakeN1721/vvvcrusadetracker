export const errorHandler = (err, c) => {
  console.error('Error:', err)
  
  if (err.name === 'ValidationError') {
    return c.json({ error: 'Validation failed', details: err.details }, 400)
  }
  
  if (err.name === 'UnauthorizedError') {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  if (err.name === 'NotFoundError') {
    return c.json({ error: 'Resource not found' }, 404)
  }
  
  return c.json(
    { error: 'Internal server error' },
    500
  )
}