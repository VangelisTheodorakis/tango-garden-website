# Handoff: registrations, analytics and the Gardeners' Area

State as of **3 Nov 2026**. Read this first when picking up work on course
registrations, tracking or the private dashboard. The site basics (Astro,
deploy by `git push`, bilingual, GDPR rules) are in [CLAUDE.md](../CLAUDE.md).

---

## 1. The pieces and how they connect

```
Visitor on a course page (tangogarden.de/pages/beginner-course, /growth-sessions, /de/…)
  │  GA4 events from the site: register_click, faq_expand, whatsapp_click,
  │  read_expect / read_prices / read_faq / read_end, pricing_tier_toggle
  ▼
Google Form (one per course, Winter 2027)  ──►  Response sheet (Google Sheets)
  │  on submit: Apps Script (apps-script/Code.gs, pasted into each form)
  ├─► GA4 Measurement Protocol: registration_submit {course}
  └─► Worker tango-garden-registration (workers/registration-email)
        renders the confirmation email + .ics from the bundled date feeds
        └─► Apps Script sends it from bookings@ via GmailApp

Gardeners' Area  tangogarden.de/gardeners-area   (Cloudflare Access, Google login)
  page:  src/pages/gardeners-area.astro  (static, noindex, no GA on it)
  data:  /gardeners-area/api/report?days=7|28|90
         Worker tango-garden-gardeners (workers/gardeners-api), route on that path
         reads GA4 + both response sheets + Search Console as ga-reader@…
```

| Piece | Where | Deployed by |
|---|---|---|
| Website (incl. dashboard page, reading tracking) | `src/` | `git push origin main` (Cloudflare build) |
| Registration email Worker | `workers/registration-email/` | owner runs `npx wrangler deploy --config ./wrangler.toml` from that folder |
| Dashboard data Worker | `workers/gardeners-api/` | owner runs `npx wrangler deploy --config ./workers/gardeners-api/wrangler.toml` |
| Form script | `apps-script/Code.gs` | owner pastes it into each form's Apps Script editor |

Claude never runs `wrangler deploy` (a hook blocks it). Both Workers are
outside the site build, so a `git push` does **not** update them.

## 2. Accounts and access

- **Cloudflare:** everything lives in the **vangelis.theodorakis@tangogarden.de**
  account (`vangelis-theodorakis.workers.dev`). The van.theodorakis@gmail.com
  account has a stray old `tango-garden-registration` Worker; deploying there
  by mistake made the forms keep sending old dates once. Check with
  `npx wrangler whoami` before any deploy. The stray Worker can be deleted.
- **Zero Trust team:** `tangogarden` (`tangogarden.cloudflareaccess.com`), free
  plan. Login method: Google only, instant auth. Access app "Gardeners' Area"
  on `tangogarden.de/gardeners-area`, policy "Team" (Include → Emails),
  session 1 month.
- **Google Cloud project:** `tango-garden-seo` (number 992096888841).
  - Service account `ga-reader@tango-garden-seo.iam.gserviceaccount.com`: GA4
    Viewer on property 550087499; Viewer on both response sheets; Restricted
    user on Search Console `sc-domain:tangogarden.de`.
  - Enabled APIs: Analytics Data, Sheets, Search Console.
  - OAuth client "Sign in with Google" for Cloudflare Access lives here too.
  - Local reads (Claude): `gcloud auth print-access-token
    --impersonate-service-account=ga-reader@… --scopes=…analytics.readonly`
    (add `spreadsheets.readonly`, `webmasters.readonly` as needed).
- **GA4:** property `properties/550087499`. Custom dimensions (event scope):
  `course`, `faq_question`. The Realtime API can't show custom dimensions.

### Who can see the dashboard

Two lists, both must contain the email (the Worker checks on its own, so
Access alone is not enough to see numbers):

1. Zero Trust → Access controls → Policies → **Team** → Include → Emails.
2. The `ALLOWED_EMAILS` secret (whole list, comma-separated; replaced on each
   `put`, takes effect in seconds):
   `npx wrangler secret put ALLOWED_EMAILS --config ./workers/gardeners-api/wrangler.toml`

The email needs a Google account. Keep viewers' personal addresses out of the
repo; the Access policy is the record of who has access.

## 3. Secrets (never in the repo)

| Worker | Secret | What |
|---|---|---|
| tango-garden-gardeners | `GA_SA_KEY` | ga-reader JSON key (the downloaded file was deleted) |
| | `ACCESS_AUD` | Access app AUD tag (Additional settings → AUD tag) |
| | `ALLOWED_EMAILS` | viewer list, see above |
| Apps Script (Script Properties, per form) | `WORKER_URL` | `https://tango-garden-registration.vangelis-theodorakis.workers.dev` |
| | `COURSE_SLUG` | `growth-sessions` on the improvers form; on the beginners form unset or `regular-classes` (reported to GA4 as `beginner-course`) |
| | `GA_MEASUREMENT_ID`, `GA_API_SECRET` | GA4 Measurement Protocol |

A wrong `COURSE_SLUG` gives "Render Worker error 400: unknown course".

