# Registration email: go-live checklist

Code is done and tested. These are the manual wiring steps left for the owner.
Full detail: [registration-setup.md](registration-setup.md).

## Deploy the render Worker
- [ ] From `workers/registration-email/`: `npx wrangler deploy`
- [ ] Note the Worker URL (`https://tango-garden-registration.<subdomain>.workers.dev`)
- [ ] Generate a secret (`openssl rand -hex 32`) and set it: `npx wrangler secret put SHARED_SECRET`
- [ ] Sanity check: `curl -X POST <worker-url>` returns `401` (protected)

## Build the Google Form
- [ ] Add a **Name** question
- [ ] Turn on **Settings > Collect email addresses** (or add an **Email** question)
- [ ] Add a required **consent** checkbox (confirmation email; not marketing)

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
- [ ] If nothing arrives, check the Apps Script **Executions** log

## After go-live
- [ ] Schedule changes: edit `public/assets/data/regular-classes.json` and `git push`
      (updates cards, hosted `.ics`, and future emails together)
- [ ] Redeploy the Worker only when the template/course metadata changes
      (`src/lib/email.js`, `src/data/courses.js`)
