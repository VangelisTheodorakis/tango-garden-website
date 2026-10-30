import type { APIRoute } from 'astro';
import { buildIcs } from '../../lib/ics.js';
import { growthSessions } from '../../data/courses.js';
import feed from '../../../public/assets/data/growth-sessions.json';

// Same as regular-classes.ics.ts, for the improvers course. The confirmation
// email links here (https://tangogarden.de/calendar/growth-sessions.ics).
export const GET: APIRoute = () =>
  new Response(buildIcs(growthSessions, feed.events), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
