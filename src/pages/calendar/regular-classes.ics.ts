import type { APIRoute } from 'astro';
import { buildIcs } from '../../lib/ics.js';
import { regularClasses } from '../../data/courses.js';
import feed from '../../../public/assets/data/regular-classes.json';

// Static endpoint: Astro writes this to dist/calendar/regular-classes.ics at
// build, served same-origin from https://tangogarden.de/calendar/regular-classes.ics
// (default-src 'self' already allows it, no CSP change). The schedule is the
// same for every registrant, so the file is not personalised.
export const GET: APIRoute = () =>
  new Response(buildIcs(regularClasses, feed.events), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
