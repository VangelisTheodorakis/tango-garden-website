import { describe, expect, it } from 'vitest';
import { buildIcs, googleCalendarUrl, parseTimeRange } from '../../src/lib/ics.js';

const course = {
  slug: 'regular-classes',
  title: 'The Sprouting Sessions (Beginner Level)',
  description: 'Weekly beginner Argentine Tango course. No partner needed.',
  location: 'Yoga Drop Studio, Thürmchenswall 21, 50668 Köln, Germany',
  timezone: 'Europe/Berlin',
  feed: '/assets/data/regular-classes.json',
};

const events = [
  { date: '2026-09-10', time: '19:30 – 21:00' },
  { date: '2026-10-22', time: '19:30 – 21:00' }, // before DST switch (CEST)
  { date: '2026-11-05', time: '19:30 – 21:00' }, // after DST switch (CET)
];

const opts = { dtstamp: new Date('2026-08-01T10:00:00Z') };

describe('parseTimeRange', () => {
  it('parses an en-dash range', () => {
    expect(parseTimeRange('19:30 – 21:00')).toEqual({ start: '19:30', end: '21:00' });
  });

  it('tolerates a hyphen and stray whitespace', () => {
    expect(parseTimeRange('  9:00-10:30 ')).toEqual({ start: '09:00', end: '10:30' });
  });

  it.each([
    ['19:30', 'no end time'],
    ['25:00 – 26:00', 'hours out of range'],
    ['19:70 – 21:00', 'minutes out of range'],
    ['evening', 'free text'],
    ['', 'empty string'],
    [null, 'null'],
    [undefined, 'undefined'],
  ])('rejects %s (%s)', (input) => {
    expect(parseTimeRange(input)).toBeNull();
  });
});

describe('buildIcs', () => {
  const ics = buildIcs(course, events, opts);

  it('wraps the events in a VCALENDAR', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
  });

  it('uses CRLF line endings', () => {
    expect(ics.includes('\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '').includes('\n')).toBe(false);
  });

  it('emits one VEVENT per valid occurrence', () => {
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(3);
    expect(ics.match(/END:VEVENT/g)).toHaveLength(3);
  });

  it('anchors every event to Europe/Berlin (DST-safe)', () => {
    expect(ics).toContain('BEGIN:VTIMEZONE');
    expect(ics).toContain('TZID:Europe/Berlin');
    // Same local 19:30 wall-clock start on both sides of the Oct DST switch.
    expect(ics).toContain('DTSTART;TZID=Europe/Berlin:20261022T193000');
    expect(ics).toContain('DTSTART;TZID=Europe/Berlin:20261105T193000');
    expect(ics).toContain('DTEND;TZID=Europe/Berlin:20261105T210000');
  });

  it('gives each event a stable, unique UID', () => {
    expect(ics).toContain('UID:regular-classes-2026-09-10@tangogarden.de');
    const uids = ics.match(/UID:[^\r\n]+/g);
    expect(new Set(uids).size).toBe(uids.length);
  });

  it('escapes TEXT values (the title has a comma-free but parens summary)', () => {
    // Semicolons/commas in LOCATION must be backslash-escaped.
    expect(ics).toContain('LOCATION:Yoga Drop Studio\\, Thürmchenswall 21\\, 50668 Köln\\, Germany');
  });

  it('skips malformed occurrences instead of emitting a broken event', () => {
    const messy = buildIcs(
      course,
      [{ date: '2026-13-01', time: '19:30 – 21:00' }, { date: '2026-09-10', time: 'soon' }, ...events],
      opts
    );
    expect(messy.match(/BEGIN:VEVENT/g)).toHaveLength(3);
  });
});

describe('googleCalendarUrl', () => {
  const url = googleCalendarUrl(course, events);
  const parsed = new URL(url);

  it('builds a recurring TEMPLATE link from the earliest occurrence', () => {
    expect(parsed.origin + parsed.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(parsed.searchParams.get('action')).toBe('TEMPLATE');
    expect(parsed.searchParams.get('dates')).toBe('20260910T193000/20260910T210000');
    expect(parsed.searchParams.get('recur')).toBe('RRULE:FREQ=WEEKLY;COUNT=3');
    expect(parsed.searchParams.get('ctz')).toBe('Europe/Berlin');
    expect(parsed.searchParams.get('text')).toBe(course.title);
  });

  it('returns null when there is nothing valid to add', () => {
    expect(googleCalendarUrl(course, [])).toBeNull();
    expect(googleCalendarUrl(course, [{ date: 'soon' }])).toBeNull();
  });
});
