# Vercel checklist – fix spinning / blank page

Do this in **Vercel** → your project → **Settings** → **General**:

| Setting | Value |
|--------|--------|
| **Framework Preset** | **Other** (do not use Next.js, Create React App, etc.) |
| **Build Command** | `npx expo export -p web` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` (or leave default) |
| **Root Directory** | Leave **empty** |

Then:

1. **Save**.
2. **Deployments** → **⋯** on latest → **Redeploy** (or push a new commit).

If **Framework Preset** was something other than **Other**, Vercel may have been using a different build and ignoring `vercel.json`, which causes the app to stay on the spinner.
