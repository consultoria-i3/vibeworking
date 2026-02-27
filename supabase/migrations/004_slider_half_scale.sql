-- ============================================================================
-- Vibe Working — Slider 1–5 in 0.5 steps
-- Store in DB as 2–10 (value * 2): 1→2, 1.5→3, 2→4, …, 5→10
-- ============================================================================

-- 1. Drop old check so we can change values
ALTER TABLE checkin_answers DROP CONSTRAINT IF EXISTS checkin_answers_value_check;

-- 2. Convert existing 1–5 to 2–10
UPDATE checkin_answers SET value = value * 2 WHERE value BETWEEN 1 AND 5;

-- 3. Enforce new range
ALTER TABLE checkin_answers ADD CONSTRAINT checkin_answers_value_check
  CHECK (value >= 2 AND value <= 10);
