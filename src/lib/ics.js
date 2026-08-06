/**
 * Builds an iCalendar (RFC 5545) feed from a course descriptor + its dated
 * occurrences, plus a one-click Google Calendar link for the same series.
 *
 * Lives in its own module so the formatting rules can be unit tested without a
 * browser; the endpoint (src/pages/calendar/*.ics.ts) just returns whatever
 * buildIcs() produces.
 *
 * The venue is in Cologne, so every event is anchored to Europe/Berlin via a
 * VTIMEZONE block and TZID references. That is what keeps the classes at 19:30
 * local on both sides of the 25 Oct 2026 CEST-to-CET switch; a plain UTC or
 * floating time would drift the later classes by an hour.
 *
 * The whole series is ONE recurring VEVENT (RRULE + EXDATE for any skipped
 * week), not one VEVENT per class. An earlier version emitted a separate
 * VEVENT per date; that shipped, and Gmail's own inline "Add to calendar"
 * chip showed "Unable to load event" for it, confirmed by comparing against
 * a working reference .ics that used a single RRULE-based VEVENT. Twelve
 * disconnected one-off meetings in one file is not a shape calendar-smart
 * parsers recognise as a series. EXDATE (rather than just enumerating dates)
 * is what still lets a future holiday week be skipped correctly.
 *
 * @typedef {import('./next-event.js').GardenEvent} GardenEvent
 * @typedef {import('../data/courses.js').Course} Course
 */

import { parseDate } from './next-event.js';

/**
 * IANA definition for Europe/Berlin, matching the fixed EU DST rules
 * (last Sunday of March / October). Emitted verbatim into every calendar.
 */
const BERLIN_VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Berlin',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

/**
 * Parses a free-text time range like "19:30 – 21:00" into 24h start/end.
 * Tolerates an en-dash or hyphen separator and surrounding whitespace.
 * Returns null for anything that is not two valid HH:MM times, so a typo in the
 * feed drops that one class instead of producing a broken event.
 *
 * @param {string} range
 * @returns {{ start: string, end: string } | null}
 */
export function parseTimeRange(range) {
  if (typeof range !== 'string') return null;
  const m = range.match(/^\s*(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})\s*$/);
  if (!m) return null;
  const [sh, sm, eh, em] = [m[1], m[2], m[3], m[4]].map(Number);
  if (sh > 23 || eh > 23 || sm > 59 || em > 59) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return { start: `${pad(sh)}:${pad(sm)}`, end: `${pad(eh)}:${pad(em)}` };
}

/**
 * "2026-09-10" + "19:30" -> "20260910T193000" (local, no zone suffix; the
 * event carries TZID=Europe/Berlin separately).
 *
 * @param {string} iso
 * @param {string} hhmm
 * @returns {string}
 */
function localStamp(iso, hhmm) {
  return `${iso.replace(/-/g, '')}T${hhmm.replace(':', '')}00`;
}

/** A UTC timestamp like "20260910T193000Z" for DTSTAMP. */
function utcStamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Escapes a value for a TEXT property (RFC 5545 §3.3.11): backslash, semicolon,
 * comma and newlines.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

/**
 * Folds a content line to <=75 octets (RFC 5545 §3.1), continuing with CRLF +
 * a single space. Octet-based so multi-byte characters (ü in "Köln") never
 * split mid-sequence.
 *
 * @param {string} line
 * @returns {string}
 */
function foldLine(line) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;

  const decoder = new TextDecoder();
  const parts = [];
  let start = 0;
  // First line takes 75 octets; each continuation takes 74 (a leading space).
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Do not split a UTF-8 continuation byte (0b10xxxxxx) from its lead byte.
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(decoder.decode(bytes.slice(start, end)));
    start = end;
    limit = 74;
  }
  return parts.join('\r\n ');
}

const WEEKDAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * "2026-09-10" as a calendar date anchored at UTC midnight, so stepping by
 * exact weeks (below) never drifts across a DST boundary. Real-world local
 * time (Europe/Berlin) does have a DST jump on these dates; UTC never does,
 * so it is the only safe axis for pure calendar-day arithmetic. Using local
 * time here (as an earlier version did) silently produced dates one day
 * early for every occurrence after the 25 Oct clock change.
 *
 * @param {string} iso
 * @returns {Date}
 */
