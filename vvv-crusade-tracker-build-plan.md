# vVv Crusade Tracker - Complete Build Plan

## 1. Technical Architecture Overview

### Frontend Architecture
- **Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS with custom gold/black theme matching chips.vvv.net
- **Routing**: React Router v6 for SPA navigation
- **State Management**: React Context API + useReducer for global state
- **Form Handling**: React Hook Form for complex fitness/meal forms
- **Photo Upload**: React Dropzone with preview functionality
- **API Client**: Axios with interceptors for auth tokens

### Backend Architecture
- **Runtime**: Cloudflare Workers with Hono.js framework
- **Database**: Cloudflare D1 (SQLite) for user data and progress tracking
- **File Storage**: Cloudflare R2 for photo uploads
- **Authentication**: JWT tokens with Discord OAuth2 flow
- **API Design**: RESTful with JSON responses
- **Rate Limiting**: Cloudflare rate limiting rules

### Third-Party Integrations
- **Discord**: OAuth2 for authentication
- **X (Twitter)**: OAuth 1.0a for posting updates
- **Image Processing**: Cloudflare Images for optimization

## 2. Database Schema (Cloudflare D1)

```sql
-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    discord_id TEXT UNIQUE NOT NULL,
    discord_username TEXT NOT NULL,
    discord_avatar TEXT,
    x_username TEXT,
    x_oauth_token TEXT,
    x_oauth_secret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crusades table
CREATE TABLE crusades (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('fitness', 'meal', 'daily')),
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User crusade enrollments
CREATE TABLE user_crusades (
    user_id TEXT NOT NULL,
    crusade_id TEXT NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, crusade_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (crusade_id) REFERENCES crusades(id)
);

-- Fitness progress entries
CREATE TABLE fitness_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    crusade_id TEXT NOT NULL,
    exercise_type TEXT NOT NULL CHECK(exercise_type IN ('bench_press', 'deadlift', 'squat', 'overhead_press', 'pushups', 'pullups')),
    weight_kg REAL,
    weight_lbs REAL,
    reps INTEGER NOT NULL,
    sets INTEGER DEFAULT 1,
    notes TEXT,
    photo_urls TEXT, -- JSON array of photo URLs
    x_post_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (crusade_id) REFERENCES crusades(id)
);

-- Meal progress entries
CREATE TABLE meal_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    crusade_id TEXT NOT NULL,
    meal_type TEXT NOT NULL CHECK(meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    calories INTEGER,
    protein_g REAL,
    carbs_g REAL,
    fat_g REAL,
    food_items TEXT,
    notes TEXT,
    photo_urls TEXT, -- JSON array of photo URLs
    x_post_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (crusade_id) REFERENCES crusades(id)
);

-- Leaderboard cache
CREATE TABLE leaderboard_cache (
    crusade_id TEXT NOT NULL,
    period TEXT NOT NULL CHECK(period IN ('daily', 'weekly', 'monthly', 'all_time')),
    data TEXT NOT NULL, -- JSON data
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (crusade_id, period)
);
```

## 3. API Endpoints Design

### Authentication Endpoints
- `GET /api/auth/discord` - Initiate Discord OAuth2 flow
- `GET /api/auth/discord/callback` - Handle Discord OAuth2 callback
- `POST /api/auth/x/connect` - Connect X (Twitter) account
- `GET /api/auth/x/callback` - Handle X OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Crusade Management
- `GET /api/crusades` - List all active crusades
- `POST /api/crusades/:id/enroll` - Enroll in a crusade
- `DELETE /api/crusades/:id/enroll` - Unenroll from a crusade
- `GET /api/crusades/my` - Get user's enrolled crusades

### Progress Tracking
- `POST /api/progress/fitness` - Log fitness progress
- `POST /api/progress/meal` - Log meal progress
- `GET /api/progress/history` - Get user's progress history
- `GET /api/progress/:id` - Get specific progress entry
- `PUT /api/progress/:id` - Update progress entry
- `DELETE /api/progress/:id` - Delete progress entry

