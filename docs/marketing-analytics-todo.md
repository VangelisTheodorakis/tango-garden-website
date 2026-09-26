# Marketing & analytics: open to-dos

Follow-ups from the SEO audit, the German launch and the first traffic report
(26 Sep 2026). Report: "Tango Garden Traffic Report" (Claude artifact + PDF),
covering 17 Aug – 25 Sep 2026.

## Track the event platforms
Meta ads and meetup.com show up in Google Analytics. **rausgegangen and
Eventbrite don't appear at all.** Sign-ups there happen on the platform itself,
and any click through to the site arrives without a source (counted as Direct).

- [ ] Use a tagged link in every listing so each platform shows up by name.
      Pick the page that matches the event (`enter-the-garden`,
      `beginner-course` or `garden-practica`):
  - Eventbrite: `https://tangogarden.de/pages/enter-the-garden?utm_source=eventbrite&utm_medium=referral`
  - rausgegangen (German audience, so German page): `https://tangogarden.de/de/pages/enter-the-garden?utm_source=rausgegangen&utm_medium=referral`
  - Meetup: `https://tangogarden.de/pages/enter-the-garden?utm_source=meetup&utm_medium=referral`
- [ ] Collect sign-ups made on the platforms themselves (Eventbrite RSVPs /
      tickets, rausgegangen) per event, including 17 Aug – 25 Sep, so the
      report can show every channel, not only website traffic.
- [ ] Add a **"Found us via"** column to the registration form's responses
      sheet and fill in the answer you already ask for in person at the
      first class. That's the true source of every actual student. We
      decided not to add a question to the form itself, to keep it short.

## Next Meta campaign
- [ ] Wait until the page-speed fix is live (the course page showed its main
      image after ~4.6 s on phones).
- [ ] Send German-targeted ads to `/de/pages/beginner-course` with UTM tags,
      e.g. `?utm_source=social&utm_medium=campaign&utm_campaign=beginner_course_w_de`.
- [ ] Compare actual registrations (form responses) against the €120 spend,
      not just registration clicks.

## Search Console (German launch, 26 Sep)
- [ ] Request indexing for `/pages/code-of-care` and `/collections/all`.
- [ ] Weekly until ~24 Oct: check Indexing → Pages for German URLs marked
      "Duplicate, Google chose different canonical".
- [ ] ~26 Oct: 30-day SEO re-audit plus GA check (registration clicks by
      language and content group, FAQ questions opened).
- [ ] Nov–Dec: judge "tango köln" movement over 8–12 weeks, both homepages
      combined.

## Site
- [ ] Native-speaker read of the German pages; legal check of the German
      privacy policy, AGB and refund policy.
- [ ] Cloudflare: 301 `www.tangogarden.de` → `https://tangogarden.de`
      (Rules → Redirect Rules). Low priority; canonicals already cover it.
- [ ] Decide on a one-line rhythm-trainer link below the homepage pathway cards.
- [ ] In GA reports on data before 26 Sep, filter "Hostname exactly matches
      tangogarden.de" to exclude test traffic.
