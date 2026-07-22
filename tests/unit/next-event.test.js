import { describe, expect, it } from 'vitest';
import { cardContent, formatDate, nextEvent, parseDate } from '../../src/lib/next-event.js';

const at = (iso) => new Date(`${iso}T12:00:00`);

describe('parseDate', () => {
  it('parses an ISO date at local midnight', () => {
    const d = parseDate('2026-07-29');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(29);
    expect(d.getHours()).toBe(0);
  });

  it.each([
    ['29/07/2026', 'non-ISO format'],
    ['2026-7-9', 'unpadded parts'],
    ['2026-02-31', 'a day that does not exist'],
    ['2026-13-01', 'a month that does not exist'],
    ['', 'empty string'],
    [null, 'null'],
    [undefined, 'undefined'],
    [20260729, 'a number'],
  ])('rejects %s (%s)', (input) => {
    expect(parseDate(input)).toBeNull();
  });
});

describe('formatDate', () => {
  it('formats as weekday, zero-padded day, short month, year', () => {
    expect(formatDate('2026-07-29')).toBe('Wed, 29 Jul 2026');
    expect(formatDate('2026-09-15')).toBe('Tue, 15 Sep 2026');
  });

  it('zero-pads single-digit days', () => {
    expect(formatDate('2026-07-08')).toBe('Wed, 08 Jul 2026');
  });

  it('returns the input unchanged when it cannot be parsed', () => {
    expect(formatDate('not a date')).toBe('not a date');
  });
});

describe('nextEvent', () => {
  const feed = {
    events: [
      { date: '2026-08-05', time: '19:30 – 22:00' },
      { date: '2026-07-08', time: '19:30 – 22:00' },
      { date: '2026-07-29', time: '19:30 – 22:00' },
    ],
  };

  it('picks the soonest upcoming event regardless of list order', () => {
    expect(nextEvent(feed, at('2026-07-22')).date).toBe('2026-07-29');
  });

  it('skips events that have already passed', () => {
    expect(nextEvent(feed, at('2026-07-30')).date).toBe('2026-08-05');
  });

  it("includes an event happening today", () => {
    expect(nextEvent(feed, at('2026-07-29')).date).toBe('2026-07-29');
  });

  it('returns null once every event is in the past', () => {
    expect(nextEvent(feed, at('2026-09-01'))).toBeNull();
  });

  it('ignores malformed dates instead of throwing', () => {
    const messy = { events: [{ date: 'soon' }, {}, { date: '2026-07-29' }] };
    expect(nextEvent(messy, at('2026-07-22')).date).toBe('2026-07-29');
  });

  it.each([[null], [undefined], [{}], [{ events: [] }]])(
    'returns null for an empty feed (%o)',
    (input) => {
      expect(nextEvent(input, at('2026-07-22'))).toBeNull();
    }
  );
});

describe('cardContent', () => {
  it('renders date and time on separate lines', () => {
    const out = cardContent(
      { label: 'Next Practica', events: [{ date: '2026-07-29', time: '19:30 – 22:00' }] },
      at('2026-07-22')
    );
    expect(out.label).toBe('Next Practica');
    expect(out.lines).toEqual(['Wed, 29 Jul 2026', '19:30 – 22:00']);
    expect(out.isEmpty).toBe(false);
  });

  it('applies the feed prefix', () => {
    const out = cardContent(
      { prefix: 'Starts ', events: [{ date: '2026-09-15', time: '19:00 – 20:30' }] },
      at('2026-07-22')
    );
    expect(out.lines[0]).toBe('Starts Tue, 15 Sep 2026');
  });

  it('omits the second line when an event has no time', () => {
    const out = cardContent({ events: [{ date: '2026-09-15' }] }, at('2026-07-22'));
    expect(out.lines).toEqual(['Tue, 15 Sep 2026']);
  });

  it("falls back to the feed's emptyMessage when nothing is upcoming", () => {
    const out = cardContent(
      { emptyMessage: 'New dates coming soon (TBA)', events: [{ date: '2020-01-01' }] },
      at('2026-07-22')
    );
    expect(out.lines).toEqual(['New dates coming soon (TBA)']);
    expect(out.isEmpty).toBe(true);
  });

  it('falls back to a default message when the feed defines none', () => {
    expect(cardContent({ events: [] }, at('2026-07-22')).lines).toEqual([
      'New dates coming soon (TBA)',
    ]);
  });

  it('never returns markup, so the caller can render with textContent', () => {
    const out = cardContent(
      { emptyMessage: '<img src=x onerror=alert(1)>', events: [] },
      at('2026-07-22')
    );
    // The string is passed through verbatim; it is the renderer's job never to
    // parse it as HTML. This asserts we do not build markup here.
    expect(out.lines).toEqual(['<img src=x onerror=alert(1)>']);
  });
});
