-- Users table
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS crusades (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('fitness', 'meal', 'daily')),
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User crusade enrollments
CREATE TABLE IF NOT EXISTS user_crusades (
    user_id TEXT NOT NULL,
    crusade_id TEXT NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, crusade_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (crusade_id) REFERENCES crusades(id)
);

-- Fitness progress entries
CREATE TABLE IF NOT EXISTS fitness_progress (
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
CREATE TABLE IF NOT EXISTS meal_progress (
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
CREATE TABLE IF NOT EXISTS leaderboard_cache (
    crusade_id TEXT NOT NULL,
    period TEXT NOT NULL CHECK(period IN ('daily', 'weekly', 'monthly', 'all_time')),
    data TEXT NOT NULL, -- JSON data
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (crusade_id, period)
);

-- Indexes for performance
CREATE INDEX idx_fitness_progress_user_id ON fitness_progress(user_id);
CREATE INDEX idx_fitness_progress_crusade_id ON fitness_progress(crusade_id);
CREATE INDEX idx_fitness_progress_created_at ON fitness_progress(created_at);
CREATE INDEX idx_meal_progress_user_id ON meal_progress(user_id);
CREATE INDEX idx_meal_progress_crusade_id ON meal_progress(crusade_id);
CREATE INDEX idx_meal_progress_created_at ON meal_progress(created_at);
CREATE INDEX idx_user_crusades_user_id ON user_crusades(user_id);
CREATE INDEX idx_user_crusades_crusade_id ON user_crusades(crusade_id);