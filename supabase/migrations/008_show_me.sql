-- ============================================================================
-- Vibe Working — Show me (image → text → tip)
-- Tables: recommendation_guidelines, show_me_entries; storage bucket show-me
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Recommendation guidelines (keywords → tip text)
-- ---------------------------------------------------------------------------
CREATE TABLE recommendation_guidelines (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label       TEXT NOT NULL,
  keywords    TEXT[] NOT NULL DEFAULT '{}',
  tip_text    TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recommendation_guidelines_order ON recommendation_guidelines(sort_order);

-- RLS
ALTER TABLE recommendation_guidelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recommendation_guidelines_read" ON recommendation_guidelines
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "recommendation_guidelines_read_anon" ON recommendation_guidelines
  FOR SELECT TO anon USING (true);

-- ---------------------------------------------------------------------------
-- 2. Show me entries (user photo + transcription + tip)
-- ---------------------------------------------------------------------------
CREATE TABLE show_me_entries (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_path        TEXT,
  transcribed_text  TEXT NOT NULL DEFAULT '',
  tip_text          TEXT NOT NULL DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_show_me_entries_user ON show_me_entries(user_id);
CREATE INDEX idx_show_me_entries_created ON show_me_entries(created_at DESC);

-- RLS
ALTER TABLE show_me_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "show_me_entries_insert_own" ON show_me_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "show_me_entries_select_own" ON show_me_entries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "show_me_entries_delete_own" ON show_me_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. Seed recommendation guidelines (keywords → tip)
-- ---------------------------------------------------------------------------
INSERT INTO recommendation_guidelines (label, keywords, tip_text, sort_order) VALUES
  ('Meeting / agenda',
   ARRAY['meeting', 'agenda', 'schedule', 'calendar', 'invite'],
   'Send a short agenda 24h before. One line per topic. Ask: "What do you want to get out of this?" so everyone comes prepared.',
   10),
  ('Email / follow-up',
   ARRAY['email', 'follow-up', 'follow up', 'reply', 'inbox'],
   'Reply within 24h even if just "Got it — will get back by [date]." It builds trust and reduces follow-up emails.',
   20),
  ('Feedback / difficult conversation',
   ARRAY['feedback', 'difficult', 'conversation', 'conflict', 'criticism', 'complaint'],
   'Use "I noticed…" and "I felt…" instead of "You always…". Offer one specific example and one ask: "Next time, could you…?"',
   30),
  ('Delegate / ask for help',
   ARRAY['delegate', 'help', 'ask', 'request', 'favor'],
   'Be specific: "Can you [concrete task] by [date]?" and say how you’ll use it. Thank them by name when it’s done.',
   40),
  ('Networking / relationship',
   ARRAY['network', 'relationship', 'connect', 'introduction', 'coffee'],
   'After meeting someone, send one sentence on what you’ll do next (e.g. intro, share a link). Do it within 48 hours.',
   50),
  ('Priority / time',
   ARRAY['priority', 'time', 'busy', 'overwhelm', 'deadline'],
   'Write the one thing that must get done today. Do it first. Say no to one thing that doesn’t match your goals.',
   60),
  ('Default',
   ARRAY[]::TEXT[],
   'Read it once. Pick one small action you can do in the next 24 hours. Write it down or tell someone to lock it in.',
   999);

-- ---------------------------------------------------------------------------
-- 4. Storage bucket for Show me images
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'show-me',
  'show-me',
  FALSE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "show_me_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'show-me' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "show_me_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'show-me' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "show_me_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'show-me' AND (storage.foldername(name))[1] = auth.uid()::text);
