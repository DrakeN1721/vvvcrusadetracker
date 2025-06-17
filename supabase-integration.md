# Supabase Integration Guide

## 1. Setup Supabase Project

1. Create a new Supabase project at https://supabase.com
2. Note your project URL and anon key from Settings > API

## 2. Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Copy and run the contents of `supabase-schema.sql`
3. This creates:
   - `profiles` table (extends auth.users)
   - `exercise_progress` table with previous/current tracking
   - `user_stats` view for leaderboard data
   - Row Level Security policies
   - Automatic triggers

## 3. Configure Authentication

### Discord OAuth Setup:
1. In Supabase Dashboard > Authentication > Providers
2. Enable Discord provider
3. Add your Discord OAuth credentials:
   - Client ID: Your Discord app ID
   - Client Secret: Your Discord app secret
4. Set redirect URL in Discord app to:
   ```
   https://YOUR_PROJECT.supabase.co/auth/v1/callback
   ```

## 4. Update Frontend Configuration

Replace the `.env.local` with:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Development Mode (set false for production)
VITE_DEV_MODE=false
```

## 5. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## 6. Create Supabase Client

```javascript
// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 7. Update Auth Context for Supabase

```javascript
// Example auth with Supabase
const signInWithDiscord = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: window.location.origin
    }
  })
}
```

## 8. API Examples

### Save Exercise Progress:
```javascript
const saveProgress = async (progressData) => {
  const { data, error } = await supabase
    .from('exercise_progress')
    .insert({
      user_id: user.id,
      exercise_type: progressData.exercise_type,
      previous_weight_kg: progressData.previous_weight_kg,
      previous_reps: progressData.previous_reps,
      current_weight_kg: progressData.current_weight_kg,
      current_reps: progressData.current_reps,
      notes: progressData.notes
    })
}
```

### Get User Stats:
```javascript
const getUserStats = async () => {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .order('total_reps', { ascending: false })
}
```

### Upload Photos to Supabase Storage:
```javascript
const uploadPhoto = async (file) => {
  const fileName = `${user.id}/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('progress-photos')
    .upload(fileName, file)
    
  if (data) {
    const { data: { publicUrl } } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(fileName)
    return publicUrl
  }
}
```

## 9. Security Notes

- RLS (Row Level Security) is enabled by default
- Users can only modify their own data
- All data is viewable by everyone (for leaderboards)
- Use service role key only on backend if needed

## 10. Migration from Cloudflare

The schema is designed to be compatible with the existing app structure:
- Same field names where possible
- Support for previous/current tracking
- Photo URLs stored as array
- Discord metadata preserved