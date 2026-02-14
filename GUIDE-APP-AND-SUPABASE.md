# Guide: Make the App Show & Connect Supabase

Follow these steps in order. When done, the app will open in the browser and use your Supabase database.

---

## Step 1: Create a Supabase project (if you don’t have one)

1. Go to **[supabase.com](https://supabase.com)** and sign in (or create an account).
2. Click **New project**.
3. Choose an organization (or create one).
4. Set:
   - **Name:** e.g. `vibeworking`
   - **Database password:** choose a strong password and **save it**.
   - **Region:** pick one close to you.
5. Click **Create new project** and wait until it’s ready (green status).

---

## Step 2: Get your project URL and anon key

1. In the Supabase dashboard, open your project.
2. Click the **gear icon** (Project Settings) in the left sidebar.
3. Open the **API** section.
4. Copy and keep these somewhere safe:
   - **Project URL**  
     Example: `https://abcdefghijk.supabase.co`
   - **anon public** key (under “Project API keys”)  
     Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

---

## Step 3: Put the `.env` file in the right place

The `.env` file **must** be in the **vibeworking** folder (same folder as `app/`, `src/`, and `package.json`).

**Path:**  
`vibeworking-supabase\vibeworking\.env`

1. Open the **vibeworking** folder in File Explorer.
2. Create a new file named exactly: **`.env`** (no name before the dot, no `.txt`).
3. Paste this and **replace** with your real values from Step 2:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Save the file.
5. Check:
   - Variable names are **exactly** `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
   - No quotes around the values (unless your key has spaces, which is rare).
   - No extra spaces before or after `=`.

---

## Step 4: Create the database tables in Supabase

1. In Supabase, go to **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open this file on your computer:  
   `vibeworking\supabase\migrations\001_initial_schema.sql`
4. Select all (Ctrl+A), copy, and paste into the Supabase SQL Editor.
5. Click **Run** (or press Ctrl+Enter).
6. You should see **Success**.
7. In the left sidebar, open **Table Editor** and confirm you see tables like:  
   `profiles`, `coaching_categories`, `daily_checkins`, etc.

---

## Step 5: (Optional) Allow sign-ups in Supabase

1. In Supabase, go to **Authentication** → **Providers**.
2. Under **Email**, ensure **Email** is enabled.
3. If you want to test without confirming email:  
   Under **Email**, turn **OFF** “Confirm email” (you can turn it back on later).

---

## Step 6: Install dependencies and start the app

1. Open a terminal (PowerShell or Command Prompt).
2. Go to the **vibeworking** folder:

   ```bash
   cd c:\Users\MaxCarrillo\Downloads\vibeworking-supabase\vibeworking
   ```

3. Install dependencies (only needed once, or after pulling changes):

   ```bash
   npm install
   ```

4. Start the app and open it in the browser:

   ```bash
   npx expo start --web
   ```

5. Wait for the browser to open (or open the URL shown in the terminal).

---

## What you should see

| Step | What you see |
|------|----------------|
| Right after “Starting…” | Dark screen, purple spinner, “Vibe Working” text. |
| After a few seconds | **Login** screen: “Vibe Working”, email/password, “Continue with Google”, “Sign Up”. |
| If `.env` is missing/wrong | **“Setup required”** screen with instructions to add `.env`. |
| After sign up / sign in | **Home** screen: “Hey [name] 👋”, Daily Check-In and Coaching cards, bottom tabs. |

---

## Quick checklist

- [ ] Supabase project created and ready.
- [ ] **Project URL** and **anon public** key copied from **Settings → API**.
- [ ] **`.env`** file is in the **vibeworking** folder (next to `app/` and `src/`).
- [ ] **`.env`** contains `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (no typos).
- [ ] **SQL migration** run in Supabase (SQL Editor → paste `001_initial_schema.sql` → Run).
- [ ] **`npm install`** run in the **vibeworking** folder.
- [ ] **`npx expo start --web`** run; browser opens and shows login or “Setup required” (not a blank page).

---

## If the app doesn’t show or shows “Setup required”

1. **Confirm `.env` location**  
   Path must be:  
   `vibeworking-supabase\vibeworking\.env`  
   Not in `vibeworking-supabase` only, and not in `app/` or `src/`.

2. **Restart the app**  
   Stop the dev server (Ctrl+C), then run again:
   ```bash
   npx expo start --web
   ```
   Expo reads `.env` when it starts; changing `.env` requires a restart.

3. **Check the values**  
   In `.env`, open the Supabase dashboard **Settings → API** and compare:
   - **Project URL** matches `EXPO_PUBLIC_SUPABASE_URL`.
   - **anon public** key matches `EXPO_PUBLIC_SUPABASE_ANON_KEY` (full string, no spaces).

4. **Browser console**  
   If the screen is blank or wrong, press **F12** → **Console**. Note any red errors and use them to fix the issue (or share them for help).

---

## If sign up or login fails

- In Supabase: **Authentication** → **Users** (and **Table Editor** → **profiles**).
- Check **Authentication** → **Providers** (Email enabled; “Confirm email” off for testing if you want).
- In the app, read any error message shown under the form.

When all checklist items are done and the app shows the login (or home) screen, the app is showing correctly and Supabase is set up for Vibe Working.
