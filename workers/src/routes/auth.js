import { Hono } from 'hono'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../middleware/auth'
import { generateId, getOne, insert, update } from '../utils/db'

const auth = new Hono()

// Discord OAuth2 callback
auth.post('/discord/callback', async (c) => {
  const { code } = await c.req.json()
  
  if (!code) {
    return c.json({ error: 'No authorization code provided' }, 400)
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: c.env.DISCORD_CLIENT_ID,
        client_secret: c.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: c.env.DISCORD_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info')
    }

    const discordUser = await userResponse.json()

    // Check if user exists
    let user = await getOne(
      c.env.DB,
      'SELECT * FROM users WHERE discord_id = ?',
      [discordUser.id]
    )

    if (!user) {
      // Create new user
      const userId = generateId()
      await insert(c.env.DB, 'users', {
        id: userId,
        discord_id: discordUser.id,
        discord_username: discordUser.username,
        discord_avatar: discordUser.avatar,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      
      user = {
        id: userId,
        discord_id: discordUser.id,
        discord_username: discordUser.username,
        discord_avatar: discordUser.avatar,
      }
    } else {
      // Update existing user
      await update(
        c.env.DB,
        'users',
        {
          discord_username: discordUser.username,
          discord_avatar: discordUser.avatar,
          updated_at: new Date().toISOString(),
        },
        'discord_id = ?',
        [discordUser.id]
      )
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        discord_id: user.discord_id,
        discord_username: user.discord_username,
      },
      c.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    return c.json({
      token,
      user: {
        id: user.id,
        discord_id: user.discord_id,
        discord_username: user.discord_username,
        discord_avatar: user.discord_avatar,
        x_username: user.x_username,
        x_connected: !!user.x_username,
      },
    })
  } catch (error) {
    console.error('Discord auth error:', error)
    return c.json({ error: 'Authentication failed' }, 500)
  }
})

// Get current user
auth.get('/me', authMiddleware, async (c) => {
  const userId = c.get('userId')
  
  const user = await getOne(
    c.env.DB,
    'SELECT * FROM users WHERE id = ?',
    [userId]
  )

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({
    user: {
      id: user.id,
      discord_id: user.discord_id,
      discord_username: user.discord_username,
      discord_avatar: user.discord_avatar,
      x_username: user.x_username,
      x_connected: !!user.x_username,
    },
  })
})

// Logout (client-side token removal)
auth.post('/logout', authMiddleware, (c) => {
  return c.json({ message: 'Logged out successfully' })
})

export default auth