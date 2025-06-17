# Deployment Guide

This guide explains how to deploy the vVv Crusade Tracker to various platforms.

## Required Secrets

Before deploying, you need to set up the following secrets in your GitHub repository:

### Application Secrets
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Deployment Platform Secrets

#### Docker Hub (Optional)
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password or access token

#### Vercel (Optional)
- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

#### Netlify (Optional)
- `NETLIFY_AUTH_TOKEN` - Your Netlify personal access token
- `NETLIFY_SITE_ID` - Your Netlify site ID

#### Cloudflare Pages (Optional)
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## Setting Up GitHub Secrets

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Navigate to "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Add each secret with its corresponding value

## Deployment Options

### 1. Vercel (Recommended)

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in project directory
4. Get your tokens from Vercel dashboard
5. Add secrets to GitHub
6. Push to main branch to trigger deployment

### 2. Netlify

1. Create a Netlify account at https://netlify.com
2. Create a new site from Git
3. Get your auth token from User Settings > Applications
4. Add secrets to GitHub
5. Push to main branch to trigger deployment

### 3. Cloudflare Pages

1. Create a Cloudflare account
2. Go to Pages section
3. Create API token with Pages permissions
4. Add secrets to GitHub
5. Push to main branch to trigger deployment

### 4. Docker

1. Build locally: `docker build -t vvv-crusade-tracker .`
2. Run: `docker run -p 3000:80 --env-file .env vvv-crusade-tracker`
3. Or use Docker Compose: `docker-compose up`

### 5. Manual Deployment

1. Build the application: `npm run build`
2. Upload the `dist` folder to any static hosting service
3. Configure environment variables on the hosting platform

## Environment Variables

Make sure to set these environment variables on your deployment platform:

```env
VITE_DEV_MODE=false
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Post-Deployment Checklist

- [ ] Verify Discord OAuth redirect URL in Supabase
- [ ] Test login functionality
- [ ] Check photo upload works
- [ ] Verify leaderboards load correctly
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (should be automatic on most platforms)

## Troubleshooting

### Build Failures
- Check all environment variables are set
- Verify Node.js version is 18+
- Clear cache and retry

### Authentication Issues
- Verify Discord OAuth is configured in Supabase
- Check redirect URLs match your deployment URL
- Ensure Supabase project is not paused

### Performance Issues
- Enable caching headers
- Use CDN for static assets
- Optimize images before upload

## Monitoring

Consider setting up:
- Uptime monitoring (e.g., UptimeRobot)
- Error tracking (e.g., Sentry)
- Analytics (e.g., Google Analytics)
- Performance monitoring (e.g., Web Vitals)