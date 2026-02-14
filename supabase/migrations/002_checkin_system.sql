-- ============================================================================
-- Vibe Working — Check-in System Migration
-- Supabase (Postgres) · 002_checkin_system.sql
-- Covers: ANAI-57 — 6 check-ins/day, detail text, session model
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Allow 6 check-ins per user per day (remove one-per-day constraint)
-- ---------------------------------------------------------------------------
ALTER TABLE daily_checkins DROP CONSTRAINT IF EXISTS daily_checkins_user_id_checkin_date_key;

-- Add index for counting today's check-ins
CREATE INDEX IF NOT EXISTS idx_checkins_user_date_hour
  ON daily_checkins(user_id, checkin_date, created_at DESC);

-- ---------------------------------------------------------------------------
-- 2. Add detail_text to checkin_answers (ANAI-52 — "Let me know the details")
-- ---------------------------------------------------------------------------
ALTER TABLE checkin_answers
  ADD COLUMN IF NOT EXISTS detail_text TEXT;

-- Note: Streak trigger from 001 already handles multiple same-day check-ins
-- (only updates when last_checkin_date < today, so 2nd+ insert of day does nothing)
