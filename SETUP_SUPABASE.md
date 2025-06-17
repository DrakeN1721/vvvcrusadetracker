# Setting Up Supabase for vVv Crusade Tracker

Follow these steps to complete the Supabase setup:

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New project"
5. Fill in:
   - Project name: `vvv-crusade-tracker`
   - Database Password: (generate a strong password and save it)
   - Region: Choose closest to your users
   - Pricing Plan: Free tier is fine to start

## 2. Configure Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application called "vVv Crusade Tracker"
3. Go to OAuth2 → General
4. Add redirect URLs:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
5. Copy your Client ID and Client Secret

6. In Supabase Dashboard:
   - Go to Authentication → Providers
   - Enable Discord
   - Paste your Discord Client ID and Secret
   - Save

## 3. Run Database Schema

1. In Supabase Dashboard, go to SQL Editor
2. Create a new query
3. Copy and paste the contents of `supabase-schema-complete.sql`
4. Run the query

## 4. Set Up Storage

1. Go to Storage in Supabase Dashboard
2. Create a new bucket called `progress-photos`
3. Set it to public (or configure RLS policies as needed)

## 5. Get Your Credentials

1. Go to Settings → API
2. Copy:
   - Project URL (VITE_SUPABASE_URL)
   - Anon/Public key (VITE_SUPABASE_ANON_KEY)

## 6. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_DISCORD_CLIENT_ID=your-discord-client-id
VITE_DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_API_URL=http://localhost:8787/api
VITE_DEVELOPMENT_MODE=false
```

## 7. Test Locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 and test Discord login!

## 8. Deploy

Follow the deployment guide in `.github/DEPLOYMENT_GUIDE.md` for your preferred platform.

## Need Help?

- Check the README.md for more details
- Review troubleshooting in the deployment guide
- Open an issue on GitHub if you encounter problems