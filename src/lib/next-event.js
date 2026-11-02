/**
 * Date handling for the "Three Ways to Enter the Garden" cards.
 *
 * Lives in its own module so the selection rules can be unit tested without a
 * browser — the cards themselves just render whatever this returns.
 *
 * Feeds are shared with the ICS endpoint and the registration email worker, so
 * German display text rides along as optional `*_de` keys rather than
 * replacing the English ones.
 *
 * @typedef {{ date: string, time?: string }} GardenEvent
 * @typedef {{ prefix?: string, prefix_de?: string, nextPrefix?: string, nextPrefix_de?: string, events?: GardenEvent[] }} RunningCourse
 * @typedef {{ label?: string, prefix?: string, emptyMessage?: string, label_de?: string, prefix_de?: string, emptyMessage_de?: string, events?: GardenEvent[], current?: RunningCourse }} EventFeed
 * @typedef {'en' | 'de'} Locale
 */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const DAYS_DE = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];

const EMPTY = { en: 'New dates coming soon (TBA)', de: 'Neue Termine folgen bald' };

/**
 * Parses an ISO `YYYY-MM-DD` date at local midnight.
 * Returns null for anything that is not a real date, so a typo in the JSON
 * degrades to "coming soon" instead of rendering "Invalid Date".
 *
 * @param {string} iso
 * @returns {Date | null}
 */
export function parseDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  // Reject values like 2026-02-31 that Date happily rolls over into March.
  const [y, m, day] = iso.split('-').map(Number);
  if (d.getFullYear() !== y || d.getMonth() + 1 !== m || d.getDate() !== day) return null;
  return d;
}

/**
 * Formats a date the way the cards display it: "Wed, 29 Jul 2026" in English,
 * "Mi., 29.07.2026" in German.
 *
 * @param {string} iso
 * @param {Locale} [locale]
 * @returns {string}
 */
export function formatDate(iso, locale = 'en') {
  const d = parseDate(iso);
  if (!d) return iso;
  const day = String(d.getDate()).padStart(2, '0');
  if (locale === 'de') {
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${DAYS_DE[d.getDay()]}, ${day}.${month}.${d.getFullYear()}`;
  }
  return `${DAYS[d.getDay()]}, ${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * A compact date without the year ("Thu 05 Nov", "Do. 05.11."), for the two-line
 * running-course display where every character counts on a narrow card.
 *
 * @param {string} iso
 * @param {Locale} [locale]
 * @returns {string}
 */
function formatShort(iso, locale = 'en') {
  const d = parseDate(iso);
  if (!d) return iso;
  const day = String(d.getDate()).padStart(2, '0');
  if (locale === 'de') return `${DAYS_DE[d.getDay()]} ${day}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
  return `${DAYS[d.getDay()]} ${day} ${MONTHS[d.getMonth()]}`;
}

/** "Thu 05 Nov, 19:30 – 21:00" (or just the date when there is no time). */
const shortLine = (prefix, event, locale) =>
  prefix + formatShort(event.date, locale) + (event.time ? `, ${event.time}` : '');

/**
 * The soonest event on or after `today`. Events in the past are skipped, and
 * the list does not have to be sorted.
 *
 * @param {EventFeed | null | undefined} feed
 * @param {Date} today
 * @returns {GardenEvent | null}
 */
export function nextEvent(feed, today) {
  const cutoff = new Date(today);
  cutoff.setHours(0, 0, 0, 0);

  const upcoming = (feed?.events ?? [])
    .map((e) => ({ event: e, date: parseDate(e?.date) }))
    .filter((x) => x.date !== null && x.date >= cutoff)
    .sort((a, b) => a.date - b.date);

  return upcoming.length ? upcoming[0].event : null;
}

/**
 * What a card should display, as plain strings: the label, and one or two
 * lines of date text. Deliberately not HTML — the caller renders these with
 * textContent, so nothing from the JSON feed can inject markup.
 *
 * @param {EventFeed | null | undefined} feed
 * @param {Date} today
 * @param {Locale} [locale]
 * @param {{ showYear?: boolean, oneLine?: boolean }} [options] `showYear: false` drops the year (the homepage cards); `oneLine` puts the time on the date line
 * @returns {{ label: string | null, lines: string[], isEmpty: boolean, newLine: number | null }}
 */
export function cardContent(feed, today, locale = 'en', { showYear = true, oneLine = false } = {}) {
  const de = locale === 'de';
  const label = (de ? feed?.label_de : undefined) ?? feed?.label ?? null;
  const next = nextEvent(feed, today);

  // A course that is still running next to the one taking registrations: its
  // next class is shown first, then the new course. `current` is display only;
  // the calendar and the email keep reading `events`, the new course alone.
  const running = feed?.current ? nextEvent(feed.current, today) : null;
  if (running) {
    const cur = feed.current;
    const runPrefix = (de ? cur.prefix_de : undefined) ?? cur.prefix ?? '';
    // One line per course: four lines pushed the featured homepage card out of
    // line with its neighbours.
    const lines = [shortLine(runPrefix, running, locale)];
    if (next) {
      const newPrefix = (de ? cur.nextPrefix_de : undefined) ?? cur.nextPrefix ?? '';
      lines.push(shortLine(newPrefix, next, locale));
    }
    // `newLine` is the line that announces the new course, so the page can mark it.
    return { label, lines, isEmpty: false, newLine: next ? 1 : null };
  }

  if (!next) {
    const message = (de ? feed?.emptyMessage_de : feed?.emptyMessage) ?? EMPTY[locale];
    return { label, lines: [message], isEmpty: true, newLine: null };
  }

  const prefix = (de ? feed?.prefix_de : undefined) ?? feed?.prefix ?? '';
  const lines = [prefix + (showYear ? formatDate(next.date, locale) : formatShort(next.date, locale))];
  if (next.time) {
    if (oneLine) lines[0] += `, ${next.time}`;
    else lines.push(next.time);
  }

  return { label, lines, isEmpty: false, newLine: null };
}
