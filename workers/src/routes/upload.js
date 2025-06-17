import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { generateId } from '../utils/db'

const upload = new Hono()

// Upload photo
upload.post('/photo', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const formData = await c.req.parseBody()
  const photo = formData.photo

  if (!photo || !(photo instanceof File)) {
    return c.json({ error: 'No photo provided' }, 400)
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(photo.type)) {
    return c.json({ error: 'Invalid file type. Only JPEG and PNG are allowed' }, 400)
  }

  // Validate file size (5MB)
  if (photo.size > 5 * 1024 * 1024) {
    return c.json({ error: 'File size must be less than 5MB' }, 400)
  }

  try {
    const photoKey = `${userId}/${generateId()}-${photo.name}`
    await c.env.BUCKET.put(photoKey, photo.stream(), {
      httpMetadata: {
        contentType: photo.type,
      },
    })

    // Generate signed URL for viewing
    const signedUrl = await c.env.BUCKET.createSignedUrl(photoKey, {
      expiresIn: 3600 * 24, // 24 hours
    })

    return c.json({
      key: photoKey,
      url: signedUrl,
      size: photo.size,
      type: photo.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Failed to upload photo' }, 500)
  }
})

// Delete photo
upload.delete('/photo/:key', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const photoKey = c.req.param('key')

  // Ensure user owns the photo
  if (!photoKey.startsWith(`${userId}/`)) {
    return c.json({ error: 'Unauthorized' }, 403)
  }

  try {
    await c.env.BUCKET.delete(photoKey)
    return c.json({ message: 'Photo deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ error: 'Failed to delete photo' }, 500)
  }
})

export default upload