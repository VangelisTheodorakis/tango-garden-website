# Google Form: field spec

Build this at forms.google.com. Field **titles** matter: `apps-script/Code.gs`
(`extractAnswers_`) matches them loosely by keyword, not by exact position, so
minor wording changes are fine as long as the matched keyword survives.

Copy below was drafted with a Content Creator agent (brand voice, low
friction) and checked with a Legal Compliance Checker agent (GDPR consent
rules for the WhatsApp opt-in). See the reasoning notes under each field.

## Form title

Built as **"Register for the Beginner Tango Course"**, the owner's choice
over the original suggestion below. Both work; noting the original here in
case it's useful for a future course's form.

Original suggestion: "The Sprouting Sessions: Reserve Your Spot"

## Form description / intro

> Twelve weekly beginner Argentine Tango classes. No partner needed, no
> experience required, just come as you are. This one tends to fill up with
> people in their twenties and thirties figuring out work, love, and
> everything in between, but everyone finding their footing is welcome here.
> Takes under a minute, we'll email your spot and the class schedule right
> away.
>
> Questions? Check our FAQ: tangogarden.de/pages/start-here#common-questions

This is the only place the 18 to 40 audience gets signaled, and it's done as
tone, not a gate. No separate age question. Reasoning: there's no operational
use for the answer (nobody checks ID at the door, and the course is
explicitly "come as you are"), and a required age question this early in a
signup flow reads as a screening step, which contradicts the site's whole
positioning. It would also pull in GDPR complexity around age data for no
business benefit.

## Fields, in order

1. **Name**
   - Type: Short answer, required.
   - Title must contain the word "name" (e.g. "Full name", "Name"); the
     script matches on that substring, case-insensitively. No extra
     description needed.

2. **Email**
   - Use Form **Settings > Responses > Collect email addresses**, set to
     **Verified**. This validates the address and attaches it to the
     response directly (`e.response.getRespondentEmail()`), which the script
     reads automatically. No separate question needed, and no risk of a
     typo'd address breaking the confirmation send.
   - Fallback only if you cannot use verified collection: a Short answer
     question titled "Email" with **Response validation > Email** turned on.
     Weaker: nothing stops a respondent typing a garbage address.

3. **Confirmation consent** (required, GDPR)
   - Type: Checkbox (single option).
   - Required: yes.
   - Label: "I agree to receive a confirmation email about this course."
   - This is consent for the **transactional** confirmation email only. Keep
     it separate from the WhatsApp opt-in below; do not merge them into one
     checkbox. They are different purposes under GDPR and must be granted
     independently.

4. **Role**
   - Type: Multiple choice, required. Set required even though "Not sure
     yet" is an option, so every response carries a signal instead of some
     rows coming back blank.
   - Title: "Which role do you want to learn?"
   - Description: "Leading and following are the two roles in tango; we ask
     so we can balance the room, not to box you in."
   - Options: "Leading", "Following", "Not sure yet, I'll decide in class".
   - Not read by `Code.gs` (only "name" and "email"/"mail" titles are
     matched), so no code change is needed to add this.
   - The reference form's description for this question was: "The terms
     leader and follower have more commonly been used to define the roles
     in tango. Most typically a man dances as a leader, and a woman as a
     follower. This is just to help us balance partners during the class
     and won't limit your experience." Considered and rejected: stating
     gender-role pairing as the norm contradicts this site's own principle
     (Philosophy.astro: "roles by curiosity, not gender") and doesn't fit an
     audience that includes same-sex couples and non-binary registrants.
     The reassurance in that line ("won't limit your experience") is
     preserved in this form's description via "not to box you in," just
     without the gendered framing.

5. **Reduced rate (student / under 28)** (optional, unticked by default)
   - Type: Checkbox (single option), not required.
   - Title: a short label, e.g. "Reduced rate (student / under 28)".
   - Description: "Young people are the future of tango. We keep a reduced
     rate so the next generation can always find their way onto the floor."
     (reused verbatim from the site's existing pricing copy in
     `ProductGrid.astro`/`PathwayCards.astro`, so it's consistent rather than
     invented).
   - Option: "I am currently a student and/or 28 years old or less".
   - Not read by `Code.gs`. No privacy-policy change needed either: this is
     self-declared pricing-eligibility data tied directly to the course
     (contractual/operational), not marketing, so it's covered by the
     existing "5. Bookings" section rather than needing its own entry.
   - Added by the owner after comparing against the reference form. Not the
     same thing as the earlier "no age-gate question" decision: this doesn't
     gate registration (fully optional, self-declared), it only self-selects
     for a discount that already exists on the live site.

6. **Phone number** (optional)
   - Type: Short answer, not required.
   - Description: "Want in on our WhatsApp community, or to hear when new
     sessions open up? Drop your number below. Totally optional, we'll only
     ever use it to reach out about Tango Garden, never anything else."

