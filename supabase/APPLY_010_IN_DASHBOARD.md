# Apply migration 010_transcript_reports.sql

## Option 1: Supabase Dashboard (recommended)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor**.
3. Copy the contents of `migrations/010_transcript_reports.sql` and paste into a new query.
4. Click **Run**.

## Option 2: Supabase CLI (if project is linked)

From the `vibeworking` folder:

```bash
npx supabase db push
```

Or to run only this migration (after linking):

```bash
npx supabase migration up
```
