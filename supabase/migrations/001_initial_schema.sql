-- ============================================================================
-- Vibe Working — Initial Schema Migration
-- Supabase (Postgres) · 001_initial_schema.sql
-- Covers: ANAI-33, ANAI-34, ANAI-39, ANAI-40, ANAI-41
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Custom Enums
-- ---------------------------------------------------------------------------
CREATE TYPE graduation_type AS ENUM ('high_school', 'college');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');
CREATE TYPE vote_type AS ENUM ('up', 'down');

-- ---------------------------------------------------------------------------
-- 2. profiles — extends Supabase auth.users
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  graduation_type graduation_type,
  job_title     TEXT,
  industry      TEXT,
  avatar_url    TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_tier    subscription_tier NOT NULL DEFAULT 'free',
  streak_count         INT NOT NULL DEFAULT 0,
  last_checkin_date    DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at auto-touch
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Coaching Content (categories → sections → items)
-- ---------------------------------------------------------------------------
CREATE TABLE coaching_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  emoji       TEXT,
  color       TEXT,          -- hex color
  tagline     TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  version     INT NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE coaching_sections (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id   UUID NOT NULL REFERENCES coaching_categories(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  icon          TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  version       INT NOT NULL DEFAULT 1,
  archived_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE coaching_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id    UUID NOT NULL REFERENCES coaching_sections(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  version       INT NOT NULL DEFAULT 1,
  archived_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for content tree traversal
CREATE INDEX idx_sections_category ON coaching_sections(category_id, sort_order);
CREATE INDEX idx_items_section ON coaching_items(section_id, sort_order);

-- ---------------------------------------------------------------------------
-- 4. Checkin Questions & Tips (HDYD)
-- ---------------------------------------------------------------------------
CREATE TABLE checkin_questions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question    TEXT NOT NULL,
  emoji       TEXT,
  category    TEXT,
  cat_color   TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  archived_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE checkin_question_tips (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id   UUID NOT NULL REFERENCES checkin_questions(id) ON DELETE CASCADE,
  max_value     INT NOT NULL,          -- threshold: score <= max_value
  label         TEXT NOT NULL,
  color         TEXT,
  text          TEXT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_tips_question ON checkin_question_tips(question_id, sort_order);

-- ---------------------------------------------------------------------------
-- 5. Behavior Sliders (First Principles)
-- ---------------------------------------------------------------------------
CREATE TABLE behavior_sliders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug   TEXT NOT NULL,       -- matches coaching_categories.slug
  title           TEXT NOT NULL,
  emoji           TEXT,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE behavior_slider_recs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slider_id     UUID NOT NULL REFERENCES behavior_sliders(id) ON DELETE CASCADE,
  max_value     INT NOT NULL,
  label         TEXT NOT NULL,
  color         TEXT,
  text          TEXT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_slider_recs ON behavior_slider_recs(slider_id, sort_order);

-- ---------------------------------------------------------------------------
-- 6. Daily Check-ins
-- ---------------------------------------------------------------------------
CREATE TABLE daily_checkins (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  overall_score NUMERIC(4,2),          -- computed avg
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, checkin_date)
);

CREATE TABLE checkin_answers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checkin_id    UUID NOT NULL REFERENCES daily_checkins(id) ON DELETE CASCADE,
  question_id   UUID NOT NULL REFERENCES checkin_questions(id),
  value         INT NOT NULL CHECK (value BETWEEN 1 AND 5),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);
CREATE INDEX idx_answers_checkin ON checkin_answers(checkin_id);

-- ---------------------------------------------------------------------------
-- 7. Saved Items ("It Worked!" collection)
-- ---------------------------------------------------------------------------
CREATE TABLE saved_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES coaching_items(id) ON DELETE CASCADE,
  note          TEXT,
  saved_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

CREATE INDEX idx_saved_user ON saved_items(user_id, saved_at DESC);

-- ---------------------------------------------------------------------------
-- 8. Contacts (Classmates book)
-- ---------------------------------------------------------------------------
CREATE TABLE contacts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  relationship  TEXT,
  photo_url     TEXT,
  notes         TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE daily_contact_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id    UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  log_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  connected     BOOLEAN NOT NULL DEFAULT TRUE,
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, contact_id, log_date)
);

CREATE INDEX idx_contacts_user ON contacts(user_id, sort_order);
CREATE INDEX idx_contact_logs_date ON daily_contact_logs(user_id, log_date DESC);

