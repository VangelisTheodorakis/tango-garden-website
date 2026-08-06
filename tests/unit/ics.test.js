import { describe, expect, it } from 'vitest';
import { buildIcs, googleCalendarUrl, parseTimeRange } from '../../src/lib/ics.js';

const course = {
  slug: 'regular-classes',
  title: 'The Sprouting Sessions (Beginner Level)',
  description: 'Weekly beginner Argentine Tango course. No partner needed.',
  location: 'Yoga Drop Studio, Thürmchenswall 21, 50668 Köln, Germany',
  mapsUrl: 'https://maps.app.goo.gl/6kEkUYzG6CVq1AVp7',
  timezone: 'Europe/Berlin',
  feed: '/assets/data/regular-classes.json',
};

// A clean, gap-free three-week run for the general shape tests.
const events = [
  { date: '2026-09-10', time: '19:30 – 21:00' },
  { date: '2026-09-17', time: '19:30 – 21:00' },
  { date: '2026-09-24', time: '19:30 – 21:00' },
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

  it('wraps the event in a VCALENDAR', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
  });

  it('uses CRLF line endings', () => {
    expect(ics.includes('\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '').includes('\n')).toBe(false);
  });

  it('emits ONE recurring VEVENT, not one per occurrence', () => {
    // An earlier version emitted a separate VEVENT per date. Gmail's own
    // "Add to calendar" chip showed "Unable to load event" for that shape;
    // a single RRULE-based VEVENT (confirmed against a working reference
    // .ics) is what calendar-smart parsers expect from a recurring series.
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics.match(/END:VEVENT/g)).toHaveLength(1);
  });

  it('expresses the series as FREQ=WEEKLY with the right weekday and count', () => {
    expect(ics).toContain('RRULE:FREQ=WEEKLY;BYDAY=TH;COUNT=3');
  });

  it('anchors the series to Europe/Berlin', () => {
    expect(ics).toContain('BEGIN:VTIMEZONE');
    expect(ics).toContain('TZID:Europe/Berlin');
    expect(ics).toContain('DTSTART;TZID=Europe/Berlin:20260910T193000');
    expect(ics).toContain('DTEND;TZID=Europe/Berlin:20260910T210000');
  });

  it('gives the series a single stable UID', () => {
    expect(ics).toContain('UID:regular-classes@tangogarden.de');
    expect(ics.match(/UID:/g)).toHaveLength(1);
  });

  it('includes a reminder two days before each occurrence', () => {
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('ACTION:DISPLAY');
    expect(ics).toContain('TRIGGER:-P2D');
  });

  it('includes the course URL when the course has a mapsUrl', () => {
    expect(ics).toContain('URL:https://maps.app.goo.gl/6kEkUYzG6CVq1AVp7');
  });

  it('omits URL when the course has no mapsUrl', () => {
    const { mapsUrl, ...noMaps } = course;
    expect(buildIcs(noMaps, events, opts)).not.toContain('URL:');
  });

  it('escapes TEXT values', () => {
    expect(ics).toContain('LOCATION:Yoga Drop Studio\\, Thürmchenswall 21\\, 50668 Köln\\, Germany');
  });

  it('ignores malformed occurrences rather than breaking the series', () => {
    const messy = buildIcs(
      course,
      [{ date: '2026-13-01', time: '19:30 – 21:00' }, { date: '2026-09-10', time: 'soon' }, ...events],
      opts
    );
    expect(messy.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(messy).toContain('RRULE:FREQ=WEEKLY;BYDAY=TH;COUNT=3');
  });

  it('emits nothing beyond the calendar shell when there are no valid occurrences', () => {
    expect(buildIcs(course, [], opts)).not.toContain('VEVENT');
    expect(buildIcs(course, [{ date: 'soon' }], opts)).not.toContain('VEVENT');
  });
});

describe('buildIcs: DST and holiday-skip correctness', () => {
  // 22 Oct (before the 25 Oct CEST->CET switch), 29 Oct skipped (a holiday),
  // 5 Nov (after the switch). This is exactly the case that broke: an
  // earlier version computed the skipped week's date using local-timezone
  // millisecond arithmetic, which silently landed one day early (28 Oct
  // instead of 29 Oct) once the calculation crossed the DST boundary.
  const dstEvents = [
    { date: '2026-10-22', time: '19:30 – 21:00' },
    { date: '2026-11-05', time: '19:30 – 21:00' },
  ];
  const ics = buildIcs(course, dstEvents, opts);

  it('counts the skipped week and excludes exactly the right date', () => {
    expect(ics).toContain('RRULE:FREQ=WEEKLY;BYDAY=TH;COUNT=3');
    expect(ics).toContain('EXDATE;TZID=Europe/Berlin:20261029T193000');
  });

  it('keeps both real occurrences at 19:30 local on either side of the switch', () => {
    expect(ics).toContain('DTSTART;TZID=Europe/Berlin:20261022T193000');
    expect(ics).not.toContain('20261028'); // the bug's off-by-one date must never appear
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