### File Upload
- `POST /api/upload/photo` - Upload photo to R2
- `DELETE /api/upload/photo/:key` - Delete uploaded photo

### Social Sharing
- `POST /api/share/x` - Post progress to X (Twitter)
- `GET /api/share/preview` - Preview X post before sharing

### Leaderboard
- `GET /api/leaderboard/:crusadeId` - Get leaderboard for specific crusade
- `GET /api/leaderboard/global` - Get global leaderboard

## 4. React Component Architecture

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginButton.jsx
│   │   ├── UserProfile.jsx
│   │   └── AuthGuard.jsx
│   ├── crusades/
│   │   ├── CrusadeList.jsx
│   │   ├── CrusadeCard.jsx
│   │   ├── CrusadeSelector.jsx
│   │   └── EnrollmentButton.jsx
│   ├── progress/
│   │   ├── FitnessForm.jsx
│   │   ├── MealForm.jsx
│   │   ├── ProgressHistory.jsx
│   │   ├── ProgressCard.jsx
│   │   └── ExerciseSelector.jsx
│   ├── upload/
│   │   ├── PhotoUploader.jsx
│   │   ├── PhotoPreview.jsx
│   │   └── UploadProgress.jsx
│   ├── social/
│   │   ├── XPostPreview.jsx
│   │   ├── ShareButton.jsx
│   │   └── XConnectButton.jsx
│   ├── leaderboard/
│   │   ├── LeaderboardTable.jsx
│   │   ├── LeaderboardRow.jsx
│   │   └── PeriodSelector.jsx
│   └── common/
│       ├── Layout.jsx
│       ├── Header.jsx
│       ├── Navigation.jsx
│       ├── Footer.jsx
│       ├── LoadingSpinner.jsx
│       ├── ErrorMessage.jsx
│       └── SuccessToast.jsx
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── CrusadeDetail.jsx
│   ├── Progress.jsx
│   ├── Leaderboard.jsx
│   └── Profile.jsx
├── contexts/
│   ├── AuthContext.jsx
│   ├── CrusadeContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   ├── useFileUpload.js
│   └── useLocalStorage.js
├── services/
│   ├── api.js
│   ├── auth.js
│   ├── storage.js
│   └── social.js
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── constants.js
└── styles/
    ├── globals.css
    └── theme.js
