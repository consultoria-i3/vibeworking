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

`vercel.json` already sets:

- **Build Command:** `npx expo export -p web`
- **Output Directory:** `dist`
- **Rewrites:** SPA fallback so routes like `/(auth)/login` serve `index.html`

No need to change these unless you use a different structure.

## 4. Deploy

Push to your connected branch; Vercel will build and deploy. Or run locally:

```bash
npx expo export -p web
vercel --prod
```

## If the app stays on the loading spinner

1. **Check env vars** – In Vercel → Project → Settings → Environment Variables, confirm both `EXPO_PUBLIC_*` variables are set and redeploy.
2. **Check build logs** – In the Vercel deployment, open the build log and confirm the build finishes and outputs to `dist`.
3. **Check browser console** – Open DevTools → Console/Network on the live URL. If you see 404s for `.js` files, the output directory or paths may be wrong.
