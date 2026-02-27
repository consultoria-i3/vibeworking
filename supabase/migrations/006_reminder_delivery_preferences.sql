-- ============================================================================
-- Vibe Working — Reminder delivery preferences (SMS / WhatsApp consent)
-- ============================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS reminder_via   TEXT,  -- 'sms' | 'whatsapp' | null = in-app only
  ADD COLUMN IF NOT EXISTS reminder_phone TEXT;