## 4. The dashboard: what each section reads

| Section | Source | Notes |
|---|---|---|
| The website (visits, bounce) | GA4 sessions on host tangogarden.de | visits = arrivals on any page |
| This round's sign-ups | response sheets | one per email (latest answer wins); roles from the role question; returning = same email in another course's sheet earlier, or in this course before `from`. Only counts leave the Worker |
| From course page to sign-up | GA4: course page sessions → `register_click` → `registration_submit` | counts, not people; plus English vs German page line |
| How far people read | GA4 `read_*` events ÷ course page visits | started 3 Nov 2026; e2e test `tests/e2e/reading-events.spec.js` |
| What people want to know | GA4 `faq_expand` (by `faq_question`), `whatsapp_click` (by page) | German FAQ questions report their English key |
| Week by week | GA4, last 12 ISO weeks | |
| Where visitors come from | GA4 default channel group | |
| What people searched for | Search Console, top 15 queries | ~2 days lag; rare queries hidden by Google |

GA4 is required for the report; Search Console and the sheets are optional:
if one fails the section says "Not connected yet" and the rest still loads
(`npx wrangler tail --config ./workers/gardeners-api/wrangler.toml` shows why).
Answers are cached 10 minutes per period. On localhost the page shows marked
demo numbers.

Code: `report.js` (GA queries + shaping, pure), `registrations.js` (sheets),
`search.js` (Search Console), `access.js` (JWT check), `ga.js` (Google token,
scopes), `worker.js` (glue). Tests: `tests/unit/gardeners-report.test.js`,
build tests for noindex / no GA on the page.

## 5. Recurring tasks

**New course round**
1. New dates in `public/assets/data/*.json` (keep `label_de` in step) → push.
2. Owner redeploys `tango-garden-registration` (it bundles the feeds; without
   this, confirmation emails show old dates).
3. If the round uses a new form: point the Apps Script at it (same Script
   Properties), and put the new sheet ID in `workers/gardeners-api/wrangler.toml`
   (`COURSE_ROUNDS`), share it with ga-reader.
4. Set that course's `from` in `COURSE_ROUNDS` to the day registration opens,
   and `spots` if it changed. Owner redeploys `tango-garden-gardeners`.

**Class time changes:** feeds, `StructuredData.astro` opening hours,
`public/llms.txt`, the build test's .ics DTSTART, then redeploy the email Worker.

**Testing a form:** submit with a `+test` address, then delete the row in the
response sheet. The sheet-based sign-ups follow; GA4's `registration_submit`
count can't be undone (see open items).

## 6. Current settings

- Both courses: 20 spots, counting from **1 Dec 2026** (Winter 2027 sheets:
  beginners `15h_y4ap…`, improvers `1KF_tLD1…`, full IDs in `wrangler.toml`).
- Beginners: Thursdays 19:15–20:30. Improvers: Thursdays 20:30–21:45, from
  7 Jan 2027. Practica: 2nd and 4th Wednesday of each month.

## 7. Open items

- [ ] **Owner: redeploy `tango-garden-gardeners`** so the live data service
      has the sheets, Search Console and the 1 Dec date (last code change:
      3 Nov 2026). Until then those sections show "Not connected yet".
- [ ] **Owner: add the new viewer** to the Team policy and `ALLOWED_EMAILS`
      (requested 3 Nov 2026; address given in chat, kept out of the repo).
- [ ] Check the first real registration shows a role (not "without a role").
      If not, `roleOf` in `registrations.js` needs the form's exact answers.
- [ ] Decide how to keep test submissions out of GA4's `registration_submit`
      (options: skip `+test` emails in `Code.gs`; a GA internal-traffic filter
      for own visits; a dashboard-wide count-from date).
- [ ] Tagged links (`?utm_source=rausgegangen` etc.) for every event listing;
      see [marketing-analytics-todo.md](marketing-analytics-todo.md).
- [ ] Optional: share older response sheets (September beginners) so their
      students count as "returning".
- [ ] Optional: the site's fallback address
      `tango-garden-website.vangelis-theodorakis.workers.dev/gardeners-area`
      serves the empty page shell without login (no data: the API only runs
      on tangogarden.de). Closing it means `workers_dev = false` in the
      protected `wrangler.jsonc`; owner decision.
- [ ] Optional: delete the stray Worker in the van.theodorakis Cloudflare account.
- [ ] Ideas not started: Monday email digest of the dashboard; one-question
      survey after each course ("bring a friend?" 0–10).
- [ ] Classes page: bottom cards are equal height; the owner was asked whether
      they should size to their own text instead (no answer yet).

## 8. Gotchas

- Files have mixed CRLF/LF line endings; edit with tools that keep them.
- Course pages are one component (`src/components/ClassPage.astro`); German
  words come from `src/data/classPages.de.js` (`getClassPage`).
- CSP is `default-src 'self'` plus GA hosts: anything new from another host
  needs the owner's OK first.
- The `/gardeners-area/api/*` route Worker runs before the site's own Worker,
  which is why it needs no change to `wrangler.jsonc`.
- `batchRunReports` takes at most 5 requests; `runReports` splits them.
