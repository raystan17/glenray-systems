# GlenRay CRM — Get It Live

## Quick path (no Supabase needed)

1. **Vercel** → Project → **Settings** → **General** → **Root Directory** → set to `crm`
2. **Vercel** → **Settings** → **Environment Variables** → add:
   - `CRM_PASSWORD` = `glenray2026` (or your password)
   - `SESSION_SECRET` = any long random string (e.g. `mysecret123`)
3. **Push to GitHub** → Vercel auto-deploys
4. Done. Your bro can log in and view the CRM with demo data.

If you had `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` in Vercel before, remove them so the app uses the built-in demo data instead.

*Note: Without Supabase, data lives in temp storage. Adds/edits may not persist across cold starts. For full persistence later, add Supabase.*

---

## With Supabase (full persistence)

1. Supabase → New Project → SQL Editor → run `crm/supabase/schema.sql`
2. Supabase → Project Settings → API → copy Project URL + **service_role** key
3. Vercel → Root Directory = `crm`
4. Vercel → add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CRM_PASSWORD`, `SESSION_SECRET`
5. Redeploy