7. **WhatsApp Community opt-in** (optional, unticked by default)
   - Type: Checkbox (single option). Google Forms checkboxes render unticked
     by default; open the live form as a test respondent and confirm both
     this and the confirmation checkbox are empty before publishing.
   - Title: "WhatsApp Community opt-in".
   - Description: "You'll get class announcements and can join topic chats
     (beginners class, practica). Joining a chat means other members there
     can see your name and phone number. This is separate from your booking
     confirmation, and you can leave anytime. See our
     [Privacy Policy](https://tangogarden.de/pages/privacy-policy) for
     details."
   - Option: "Yes, add me to the Tango Garden WhatsApp Community".
   - Built as title + description + a short checkbox option, rather than one
     long sentence as the checkbox label as originally spec'd here. That's
     an improvement: shorter, clearer checkbox, with every substantive point
     (group visibility, separateness from the confirmation consent,
     withdrawal, the Privacy Policy link) still present in the description.
   - Confirmed: the Privacy Policy link points to
     `tangogarden.de/pages/privacy-policy`.

That's the whole form: seven items, one of them just a setting (email
collection), so it reads as six questions in the UI: Name, confirmation
consent, Role, reduced-rate checkbox, Phone, WhatsApp checkbox.

## What was checked against a reference form, and why

The owner shared how a friend structured a similar tango-course form. Three
things were compared against it:

- **Role question (Leading/Following)**: kept, it's genuinely useful for
  balancing a partner-dance class. The reference form's wording ("most
  typically a man dances as a leader, and a woman as a follower") was
  rewritten gender-neutral, because it directly contradicts this site's own
  stated principle (Philosophy.astro: "Choice and inclusivity: roles by
  curiosity, not gender"). A third "not sure yet" option was added since
  many beginners genuinely don't know yet.
- **Required phone number, no separate consent checkbox**: not copied. GDPR
  (Art. 7(4)) says consent tied to a service can't be a precondition of
  getting that service, and a phone number required solely "to create a
  WhatsApp group" with no opt-in checkbox is exactly that pattern. This
  form keeps phone optional with its own unticked WhatsApp checkbox.
- **"Registering alone or with a partner?"**: not added. This site's hook is
  "no partner needed," repeated across the hero, philosophy section, and
  every course description. Asking it at signup, even innocently, implies
  partners are the norm. It's also redundant: the Role question already
  gives what's operationally needed (how many of each role to expect).

## Why the WhatsApp opt-in is its own checkbox, not folded into the phone field

GDPR consent must be specific and granular. Typing a phone number into an
optional field is not, by itself, a clear affirmative act of consent to be
messaged, so the checkbox is what actually authorizes anything. It also has
to stay separate from the confirmation-email checkbox (different purpose)
and separate from any future Meta ads consent (see below).

The checkbox copy names what actually happens (announcements plus specific
chats, and that group chats expose your number to other members) rather than
a vague "marketing updates," because vague bundled consent is one of the most
commonly flagged GDPR defects. It also links to the Privacy Policy, which now
has a matching section (see `src/pages/pages/privacy-policy.astro`, "8.
WhatsApp Community") describing the same thing: what data is used, that
WhatsApp is provided by Meta Platforms Ireland Ltd. with a possible transfer
outside the EU, and how to withdraw.

## Deferred: Meta/Instagram ads retargeting consent

You decided to launch WhatsApp-only for now and add Meta ads consent later,
once ad spend is actually imminent, rather than collecting consent for a use
that isn't happening yet. When that day comes:

- Add a **third**, separate checkbox (never merged with the WhatsApp one):
  consent to share email/phone with Meta in hashed form for ad retargeting
  (Custom Audiences). Do not reuse the WhatsApp checkbox for this.
- Add a matching Privacy Policy section (controller/recipient = Meta
  Platforms Ireland Ltd., legal basis Art. 6(1)(a), international transfer
  note, withdrawal mechanism).
- Decide whether uploads happen manually or via a script; either way, no
  on-site Meta Pixel. That would add cookie-consent requirements and break
  the site's `default-src 'self'` CSP. An uploaded contact list keeps this
  compatible with the site's existing GDPR-first architecture.
- German UWG (unfair competition law) also applies to unsolicited commercial
  messaging, separately from GDPR; worth a quick sanity check with a lawyer
  once real ad spend is attached to this data.

## Course selection

The form currently only needs to feed **one** course
(`regular-classes` = The Sprouting Sessions, Beginner Level); `Code.gs`
hardcodes `courseSlug: 'regular-classes'`. If you later run more than one
course through this form at once, add a **Multiple choice** "Which course?"
question and tell me the exact option text; I'll wire `extractAnswers_` to
map it to the right slug in `src/data/courses.js`.

## Form settings to check

- **Settings > Responses > Collect email addresses**: Verified (see above).
- **Settings > Responses > Send respondents a copy of their response**: leave
  at its default ("Respondent can choose", or off). Do **not** turn on
  automatic receipts; the Apps Script confirmation email is the one
  registrants should get, and a second auto-generated Google receipt would
  just be confusing.
- **Settings > Presentation**: "Show link to submit another response" is your
  call; not functionally relevant to the send pipeline.

## Once the form exists

1. Open **⋮ menu > Script editor**, paste `apps-script/Code.gs`.
2. Follow the rest of [registration-setup.md](registration-setup.md) (script
   properties, trigger, sending identity, end-to-end test).
3. If any of your field titles don't contain "name" / "email" / "mail" at
   all, tell me the exact titles and I'll adjust the matcher in `Code.gs`
   rather than have you rename the questions.
