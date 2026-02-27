# Deploy & production

- **Production URL:** https://www.outpl.ai  
- **Do not use:** mypl.ai

## Domain (Vercel)

1. In **Vercel Dashboard** → your **vibeworking** project → **Settings** → **Domains**:
   - **Add** `www.outpl.ai` (and optionally `outpl.ai` with redirect to www).
   - **Remove** `www.mypl.ai` if it is listed.

2. If `www.outpl.ai` is already assigned to another project, remove it from that project first, then add it to **vibeworking**.

3. In your **DNS** (where outpl.ai is registered), add the records Vercel shows for `www.outpl.ai` (usually a CNAME to `cname.vercel-dns.com`).

## Deploy

```bash
npx vercel --prod
```
