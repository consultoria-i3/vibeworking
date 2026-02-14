# Connect Vibe Working to Supabase

Follow these steps to connect the app to your database.

---

## 1. Create a Supabase project

1. Go to **[supabase.com](https://supabase.com)** and sign in (or create an account).
2. Click **New project**.
3. Pick an organization (or create one), name the project (e.g. `vibeworking`), set a database password, and choose a region. Click **Create new project** and wait for it to finish.

---

## 2. Get your connection values

1. In the Supabase dashboard, open your project.
2. Go to **Project Settings** (gear in the sidebar) → **API**.
3. Copy:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **anon public** key (long string under "Project API keys")

---

## 3. Add the connection in this project

1. In the **vibeworking** folder (same folder as `app/` and `src/`), create a file named **`.env`** (no name before the dot, extension is nothing).
2. Paste this and replace with your real values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Use the **Project URL** and **anon public** key from step 2. Save the file.

---

## 4. Create the database tables

1. In Supabase, go to **SQL Editor**.
2. Click **New query**.
3. Run **001_initial_schema.sql**, then **002_checkin_system.sql**, then **003_seed_checkin_questions.sql** (copy each file’s contents into a new query and **Run**).
5. You should see “Success” and tables like `profiles`, `coaching_categories`, `daily_checkins`, etc. in **Table Editor**.

---

## 5. (Optional) Turn on Email auth

If you use email/password sign up:

1. In Supabase go to **Authentication** → **Providers** → **Email**.
2. Enable **Email** and (if you want) **Confirm email**.
3. Under **Authentication** → **URL Configuration**, add your redirect URL if you use deep links (e.g. for password reset).

For **Google** sign-in, enable the Google provider and add your OAuth client ID/secret.

---

## 6. Run the app

From the **vibeworking** folder:

```bash
npm install
npx expo start
```

The app will read `.env` and connect to Supabase. You can sign up, log in, and use the app against your database.

---

## Summary

| Step | What to do |
|------|------------|
| 1 | Create a Supabase project at supabase.com |
| 2 | Copy **Project URL** and **anon** key from Settings → API |
| 3 | Create **`.env`** in the **vibeworking** folder with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` |
| 4 | Run **001**, **002**, **003** migrations in Supabase SQL Editor (in order) |
| 5 | (Optional) Configure Auth providers (Email, Google) |
| 6 | Run `npm install` and `npx expo start` |

The connection is used in **`src/lib/supabase.ts`**. Never commit `.env` or your anon key to git (`.env` is in `.gitignore`).
