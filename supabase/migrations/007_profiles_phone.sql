-- ============================================================================
-- Vibe Working — Phone number for each user (profiles)
-- ============================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone TEXT;
