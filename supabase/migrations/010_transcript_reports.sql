-- ============================================================================
-- Transcript reports (Drive Add-on)
-- Table: transcript_reports (metadata); Storage: transcript-reports (PDFs)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. transcript_reports — metadata for each saved PDF report
-- ---------------------------------------------------------------------------
CREATE TABLE transcript_reports (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title             TEXT NOT NULL DEFAULT 'Transcript report',
  source_file_names TEXT[] NOT NULL DEFAULT '{}',
  source_file_count INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transcript_reports_user ON transcript_reports(user_id);
CREATE INDEX idx_transcript_reports_created ON transcript_reports(created_at DESC);

-- RLS
ALTER TABLE transcript_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transcript_reports_select_own" ON transcript_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "transcript_reports_insert_own" ON transcript_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transcript_reports_delete_own" ON transcript_reports
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 2. Storage bucket for report PDFs
-- Path: {user_id}/{report_id}.pdf
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'transcript-reports',
  'transcript-reports',
  FALSE,
  52428800,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "transcript_reports_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'transcript-reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "transcript_reports_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'transcript-reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "transcript_reports_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'transcript-reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
