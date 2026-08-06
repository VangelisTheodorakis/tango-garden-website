# Registration confirmation email: setup

Semester registrations run through a **Google Form**. On each submission a
**Google Apps Script** asks a **Cloudflare Worker** to render the confirmation
email from the in-repo template, then sends it from `bookings@tangogarden.de`
with the semester `.ics` attached.

```
Google Form  ──submit──▶  Apps Script (onFormSubmit)  ──POST──▶  Cloudflare Worker
                                    │                              (renders email + .ics)
                                    ◀────────── JSON {subject, html, attachments} ──────────
                                    │
                                    └── GmailApp.sendEmail from bookings@ (with .ics attached)
```

Why this split: the Worker keeps the email template in the repo (version
controlled, tested); Apps Script does the sending, so mail stays inside your
Google Workspace (existing SPF/DKIM) with **no third-party email vendor** and no
extra GDPR sub-processor. The Worker stores nothing.

Source:
- Worker: [`workers/registration-email/worker.js`](../workers/registration-email/worker.js)
- Apps Script: [`apps-script/Code.gs`](../apps-script/Code.gs)
- Email template: [`src/lib/email.js`](../src/lib/email.js)

---

## 1. Deploy the render Worker

From `workers/registration-email/`:

```bash
npx wrangler deploy --config ./wrangler.toml
```

**Always pass `--config ./wrangler.toml` explicitly.** Without it, a plain
`wrangler deploy` run from this directory has been observed silently
resolving the site's root `wrangler.jsonc` instead, redeploying the site's
Worker (harmlessly, since the content is unchanged, but the registration
Worker never gets created). Confirmed 2026-08-05; a local `package.json` in
this directory did not fix it.

This is a **separate** Worker from the site (the site deploys via `git push`).
It gets its own URL, e.g. `https://tango-garden-registration.<subdomain>.workers.dev`.
Note that URL.

Generate a shared secret and set it on the Worker (never commit it):

```bash
# generate one, e.g.:
openssl rand -hex 32
# then:
npx wrangler secret put SHARED_SECRET --config ./wrangler.toml
```

Quick check that it is protected (should return 401 without the secret):

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://tango-garden-registration.<subdomain>.workers.dev
```

## 2. Build the Google Form

Create a form with at least:
- **Name** (short answer)
- **Email** (short answer, with Response validation > Email turned on). Do
  not use Settings > Collect email addresses: Verified; it requires the
  respondent to sign into a Google account before they can respond at all,
  which blocks anyone without one and contradicts the low-friction goal of
  this form. See `registration-form-spec.md` for the full reasoning.
- A **consent** checkbox (required), e.g. "I agree to receive a confirmation
  email about this course." (GDPR: a confirmation for a registration the person
  submitted is fine. Do **not** add them to any marketing list without a
  separate, explicit opt-in.)

The script matches question titles loosely (any title containing "name" or
"email"/"mail"), so exact wording is flexible.

## 3. Add the Apps Script

In the form: **⋮ menu > Script editor** (or **Extensions > Apps Script**).
- Paste the contents of [`apps-script/Code.gs`](../apps-script/Code.gs).
- **Project Settings > Script properties**, add:
  - `WORKER_URL` = the Worker URL from step 1
  - `SHARED_SECRET` = the same value from step 1
- **Triggers** (clock icon) > **Add trigger**:
  - function `onFormSubmit`, event source **From form**, type **On form submit**.
- Authorize when prompted (Gmail send + external fetch scopes).

## 4. Sending identity

`GmailApp.sendEmail(..., { from: 'bookings@tangogarden.de' })` only works if
`bookings@tangogarden.de` is a verified **Send mail as** alias on the Google
account that owns the script. Confirm under Gmail > Settings > Accounts. If it is
not, either add it, or change the `from` in `Code.gs` to an address that is.

## 5. Test end to end

Submit the form with your own email. You should receive the confirmation, and:
- the greeting shows the name you entered,
- the **Add to calendar** section has a Google button and an `.ics` link,
- the **`.ics` is attached** (opens to all 12 classes),
- **Where to find us** and the footer address link to the Google Maps pin.

If nothing arrives, open the Apps Script **Executions** log for the error (most
often: `WORKER_URL`/`SHARED_SECRET` mismatch, or the `from` alias is not
verified).

## When the schedule changes

Edit [`public/assets/data/regular-classes.json`](../public/assets/data/regular-classes.json)
and `git push`. That updates the homepage cards, the hosted `.ics`, and every
future confirmation email at once. Redeploy the Worker only if you change the
email template or course metadata (`src/lib/email.js`, `src/data/courses.js`).
```
