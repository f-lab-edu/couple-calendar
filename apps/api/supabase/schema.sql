-- Couple Calendar Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    birthday DATE,
    couple_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Couples Table
CREATE TABLE IF NOT EXISTS couples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    invite_code VARCHAR(6),
    invite_code_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('DATE', 'ANNIVERSARY', 'TRAVEL', 'MEAL', 'OTHER')),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for users.couple_id
ALTER TABLE users
ADD CONSTRAINT fk_users_couple
FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_couple_id ON users(couple_id);
CREATE INDEX IF NOT EXISTS idx_couples_user1_id ON couples(user1_id);
CREATE INDEX IF NOT EXISTS idx_couples_user2_id ON couples(user2_id);
CREATE INDEX IF NOT EXISTS idx_couples_invite_code ON couples(invite_code);
CREATE INDEX IF NOT EXISTS idx_events_couple_id ON events(couple_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_author_id ON events(author_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Couples policies
CREATE POLICY "Users can view their own couple"
    ON couples FOR SELECT
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create couples"
    ON couples FOR INSERT
    WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "Users can update their own couple"
    ON couples FOR UPDATE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Events policies
CREATE POLICY "Users can view events from their couple"
    ON events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = events.couple_id
            AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can create events for their couple"
    ON events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = events.couple_id
            AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
        )
        AND auth.uid() = author_id
    );

CREATE POLICY "Users can update events from their couple"
    ON events FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = events.couple_id
            AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can delete events from their couple"
    ON events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = events.couple_id
            AND (couples.user1_id = auth.uid() OR couples.user2_id = auth.uid())
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_couples_updated_at
    BEFORE UPDATE ON couples
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
