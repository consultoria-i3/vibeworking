# Deploy Vibe Working to Vercel

## 1. Connect the repo

In [Vercel](https://vercel.com), import your Git repo. The project will use the `vercel.json` in this folder.

## 2. Set environment variables (required)

In the Vercel project: **Settings → Environment Variables** add:

| Name | Value |
|------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Apply to **Production**, **Preview**, and **Development** so all builds get them.

Without these, the app build will have no Supabase config and the app may not work correctly.

## 3. Build settings

`vercel.json` sets:

- **Install Command:** `npm install`
- **Build Command:** `npx expo export -p web`
- **Output Directory:** `dist`

**Root Directory:** Leave empty (the repo root is the app folder).

## 4. Deploy

Push to your connected branch; Vercel will build and deploy. Or run locally:

```bash
npx expo export -p web
vercel --prod
```

## If the app stays on the loading spinner

1. **Check build logs** – Vercel → your project → **Deployments** → latest → **Building**. Confirm the build runs `npx expo export -p web` and finishes with "Exporting X files" and "App exported to: dist". If the build fails, the deployed site will be broken.
2. **Check the JS bundle request** – Open the live URL → F12 → **Network**. Reload. Find the request to `/_expo/static/js/web/entry-*.js`. It must return **200** and type **javascript**. If it’s 404 or returns HTML, the deploy isn’t serving the built files (fix Root Directory / Output Directory).
3. **Check env vars** – **Settings → Environment Variables**. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` for Production, then **Redeploy**.
