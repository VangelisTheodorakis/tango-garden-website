import type { APIRoute } from 'astro';
import { buildIcs } from '../../lib/ics.js';

// One-off pop-up class with ESN Köln. The confirmation email sent from
// bookings@ links here (https://tangogarden.de/calendar/esn-tango-class-13-dec.ics)
// instead of attaching the file. Text matches the email's Google Calendar link.
const event = {
  slug: 'esn-tango-class-2026-12-13',
  title: 'ESN Köln × Tango Garden: Free Argentine Tango Class',
  description:
    'Free beginner-friendly Argentine tango class with ESN Köln and Tango Garden. No partner needed, come as you are. Please bring an ID.',
  location: 'UniSport Köln, small gym, Zülpicher Wall 1, 50674 Köln',
  mapsUrl: 'https://maps.app.goo.gl/28yKvvXAWNpXnT9V8',
  timezone: 'Europe/Berlin',
};

export const GET: APIRoute = () =>
  new Response(buildIcs(event, [{ date: '2026-12-13', time: '17:30 – 19:00' }]), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
