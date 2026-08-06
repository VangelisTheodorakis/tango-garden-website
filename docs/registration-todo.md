# Registration email: go-live checklist

Code is done and tested. These are the manual wiring steps left for the owner.
Full detail: [registration-setup.md](registration-setup.md).

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
- [ ] **Fix pending:** switch off **Settings > Collect email addresses:
      Verified** and add a plain **Email** question (Response validation >
      Email) instead. Verified requires a Google sign-in to respond at all,
      excluding anyone without a Google account; this contradicts the
      low-friction goal and needs to change on the live form.
- [x] Add a required **confirmation consent** checkbox (transactional email only)
- [x] Add a required **Role** question (Leading / Following / Not sure yet)
- [x] Add an optional **Reduced rate (student / under 28)** checkbox
- [x] Add an optional **Phone number** question
- [x] Add a separate, optional **WhatsApp Community opt-in** checkbox (unticked
      by default; not merged with the confirmation checkbox)
- [x] Confirmed all checkboxes load unticked in preview
- [ ] Meta/Instagram ads retargeting consent is deferred, not part of this
      form; see the spec doc for what's needed when that's revisited
- [ ] Still **not published** ("Not Published" in the form editor). Publish
      once the privacy-policy update below is live, not before.

## Wire the Apps Script
- [ ] Form **⋮ > Script editor**; paste `apps-script/Code.gs`
- [ ] Script properties: `WORKER_URL` and `SHARED_SECRET` (same secret as the Worker)
- [ ] Add trigger: `onFormSubmit`, source **From form**, type **On form submit**
- [ ] Authorize the Gmail-send + external-fetch scopes when prompted

## Sending identity
- [ ] Confirm `bookings@tangogarden.de` is a verified **Send mail as** alias on the
      account that owns the script (else change `from` in `Code.gs`)

## Test end to end
- [ ] Submit the form with your own email
- [ ] Confirm: name in greeting, calendar buttons present, `.ics` attached,
      Maps links in "Where to find us" + footer
- [ ] After switching off Verified email collection, confirm the form can be
      opened and submitted in a private/incognito window with no Google
      account signed in at all, proving non-Google-account respondents
      aren't blocked
- [ ] If nothing arrives, check the Apps Script **Executions** log

## After go-live
- [ ] Schedule changes: edit `public/assets/data/regular-classes.json` and `git push`
      (updates cards, hosted `.ics`, and future emails together)
- [ ] Redeploy the Worker only when the template/course metadata changes
      (`src/lib/email.js`, `src/data/courses.js`)
