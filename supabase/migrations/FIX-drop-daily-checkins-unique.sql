-- ============================================================================
-- One-off fix: remove unique constraint so multiple check-ins per user per day
-- Run this in Supabase SQL Editor if you see:
--   duplicate key value violates unique constraint "daily_checkins_user_id_checkin_date_key"
-- ============================================================================

ALTER TABLE daily_checkins DROP CONSTRAINT IF EXISTS daily_checkins_user_id_checkin_date_key;

-- Optional: add index for counting today's check-ins (from 002)
CREATE INDEX IF NOT EXISTS idx_checkins_user_date_hour
  ON daily_checkins(user_id, checkin_date, created_at DESC);
