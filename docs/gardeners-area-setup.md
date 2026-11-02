# Gardeners' Area: setup

`tangogarden.de/gardeners-area` is a private dashboard: course page visits →
register clicks → forms submitted per course, bounce rate, sources and a weekly
trend, straight from GA4.

How it fits together:

- **Cloudflare Access** puts a Google login in front of `/gardeners-area`
  (page and data). Only the emails on the list get through.
- **The page** is a normal page of the site (`src/pages/gardeners-area.astro`),
  noindex, not in the sitemap, no Google Analytics on it.
- **The data** comes from a small Worker, `tango-garden-gardeners`
  (`workers/gardeners-api/`), on the route `tangogarden.de/gardeners-area/api/*`.
  It checks the Access login again, reads GA4 with a read-only service account,
  and caches each answer for 10 minutes.

Allowed emails: van.theodorakis@gmail.com, yovanna.hhr@gmail.com,
vangelis.theodorakis@tangogarden.de.

Do the steps in this order. Everything happens in the **tangogarden.de**
Cloudflare account (the one whose Workers include `tango-garden-website`).

---

## 1. A key for the read-only Google account (3 min)

The Worker reads GA4 as `ga-reader@tango-garden-seo.iam.gserviceaccount.com`,
which already has read access to the GA4 property.

1. console.cloud.google.com → project **tango-garden-seo** → **IAM & Admin →
   Service accounts** → `ga-reader@…` → **Keys → Add key → Create new key →
   JSON → Create**. A `.json` file downloads.
2. Keep it out of the project folder and never commit it. You will delete it
   after step 4.

If Google says key creation is disabled by an organisation policy, stop and
tell Claude: there is a workaround.

## 2. Google login for Cloudflare (5 min)

Cloudflare needs its own small "Sign in with Google" app.

1. dash.cloudflare.com → **Zero Trust**. The first time it asks for a **team
   name** (e.g. `tangogarden`) and a plan: choose **Free** (up to 50 users).
   Your team domain is then `tangogarden.cloudflareaccess.com`.
2. console.cloud.google.com (same project is fine) → **APIs & Services → OAuth
   consent screen**: User type **External**, app name "Tango Garden", your
   email as support and developer contact. Save.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** →
   type **Web application**:
   - Authorized JavaScript origins: `https://tangogarden.cloudflareaccess.com`
   - Authorized redirect URIs:
     `https://tangogarden.cloudflareaccess.com/cdn-cgi/access/callback`
   - Create, and copy the **Client ID** and **Client secret**.
4. Zero Trust → **Settings → Authentication → Login methods → Add new →
   Google**: paste the Client ID and secret → Save → **Test** (should say
   success).

(Use your own team name in place of `tangogarden` if you picked another one.)

## 3. Lock the path (3 min)

Zero Trust → **Access → Applications → Add an application → Self-hosted**:

- Application name: `Gardeners' Area`
- Session duration: `1 month` (so you don't log in every visit)
- Public hostname: domain `tangogarden.de`, path `gardeners-area`
  (this covers the page and everything under it, including the data)
- Login methods: **Google** only
- Policy: name `Team`, action **Allow**, **Include → Emails**:
  `van.theodorakis@gmail.com`, `yovanna.hhr@gmail.com`,
  `vangelis.theodorakis@tangogarden.de`
- Save.

Then open the application again and copy its **Application Audience (AUD)
Tag** (Overview / Basic information). You need it in step 4.

## 4. Deploy the data Worker (3 min)

Tell Claude your team domain, or set it yourself in
`workers/gardeners-api/wrangler.toml` (`ACCESS_TEAM_DOMAIN`).

From the project folder in the terminal (PowerShell), logged in to the
tangogarden.de account (`npx wrangler whoami`):

```bash
cd workers/gardeners-api; npx wrangler deploy --config ./wrangler.toml
```

```bash
Get-Content "C:\path\to\the-key.json" -Raw | npx wrangler secret put GA_SA_KEY --config ./wrangler.toml
```

```bash
npx wrangler secret put ACCESS_AUD --config ./wrangler.toml
```
(paste the AUD tag)

```bash
npx wrangler secret put ALLOWED_EMAILS --config ./wrangler.toml
```
(paste `van.theodorakis@gmail.com,yovanna.hhr@gmail.com,vangelis.theodorakis@tangogarden.de`)

```bash
cd ../..
```

Then delete the downloaded key file.

## 5. Put the page live

Claude merges the `gardeners-area` branch and pushes. Then open
https://tangogarden.de/gardeners-area in a private window: Google login →
dashboard with real numbers.

---

## Changing who has access

Update **both**: the Access policy (step 3) and the `ALLOWED_EMAILS` secret
(step 4). The Worker refuses anyone not on its own list, even if Access lets
them in.

## If something is wrong

| What you see | Cause |
|---|---|
| No Google login, page opens directly | Step 3 path or domain is off |
| "You are not signed in, or this email has no access." | `ACCESS_AUD`, `ACCESS_TEAM_DOMAIN` or `ALLOWED_EMAILS` doesn't match |
| "Couldn't load the numbers. The data service answered 502." | The GA key: `GA_SA_KEY` missing or wrong. `npx wrangler tail --config ./wrangler.toml` shows the exact error |
| "…answered 404." | The Worker or its route isn't deployed (step 4) |