function utcDateOnly(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** The reverse of utcDateOnly: a UTC-midnight Date back to "2026-09-10". */
function toIso(utcDate) {
  const y = utcDate.getUTCFullYear();
  const m = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(utcDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Builds the full VCALENDAR string for a course: a single recurring VEVENT
 * spanning the first occurrence to the last, with any date from the feed
 * that does not fall on the expected weekly cadence added as an EXDATE.
 * Every occurrence shares the first one's time of day, matching how the
 * course actually runs (one weekly time slot).
 *
 * @param {Course} course
 * @param {GardenEvent[]} events
 * @param {{ dtstamp?: Date }} [opts]  dtstamp is injectable for stable tests.
 * @returns {string}
 */
export function buildIcs(course, events, opts = {}) {
  const stamp = utcStamp(opts.dtstamp ?? new Date());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tango Garden Cologne//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(course.title)}`,
    `X-WR-TIMEZONE:${course.timezone}`,
    ...BERLIN_VTIMEZONE,
  ];

  const valid = (events ?? [])
    .map((e) => ({ event: e, date: parseDate(e?.date), time: parseTimeRange(e?.time) }))
    .filter((x) => x.date && x.time)
    .sort((a, b) => a.date - b.date);

  if (valid.length) {
    const first = valid[0];
    const last = valid[valid.length - 1];
    const firstUtc = utcDateOnly(first.event.date);
    const lastUtc = utcDateOnly(last.event.date);
    const weekly = Math.round((lastUtc - firstUtc) / MS_PER_WEEK) + 1;

    // Any weekly slot between the first and last date that is NOT one of the
    // actual feed dates is a skipped week (a holiday) and becomes an EXDATE.
    const actualDates = new Set(valid.map((x) => x.event.date));
    const exdates = [];
    for (let i = 0; i < weekly; i++) {
      const iso = toIso(new Date(firstUtc.getTime() + i * MS_PER_WEEK));
      if (!actualDates.has(iso)) exdates.push(iso);
    }

    lines.push(
      'BEGIN:VEVENT',
      `UID:${course.slug}@tangogarden.de`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=${course.timezone}:${localStamp(first.event.date, first.time.start)}`,
      `DTEND;TZID=${course.timezone}:${localStamp(first.event.date, first.time.end)}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${WEEKDAY_CODES[firstUtc.getUTCDay()]};COUNT=${weekly}`
    );
    if (exdates.length) {
      lines.push(
        `EXDATE;TZID=${course.timezone}:` +
          exdates.map((iso) => localStamp(iso, first.time.start)).join(',')
      );
    }
    lines.push(`SUMMARY:${escapeText(course.title)}`, `LOCATION:${escapeText(course.location)}`);
    if (course.mapsUrl) lines.push(`URL:${course.mapsUrl}`);
    lines.push(
      `DESCRIPTION:${escapeText(course.description)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeText(course.title)}`,
      'TRIGGER:-P2D',
      'END:VALARM',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/**
 * One-click "Add to Google Calendar" link for the whole series. The feed is a
 * clean weekly cadence, so it maps to a single recurring TEMPLATE event
 * (FREQ=WEEKLY;COUNT=n). `ctz` anchors it to Europe/Berlin so Google applies
 * the DST switch itself. Returns null if there are no valid occurrences.
 *
 * @param {Course} course
 * @param {GardenEvent[]} events
 * @returns {string | null}
 */
export function googleCalendarUrl(course, events) {
  const valid = (events ?? [])
    .map((e) => ({ event: e, date: parseDate(e?.date), time: parseTimeRange(e?.time) }))
    .filter((x) => x.date && x.time)
    .sort((a, b) => a.date - b.date);
  if (!valid.length) return null;

  const first = valid[0];
  const dates =
    `${localStamp(first.event.date, first.time.start)}/` +
    `${localStamp(first.event.date, first.time.end)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: course.title,
    dates,
    recur: `RRULE:FREQ=WEEKLY;COUNT=${valid.length}`,
    ctz: course.timezone,
    location: course.location,
    details: course.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