-- ---------------------------------------------------------------------------
-- 9. Boss Mood (Energy Check-in)
-- ---------------------------------------------------------------------------
CREATE TABLE boss_mood_entries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  overall_insight TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE boss_mood_scales (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id      UUID NOT NULL REFERENCES boss_mood_entries(id) ON DELETE CASCADE,
  scale_name    TEXT NOT NULL,        -- hostile_friendly, controlling_empowering, etc.
  value         INT NOT NULL CHECK (value BETWEEN 1 AND 100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mood_user ON boss_mood_entries(user_id, created_at DESC);
CREATE INDEX idx_mood_scales ON boss_mood_scales(entry_id);

-- ---------------------------------------------------------------------------
-- 10. User Item Notes & Photos
-- ---------------------------------------------------------------------------
CREATE TABLE user_item_notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_ref      TEXT NOT NULL,         -- coaching_item UUID or section slug
  note_text     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_ref)
);

CREATE TABLE user_item_photos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id       UUID NOT NULL REFERENCES user_item_notes(id) ON DELETE CASCADE,
  photo_url     TEXT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON user_item_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_notes_user_item ON user_item_notes(user_id, item_ref);
CREATE INDEX idx_photos_note ON user_item_photos(note_id, sort_order);

-- ---------------------------------------------------------------------------
-- 11. Anonymous Questions (Ask All of Us)
-- ---------------------------------------------------------------------------
CREATE TABLE anonymous_questions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  vote_count    INT NOT NULL DEFAULT 0,
  answer_count  INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE anonymous_answers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id   UUID NOT NULL REFERENCES anonymous_questions(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answer_text   TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE question_votes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id   UUID NOT NULL REFERENCES anonymous_questions(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote          vote_type NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(question_id, user_id)
);

CREATE INDEX idx_questions_active ON anonymous_questions(is_active, created_at DESC);
CREATE INDEX idx_answers_question ON anonymous_answers(question_id, created_at DESC);
CREATE INDEX idx_votes_question ON question_votes(question_id);

-- Trigger to update vote_count
CREATE OR REPLACE FUNCTION update_question_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE anonymous_questions
    SET vote_count = (
      SELECT COALESCE(SUM(CASE WHEN vote = 'up' THEN 1 ELSE -1 END), 0)
      FROM question_votes WHERE question_id = NEW.question_id
    )
    WHERE id = NEW.question_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE anonymous_questions
    SET vote_count = (
      SELECT COALESCE(SUM(CASE WHEN vote = 'up' THEN 1 ELSE -1 END), 0)
      FROM question_votes WHERE question_id = OLD.question_id
    )
    WHERE id = OLD.question_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON question_votes
  FOR EACH ROW EXECUTE FUNCTION update_question_vote_count();

-- Trigger to update answer_count
CREATE OR REPLACE FUNCTION update_question_answer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE anonymous_questions
    SET answer_count = answer_count + 1
    WHERE id = NEW.question_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE anonymous_questions
    SET answer_count = answer_count - 1
    WHERE id = OLD.question_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_answer_change
  AFTER INSERT OR DELETE ON anonymous_answers
  FOR EACH ROW EXECUTE FUNCTION update_question_answer_count();

-- ---------------------------------------------------------------------------
-- 12. Subscriptions (Stripe)
-- ---------------------------------------------------------------------------
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id    TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status                subscription_status NOT NULL DEFAULT 'incomplete',
  price_id              TEXT,
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_sub_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_sub_stripe_sub ON subscriptions(stripe_subscription_id);

-- Sync subscription_tier on profiles when subscription changes
CREATE OR REPLACE FUNCTION sync_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET subscription_tier = CASE
    WHEN NEW.status IN ('active', 'trialing') THEN 'pro'
    ELSE 'free'
  END
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_subscription_tier();

-- ---------------------------------------------------------------------------
-- 13. Streak Calculation Helper
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  current_streak INT;
BEGIN
  SELECT last_checkin_date, streak_count INTO last_date, current_streak
  FROM profiles WHERE id = NEW.user_id;

  IF last_date IS NULL OR NEW.checkin_date > last_date THEN
    IF last_date = NEW.checkin_date - INTERVAL '1 day' THEN
      -- Consecutive day
      UPDATE profiles
      SET streak_count = current_streak + 1,
          last_checkin_date = NEW.checkin_date
      WHERE id = NEW.user_id;
    ELSE
      -- Streak broken or first checkin
      UPDATE profiles
      SET streak_count = 1,
          last_checkin_date = NEW.checkin_date
      WHERE id = NEW.user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_checkin_streak
  AFTER INSERT ON daily_checkins
  FOR EACH ROW EXECUTE FUNCTION update_user_streak();

-- ============================================================================
-- 14. Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_question_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_slider_recs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_contact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_mood_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_item_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_item_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: own row only
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Coaching content: public read (authenticated), no user writes
CREATE POLICY "coaching_categories_read" ON coaching_categories
  FOR SELECT TO authenticated USING (archived_at IS NULL);
CREATE POLICY "coaching_sections_read" ON coaching_sections
  FOR SELECT TO authenticated USING (archived_at IS NULL);
CREATE POLICY "coaching_items_read" ON coaching_items
  FOR SELECT TO authenticated USING (archived_at IS NULL);
CREATE POLICY "checkin_questions_read" ON checkin_questions
  FOR SELECT TO authenticated USING (archived_at IS NULL);
CREATE POLICY "checkin_question_tips_read" ON checkin_question_tips
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "behavior_sliders_read" ON behavior_sliders
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "behavior_slider_recs_read" ON behavior_slider_recs
  FOR SELECT TO authenticated USING (TRUE);

-- Daily check-ins: own data only
CREATE POLICY "checkins_select_own" ON daily_checkins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "checkins_insert_own" ON daily_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "checkins_update_own" ON daily_checkins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "answers_select_own" ON checkin_answers
  FOR SELECT USING (
    checkin_id IN (SELECT id FROM daily_checkins WHERE user_id = auth.uid())
  );
CREATE POLICY "answers_insert_own" ON checkin_answers
  FOR INSERT WITH CHECK (
    checkin_id IN (SELECT id FROM daily_checkins WHERE user_id = auth.uid())
  );

-- Saved items: own data
CREATE POLICY "saved_select_own" ON saved_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert_own" ON saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete_own" ON saved_items
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "saved_update_own" ON saved_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Contacts: own data
CREATE POLICY "contacts_select_own" ON contacts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contacts_insert_own" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contacts_update_own" ON contacts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contacts_delete_own" ON contacts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "contact_logs_select_own" ON daily_contact_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contact_logs_insert_own" ON daily_contact_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Boss mood: own data
CREATE POLICY "mood_select_own" ON boss_mood_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "mood_insert_own" ON boss_mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mood_scales_select_own" ON boss_mood_scales
  FOR SELECT USING (
    entry_id IN (SELECT id FROM boss_mood_entries WHERE user_id = auth.uid())
  );
CREATE POLICY "mood_scales_insert_own" ON boss_mood_scales
  FOR INSERT WITH CHECK (
    entry_id IN (SELECT id FROM boss_mood_entries WHERE user_id = auth.uid())
  );

-- User item notes & photos: own data
CREATE POLICY "notes_select_own" ON user_item_notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert_own" ON user_item_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update_own" ON user_item_notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete_own" ON user_item_notes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "photos_select_own" ON user_item_photos
  FOR SELECT USING (
    note_id IN (SELECT id FROM user_item_notes WHERE user_id = auth.uid())
  );
CREATE POLICY "photos_insert_own" ON user_item_photos
  FOR INSERT WITH CHECK (
    note_id IN (SELECT id FROM user_item_notes WHERE user_id = auth.uid())
  );
CREATE POLICY "photos_delete_own" ON user_item_photos
  FOR DELETE USING (
    note_id IN (SELECT id FROM user_item_notes WHERE user_id = auth.uid())
  );

-- Anonymous questions: all authenticated can read, own can write
CREATE POLICY "questions_select_all" ON anonymous_questions
  FOR SELECT TO authenticated USING (is_active = TRUE);
CREATE POLICY "questions_insert_own" ON anonymous_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "answers_select_all" ON anonymous_answers
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "answers_insert_own" ON anonymous_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes_select_all" ON question_votes
  FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "votes_insert_own" ON question_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_update_own" ON question_votes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "votes_delete_own" ON question_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions: own data, service_role for Stripe webhook writes
CREATE POLICY "sub_select_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- 15. Storage Bucket for Photos
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'item-photos',
  'item-photos',
  FALSE,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can CRUD their own folder
CREATE POLICY "photos_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "photos_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "photos_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
