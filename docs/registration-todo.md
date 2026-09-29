# Registration email: go-live checklist

**Status: live** (checked 2026-09-26). The form is published and the Apps Script
sends confirmation emails (owner confirmed). The form opens and can be filled in
without a Google sign-in. The items below were the original manual steps, kept
for reference. Full detail: [registration-setup.md](registration-setup.md).

## Prerequisite: push the privacy-policy update (done)
- [x] `src/pages/pages/privacy-policy.astro`'s new "8. WhatsApp Community"
      section is merged to main and confirmed live at
      tangogarden.de/pages/privacy-policy ("Last updated: August 5, 2026").

## Deploy the render Worker (done)
- [x] Deployed from `workers/registration-email/` with
      `npx wrangler deploy --config ./wrangler.toml` (the `--config` matters:
      a plain `wrangler deploy` from this directory silently redeployed the
      site's own Worker instead the first time, see wrangler.toml comments)
- [x] Worker URL: `https://tango-garden-registration.vangelis-theodorakis.workers.dev`
- [x] `SHARED_SECRET` generated and set via
      `npx wrangler secret put SHARED_SECRET --config ./wrangler.toml`
- [x] Confirmed: no secret and wrong secret both return 401; GET returns 405

## Build the Google Form
Full copy: [registration-form-spec.md](registration-form-spec.md).
- [x] Add a **Name** question
- [x] Switch off **Settings > Collect email addresses: Verified**, which required a
      Google sign-in to respond at all. Done: the public form opens without a
      sign-in (checked 2026-09-26).
- [x] Add a required **confirmation consent** checkbox (transactional email only)
- [x] Add a required **Role** question (Leading / Following / Not sure yet)
- [x] Add an optional **Reduced rate (student / under 28)** checkbox
- [x] Add an optional **Phone number** question
- [x] Add a separate, optional **WhatsApp Community opt-in** checkbox (unticked
      by default; not merged with the confirmation checkbox)
- [x] Confirmed all checkboxes load unticked in preview
- [ ] Meta/Instagram ads retargeting consent is deferred, not part of this
      form; see the spec doc for what's needed when that's revisited
- [x] Form published (live and taking registrations by September 2026)

## Wire the Apps Script
- [x] Form **⋮ > Script editor**; paste `apps-script/Code.gs`
- [x] Script properties: `WORKER_URL` and `SHARED_SECRET` (same secret as the Worker)
- [x] Add trigger: `onFormSubmit`, source **From form**, type **On form submit**
- [x] Authorize the Gmail-send + external-fetch scopes when prompted

## Sending identity
- [x] `bookings@tangogarden.de` works as the **Send mail as** alias on the account
      that owns the script (confirmation emails are going out)

## Test end to end
- [x] Confirmation emails arrive for real registrations
- [x] The form opens with no Google account signed in (checked 2026-09-26)
- If a confirmation ever doesn't arrive, check the Apps Script **Executions** log.

## After go-live (standing instructions)
- Schedule changes: edit `public/assets/data/regular-classes.json` and `git push`
  (updates cards, hosted `.ics`, and future emails together). If you change the
  English `label` there, update `label_de` too (the German site reads it).
- Redeploy the Worker only when the template/course metadata changes
  (`src/lib/email.js`, `src/data/courses.js`).
- The site links the form's `forms.gle` short URL. The GA4 Key Event
  `register_click` matches `forms.gle`, so keep that link format.
