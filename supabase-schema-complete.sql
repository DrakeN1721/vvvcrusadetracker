-- Supabase Schema for vVv Crusade Tracker
-- Complete schema including crusades tables

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

-- Crusades table
CREATE TABLE public.crusades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User crusades enrollment table
CREATE TABLE public.user_crusades (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    crusade_id UUID REFERENCES public.crusades(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, crusade_id)
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
    crusade_id UUID REFERENCES public.crusades(id) ON DELETE SET NULL,
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

-- Meal types enum
CREATE TYPE meal_type AS ENUM (
    'breakfast',
    'lunch',
    'dinner',
    'snack',
    'pre_workout',
    'post_workout'
);

-- Meal progress table (optional - for nutrition tracking)
CREATE TABLE public.meal_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    crusade_id UUID REFERENCES public.crusades(id) ON DELETE SET NULL,
    meal_type meal_type NOT NULL,
    description TEXT,
    calories INTEGER,
    protein_g DECIMAL(6,2),
    carbs_g DECIMAL(6,2),
    fat_g DECIMAL(6,2),
    photo_urls TEXT[],
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

-- Crusade leaderboard function
CREATE OR REPLACE FUNCTION public.get_crusade_leaderboard(
    p_crusade_id UUID,
    p_period TEXT DEFAULT 'all'
)
RETURNS TABLE (
    user_id UUID,
    discord_username TEXT,
    discord_avatar TEXT,
    x_username TEXT,
    total_workouts BIGINT,
    workout_days BIGINT,
    exercise_variety BIGINT,
    last_workout TIMESTAMP WITH TIME ZONE,
    total_reps BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as user_id,
        p.discord_username,
        p.discord_avatar,
        p.x_username,
        COUNT(DISTINCT ep.id) as total_workouts,
        COUNT(DISTINCT DATE(ep.created_at)) as workout_days,
        COUNT(DISTINCT ep.exercise_type) as exercise_variety,
        MAX(ep.created_at) as last_workout,
        SUM(ep.current_reps * COALESCE(ep.sets, 1))::BIGINT as total_reps
    FROM 
        public.profiles p
    INNER JOIN 
        public.user_crusades uc ON p.id = uc.user_id
    LEFT JOIN 
        public.exercise_progress ep ON p.id = ep.user_id AND ep.crusade_id = p_crusade_id
    WHERE 
        uc.crusade_id = p_crusade_id
        AND (
            p_period = 'all' OR
            (p_period = 'daily' AND DATE(ep.created_at) = CURRENT_DATE) OR
            (p_period = 'weekly' AND ep.created_at >= date_trunc('week', CURRENT_DATE)) OR
            (p_period = 'monthly' AND ep.created_at >= date_trunc('month', CURRENT_DATE))
        )
    GROUP BY 
        p.id, p.discord_username, p.discord_avatar, p.x_username
    ORDER BY 
        total_reps DESC;
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX idx_exercise_progress_user_id ON public.exercise_progress(user_id);
CREATE INDEX idx_exercise_progress_created_at ON public.exercise_progress(created_at DESC);
CREATE INDEX idx_exercise_progress_exercise_type ON public.exercise_progress(exercise_type);
CREATE INDEX idx_exercise_progress_crusade_id ON public.exercise_progress(crusade_id);
CREATE INDEX idx_user_crusades_user_id ON public.user_crusades(user_id);
CREATE INDEX idx_user_crusades_crusade_id ON public.user_crusades(crusade_id);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crusades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_crusades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Crusades policies
CREATE POLICY "Crusades are viewable by everyone" 
    ON public.crusades FOR SELECT 
    USING (true);

CREATE POLICY "Only admins can create crusades" 
    ON public.crusades FOR INSERT 
    WITH CHECK (false); -- Will need to update this with admin role check

CREATE POLICY "Only admins can update crusades" 
    ON public.crusades FOR UPDATE 
    USING (false); -- Will need to update this with admin role check

-- User crusades policies
CREATE POLICY "User crusades are viewable by everyone" 
    ON public.user_crusades FOR SELECT 
    USING (true);

CREATE POLICY "Users can enroll themselves in crusades" 
    ON public.user_crusades FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unenroll themselves from crusades" 
    ON public.user_crusades FOR DELETE 
    USING (auth.uid() = user_id);

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

-- Meal progress policies
CREATE POLICY "Meal progress is viewable by everyone" 
    ON public.meal_progress FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert own meal progress" 
    ON public.meal_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal progress" 
    ON public.meal_progress FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal progress" 
    ON public.meal_progress FOR DELETE 
    USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, discord_id, discord_username, discord_avatar)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'provider_id', new.id::text),
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
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

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_crusades_updated_at
    BEFORE UPDATE ON public.crusades
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- Storage policies
CREATE POLICY "Anyone can view photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own photos"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Sample crusades for development (remove in production)
-- INSERT INTO public.crusades (name, description, start_date, end_date, is_active)
-- VALUES 
--     ('Summer Shred 2024', 'Get shredded for summer! Focus on strength and conditioning.', '2024-06-01', '2024-08-31', true),
--     ('New Year Power 2024', 'Start the year strong with power lifting focus.', '2024-01-01', '2024-03-31', false),
--     ('Fall Fitness Challenge', 'Build strength and endurance before the holidays.', '2024-09-01', '2024-11-30', true);