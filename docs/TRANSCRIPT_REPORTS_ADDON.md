# Transcript Reports — Google Drive Add-on ↔ Supabase

This doc describes how a **separate** Google Drive Add-on (Apps Script) should integrate with this project’s Supabase backend to save and list transcript report PDFs.

## Supabase schema (this repo)

- **Table:** `transcript_reports`  
  - `id` (UUID), `user_id` (auth.users), `title`, `source_file_names` (text[]), `source_file_count`, `created_at`
- **Storage bucket:** `transcript-reports`  
  - Path: `{user_id}/{report_id}.pdf`  
  - Allowed MIME: `application/pdf`

Run the migration in this repo so the table and bucket exist:

```bash
cd vibeworking && npx supabase db push
# or apply supabase/migrations/010_transcript_reports.sql in the Supabase dashboard
```

## Add-on flows

1. **Analyze one file → one report**  
   Read selected .txt (same pattern as your first Add-on) → send content to your analysis API → receive PDF → save to Supabase (see below).

2. **Analyze multiple files → one report**  
   Read multiple .txts → send combined content to analysis API → receive one PDF → save to Supabase.

3. **Save report in database**  
   - Insert row into `transcript_reports` (title, source_file_names, source_file_count).  
   - Upload PDF to Storage: `transcript-reports/{user_id}/{report_id}.pdf`.

4. **Present all reports in Add-on**  
   - Query `transcript_reports` for current user, order by `created_at DESC`.  
   - For each row, get signed URL for `transcript-reports/{user_id}/{id}.pdf` and show link/card in sidebar.

## Auth (required for RLS)

Row Level Security uses `auth.uid()`. The Add-on must sign the user into Supabase with the same Google account they use in Drive.

- **Option A:** In the Add-on sidebar, “Sign in with Google” using Supabase Auth (e.g. open a dialog to your app’s Supabase OAuth URL, or use a small hosted page that calls `supabase.auth.signInWithOAuth({ provider: 'google' })` and returns the session to the Add-on via `postMessage` or redirect with fragment).
- **Option B:** Backend/Edge Function: Add-on sends Google ID token; Edge Function verifies it, maps to or creates a Supabase user, and performs insert + storage upload with service role. Add-on then lists reports via the same Edge Function. No Supabase client in the Add-on; all DB access server-side.

Use **Option A** if the Add-on can host a sign-in step; use **Option B** if you want all Supabase access behind one backend.

## Add-on → Supabase (Option A)

- In the Add-on: store `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Script Properties). After Google sign-in to Supabase, store `access_token` and `refresh_token` in user properties or a single encrypted cache.
- **Insert report:**  
  - `POST rest/v1/transcript_reports` with `Authorization: Bearer <access_token>`, body `{ title, source_file_names, source_file_count }`.  
  - Upload PDF: `POST storage/v1/object/transcript-reports/{user_id}/{report_id}.pdf` with same token and PDF body.
- **List reports:**  
  - `GET rest/v1/transcript_reports?order=created_at.desc` with same token.  
  - For each report, get a signed URL for the PDF (e.g. `storage/v1/object/sign/transcript-reports/...`) or use a short-lived public URL if you add a policy, and show it in the sidebar.

## Add-on → Backend (Option B)

- Add-on calls your backend (e.g. Edge Function or API) with Google ID token in header.
- Backend verifies token, resolves/creates Supabase user, then:
  - **Save:** accepts PDF bytes + metadata, inserts into `transcript_reports`, uploads PDF to `transcript-reports/{user_id}/{report_id}.pdf` with service role.
  - **List:** returns `transcript_reports` rows + signed URLs for each PDF.

## Analysis API (external)

The Add-on sends .txt content to your analysis service; the service returns the report PDF. Where that service runs (your backend, third-party, or same Edge Function) is up to you. This repo only defines storage and metadata in Supabase.
