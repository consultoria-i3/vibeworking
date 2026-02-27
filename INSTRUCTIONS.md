# Vibe Working — Instructions

Quick instructions to run and use the Vibe Working app.

---

## Run the app (first time)

1. **Supabase** — Create a project at [supabase.com](https://supabase.com) and get your **Project URL** and **anon public** key (Settings → API).
2. **Environment** — In this folder (`vibeworking`), create a `.env` file with:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. **Database** — In Supabase SQL Editor, run the migration:  
   `vibeworking/supabase/migrations/001_initial_schema.sql`
4. **Install and start:**
   ```bash
   npm install
   npx expo start --web
   ```
5. Open the URL in your browser (or use the one shown in the terminal).

---

## Run the app (already set up)

From the **vibeworking** folder:

```bash
npx expo start --web
```

---

## Full setup guide

For step-by-step details, optional auth settings, and troubleshooting, see **[GUIDE-APP-AND-SUPABASE.md](./GUIDE-APP-AND-SUPABASE.md)**.
