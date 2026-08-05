/**
 * Registration-email render Worker.
 *
 * Google Forms cannot POST to an arbitrary endpoint, so the flow is:
 *   Form submit -> Apps Script (onFormSubmit) -> this Worker -> Apps Script sends
 * Apps Script forwards { name, courseSlug } here; this Worker renders the
 * confirmation email from the in-repo template and returns it as JSON. Apps
 * Script then sends it from the Workspace bookings@ address with the .ics
 * attached (see apps-script/Code.gs).
 *
 * This Worker never sends mail and never stores anything: the registrant's name
 * is used to render the response and then discarded. Keeping the send in Apps
 * Script means no third-party email vendor and no extra GDPR sub-processor.
 *
 * Auth: every request must carry the shared secret in the `x-tg-secret` header,
 * matched against the SHARED_SECRET Worker secret.
 */

import { confirmationEmail } from '../../src/lib/email.js';
import { courses } from '../../src/data/courses.js';
import regularClassesFeed from '../../public/assets/data/regular-classes.json';

// Course slug -> its schedule feed. One course today; add feeds as courses grow.
const FEEDS = {
  'regular-classes': regularClassesFeed,
};

const DEFAULT_COURSE = 'regular-classes';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/** Constant-time string compare, so the secret check does not leak length/timing. */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);

    const secret = request.headers.get('x-tg-secret') || '';
    if (!env.SHARED_SECRET || !safeEqual(secret, env.SHARED_SECRET)) {
      return json({ error: 'unauthorized' }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'invalid json' }, 400);
    }

    const slug = body.courseSlug || DEFAULT_COURSE;
    // Object.hasOwn, not a truthiness check on courses[slug]: a plain object
    // lookup falls through to Object.prototype for keys like "__proto__" or
    // "constructor", which are themselves truthy and would otherwise slip
    // past an `if (!course)` guard.
    if (!Object.hasOwn(courses, slug) || !Object.hasOwn(FEEDS, slug)) {
      return json({ error: 'unknown course' }, 400);
    }
    const course = courses[slug];
    const feed = FEEDS[slug];

    const { subject, html, attachments } = confirmationEmail({
      name: body.name,
      course,
      events: feed.events,
    });

    return json({ subject, html, attachments });
  },
};
