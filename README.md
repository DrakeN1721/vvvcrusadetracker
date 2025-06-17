# vVv Crusade Tracker

A comprehensive fitness tracking application designed for the vVv Gaming community. Track your exercise progress, participate in fitness crusades, compete on leaderboards, and share your achievements with the community.

![vVv Crusade Tracker](https://img.shields.io/badge/vVv-Crusade%20Tracker-purple)
![React](https://img.shields.io/badge/React-18.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Vite](https://img.shields.io/badge/Vite-5.0-orange)

## 🚀 Quick Start

### Development Mode (Mock Data)

The app includes a development mode with mock data for easy testing without authentication or backend setup:

```bash
# Install dependencies
npm install

# Start in development mode (with mock data)
npm run dev

# The app will auto-login and provide sample data for testing
```

### Production Mode (Supabase Backend)

For production deployment with real data persistence:

```bash
# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# Set VITE_DEV_MODE=false
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Start in production mode
npm run dev:prod
```

## ✨ Features

- 🔐 **Discord Authentication** - Secure login via Discord OAuth through Supabase
- 💪 **Exercise Tracking** - Log various exercises with weight and reps tracking
  - Bench Press, Deadlifts, Squats
  - Overhead Press, Pushups, Pullups
- 📸 **Photo Evidence** - Upload progress photos to Supabase Storage
- 🐦 **Social Sharing** - Share progress on X (Twitter)
- 🏆 **Leaderboards** - Compete with the community
  - Global leaderboard
  - Crusade-specific rankings
  - Time-based filtering (daily/weekly/monthly)
- 🎯 **Crusade System** - Join fitness challenges and track progress
- 📱 **Mobile-First Design** - Fully responsive UI optimized for mobile
- ✨ **Premium Theme** - Gold and black design matching vVv branding

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** with custom gold/black theme
- **React Router v6** for navigation
- **React Hook Form** for form handling
- **React Dropzone** for photo uploads
- **Recharts** for progress visualization

### Backend Options

#### Supabase (Recommended)
- **Supabase Auth** for Discord OAuth
- **Supabase Database** (PostgreSQL) for data storage
- **Supabase Storage** for photo uploads
- **Row Level Security** for data protection
- **Real-time subscriptions** (future feature)

#### Cloudflare Workers (Legacy)
- **Hono.js** framework
- **Cloudflare D1** (SQLite database)
- **Cloudflare R2** (object storage)
- **JWT authentication**

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Discord application for OAuth
- (Optional) X/Twitter developer account for sharing

## 🚀 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vvv-crusade-tracker.git
cd vvv-crusade-tracker
npm install
```

### 2. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your project URL and anon key from Settings > API

2. **Run Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy and run the contents of `supabase-schema-complete.sql`
   - This creates all necessary tables, views, and security policies

3. **Configure Discord OAuth**
   - In Supabase Dashboard > Authentication > Providers
   - Enable Discord provider
   - Add your Discord OAuth credentials:
     - Client ID: Your Discord app ID
     - Client Secret: Your Discord app secret
   - Set redirect URL in Discord app to:
     ```
     https://YOUR_PROJECT.supabase.co/auth/v1/callback
     ```

4. **Configure Storage**
   - The schema automatically creates a `photos` bucket
   - Verify it exists in Storage > Buckets

### 3. Environment Configuration

Create `.env.local` file:

```env
# Development Mode - Set to false for production
VITE_DEV_MODE=false

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Legacy API Configuration (optional)
VITE_API_URL=http://localhost:8787/api

# Discord OAuth (configured in Supabase)
VITE_DISCORD_CLIENT_ID=your-discord-client-id
VITE_DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
```

### 4. Run the Application

```bash
# Development mode with mock data
npm run dev

# Production mode with Supabase
npm run dev:prod

# Build for production
npm run build
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Build the app
npm run build

# Deploy the dist folder to Netlify
# Set environment variables in Netlify dashboard
```

### Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm i -g wrangler

# Deploy
wrangler pages deploy dist

# Set environment variables in Cloudflare dashboard
```

### Docker Deployment

```bash
# Build Docker image
docker build -t vvv-crusade-tracker .

# Run container
docker run -p 3000:80 \
  -e VITE_SUPABASE_URL=your-url \
  -e VITE_SUPABASE_ANON_KEY=your-key \
  vvv-crusade-tracker
```

## 📱 Usage Guide

### Getting Started
1. Visit the app and click "Login with Discord"
2. Authorize the app to access your Discord profile
3. Complete your profile by adding your X username (optional)

### Tracking Progress
1. Navigate to the Progress page
2. Select exercise type and enter your stats
3. Compare with previous performance
4. Add photos for evidence (optional)
5. Share to X with one click

### Joining Crusades
1. Browse available crusades on the Crusades page
2. Click "Enroll" to join a crusade
3. Your progress will count towards crusade leaderboards
4. Track crusade-specific achievements

### Viewing Leaderboards
1. Check global rankings on the Leaderboard page
2. Filter by time period (daily/weekly/monthly)
3. View crusade-specific leaderboards
4. See detailed stats for each participant

## 🔧 API Documentation

### Authentication Endpoints
- `GET /auth/me` - Get current user profile
- `POST /auth/logout` - Sign out user

### Crusade Management
- `GET /crusades` - List all crusades
- `GET /crusades/my` - Get user's enrolled crusades
- `POST /crusades/:id/enroll` - Enroll in a crusade
- `DELETE /crusades/:id/enroll` - Unenroll from a crusade

### Progress Tracking
- `POST /progress/fitness` - Submit exercise progress
- `POST /progress/meal` - Submit meal progress
- `GET /progress/history` - Get progress history
- `GET /progress/stats` - Get user statistics

### Leaderboards
- `GET /leaderboard/global` - Get global leaderboard
- `GET /leaderboard/:crusadeId` - Get crusade leaderboard

### File Upload
- `POST /upload/photo` - Upload progress photo
- `DELETE /upload/photo/:path` - Delete photo

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only modify their own data
- Public read access for leaderboards
- Secure photo storage with user-scoped paths
- OAuth 2.0 authentication via Discord

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Ensure `.env.local` contains valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **Discord login not working**
   - Verify Discord OAuth is enabled in Supabase
   - Check redirect URLs match in both Discord and Supabase

3. **Photos not uploading**
   - Verify the `photos` storage bucket exists
   - Check bucket policies allow public access

4. **Development mode not working**
   - Ensure `VITE_DEV_MODE=true` in `.env.local`
   - Clear browser cache and restart dev server

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- vVv Gaming community for inspiration
- Supabase team for the excellent backend platform
- All contributors and testers

## 📞 Support

- Create an issue on GitHub
- Join vVv Gaming Discord for community support
- Contact the maintainers directly

---

Built with ❤️ for the vVv Gaming community