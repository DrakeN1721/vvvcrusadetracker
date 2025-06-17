-- Supabase Schema for vVv Crusade Tracker

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    discord_id TEXT UNIQUE NOT NULL,
    discord_username TEXT NOT NULL,
    discord_avatar TEXT,
    x_username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Exercises enum
CREATE TYPE exercise_type AS ENUM (
    'bench_press',
    'deadlift', 
    'squat',
    'overhead_press',
    'pushups',
    'pullups'
);

-- Exercise progress table
CREATE TABLE public.exercise_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    exercise_type exercise_type NOT NULL,
    previous_weight_kg DECIMAL(6,2),
    previous_weight_lbs DECIMAL(6,2),
    previous_reps INTEGER,
    current_weight_kg DECIMAL(6,2),
    current_weight_lbs DECIMAL(6,2),
    current_reps INTEGER NOT NULL,
    sets INTEGER DEFAULT 1,
    notes TEXT,
    photo_urls TEXT[], -- Array of photo URLs
    x_post_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User stats view (for leaderboard data)
CREATE VIEW public.user_stats AS
SELECT 
    p.id as user_id,
    p.discord_username,
    p.discord_avatar,
    p.x_username,
    COUNT(DISTINCT ep.id) as total_workouts,
    COUNT(DISTINCT DATE(ep.created_at)) as workout_days,
    COUNT(DISTINCT ep.exercise_type) as exercise_variety,
    MAX(ep.created_at) as last_workout,
    SUM(ep.current_reps * COALESCE(ep.sets, 1)) as total_reps
FROM 
    public.profiles p
LEFT JOIN 
    public.exercise_progress ep ON p.id = ep.user_id
GROUP BY 
    p.id, p.discord_username, p.discord_avatar, p.x_username;

-- Indexes for performance
CREATE INDEX idx_exercise_progress_user_id ON public.exercise_progress(user_id);
CREATE INDEX idx_exercise_progress_created_at ON public.exercise_progress(created_at DESC);
CREATE INDEX idx_exercise_progress_exercise_type ON public.exercise_progress(exercise_type);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Exercise progress policies
CREATE POLICY "Exercise progress is viewable by everyone" 
    ON public.exercise_progress FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert own exercise progress" 
    ON public.exercise_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise progress" 
    ON public.exercise_progress FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise progress" 
    ON public.exercise_progress FOR DELETE 
    USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, discord_id, discord_username, discord_avatar)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'discord_id',
        new.raw_user_meta_data->>'discord_username',
        new.raw_user_meta_data->>'discord_avatar'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Sample data for development (remove in production)
-- INSERT INTO public.profiles (id, discord_id, discord_username, discord_avatar, x_username)
-- VALUES 
--     ('123e4567-e89b-12d3-a456-426614174000', '123456789', 'FitnessKing', null, 'fitnessking'),
--     ('223e4567-e89b-12d3-a456-426614174000', '223456789', 'IronWarrior', null, 'ironwarrior'),
--     ('323e4567-e89b-12d3-a456-426614174000', '323456789', 'GymRat', null, null);