```

## 5. UI/UX Design Guidelines

### Color Palette (chips.vvv.net inspired)
- Primary Gold: #FFD700
- Dark Gold: #B8860B
- Primary Black: #000000
- Dark Grey: #1A1A1A
- Light Grey: #2D2D2D
- White: #FFFFFF
- Success Green: #10B981
- Error Red: #EF4444

### Typography
- Headers: Inter or system font, bold
- Body: Inter or system font, regular
- Monospace: 'Courier New' for numbers/stats

### Component Styling
- Cards: Black background with gold borders
- Buttons: Gold background with black text (primary), black with gold border (secondary)
- Forms: Dark grey backgrounds with gold focus states
- Icons: Gold color for active states
- Shadows: Subtle gold glow effects

## 6. Fitness Exercises Data Model

```javascript
const EXERCISES = {
  bench_press: {
    name: "Bench Press",
    type: "weighted",
    units: ["kg", "lbs"],
    trackSets: true,
    icon: "🏋️"
  },
  deadlift: {
    name: "Deadlift",
    type: "weighted",
    units: ["kg", "lbs"],
    trackSets: true,
    icon: "🏋️"
  },
  squat: {
    name: "Squat",
    type: "weighted",
    units: ["kg", "lbs"],
    trackSets: true,
    icon: "🏋️"
  },
  overhead_press: {
    name: "Overhead Press",
    type: "weighted",
    units: ["kg", "lbs"],
    trackSets: true,
    icon: "🏋️"
  },
  pushups: {
    name: "Push-ups",
    type: "bodyweight",
    units: ["reps"],
    trackSets: true,
    icon: "💪"
  },
  pullups: {
    name: "Pull-ups",
    type: "bodyweight",
    units: ["reps"],
    trackSets: true,
    icon: "💪"
  }
};
```

## 7. State Management Structure

```javascript
// Global App State
{
  auth: {
    isAuthenticated: boolean,
    user: {
      id: string,
      discordUsername: string,
      discordAvatar: string,
      xUsername: string,
      xConnected: boolean
    },
    loading: boolean,
    error: string | null
  },
  crusades: {
    available: Crusade[],
    enrolled: Crusade[],
    selected: string | null,
    loading: boolean,
    error: string | null
  },
  progress: {
    entries: ProgressEntry[],
    current: {
      type: 'fitness' | 'meal',
      data: object,
      photos: File[]
    },
    uploading: boolean,
    history: ProgressEntry[],
    loading: boolean,
    error: string | null
  },
  leaderboard: {
    data: LeaderboardEntry[],
    period: 'daily' | 'weekly' | 'monthly' | 'all_time',
    loading: boolean,
    error: string | null
  }
}
```

## 8. Security Considerations

### Authentication
- JWT tokens with 24-hour expiration
- Refresh tokens stored in httpOnly cookies
- CORS configuration for API endpoints
- Rate limiting on auth endpoints

### Data Protection
- Input validation on all forms
- SQL injection prevention via parameterized queries
- XSS protection with React's built-in escaping
- CSRF tokens for state-changing operations

### File Upload Security
- File type validation (JPEG, PNG only)
- Max file size: 5MB per photo
- Virus scanning via Cloudflare
- Signed URLs for R2 uploads

## 9. Performance Optimization

### Frontend
- Code splitting by route
- Lazy loading for images
- React.memo for expensive components
- Virtual scrolling for long lists
- Service worker for offline support

### Backend
- Edge caching with Cloudflare
- Database query optimization
- Batch operations where possible
- Compression for API responses

## 10. Mobile Optimization

### Responsive Design
- Mobile-first approach
- Touch-friendly buttons (min 44px)
- Swipe gestures for navigation
- Bottom navigation for mobile
- Optimized forms for mobile input

### PWA Features
- App manifest for installability
- Offline support for viewing data
- Push notifications for reminders
- Camera integration for photos

## 11. Deployment Strategy

### Development
1. Local development with Wrangler CLI
2. Feature branches with preview deployments
3. Automated testing with GitHub Actions

### Production
1. Main branch deploys to production
2. Cloudflare Pages for frontend
3. Cloudflare Workers for API
4. Environment variables for secrets
5. Monitoring with Cloudflare Analytics

## 12. Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- API endpoint testing with Vitest
- Utility function testing

### Integration Tests
- Auth flow testing
- File upload testing
- Database operation testing

### E2E Tests
- User journey testing with Playwright
- Cross-browser testing
- Mobile device testing

## 13. Implementation Phases

### Phase 1: Foundation (Week 1)
- Project setup and configuration
- Basic authentication with Discord
- Database schema implementation
- Core API structure

### Phase 2: Core Features (Week 2-3)
- Crusade selection UI
- Fitness tracking forms
- Progress history display
- Basic theme implementation

### Phase 3: Social Features (Week 4)
- X (Twitter) integration
- Photo upload functionality
- Post generation and sharing
- Social preview

### Phase 4: Advanced Features (Week 5)
- Leaderboard implementation
- Meal tracking
- Advanced filtering/sorting
- Performance optimization

### Phase 5: Polish & Deploy (Week 6)
- Final UI polish
- Mobile optimization
- Testing and bug fixes
- Production deployment

## 14. Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- API response time < 200ms
- 99.9% uptime
- Zero critical security vulnerabilities

### User Metrics
- 90% successful auth rate
- 95% successful post rate
- < 1% error rate
- Mobile usage > 60%

### Business Metrics
- User retention > 70%
- Daily active users growth
- Posts per user per week
- Leaderboard engagement rate