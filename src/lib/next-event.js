/**
 * Date handling for the "Three Ways to Enter the Garden" cards.
 *
 * Lives in its own module so the selection rules can be unit tested without a
 * browser — the cards themselves just render whatever this returns.
 *
 * @typedef {{ date: string, time?: string }} GardenEvent
 * @typedef {{ label?: string, prefix?: string, emptyMessage?: string, events?: GardenEvent[] }} EventFeed
 */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

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
 * Formats a date the way the cards display it, e.g. "Wed, 29 Jul 2026".
 *
 * @param {string} iso
 * @returns {string}
 */
export function formatDate(iso) {
  const d = parseDate(iso);
  if (!d) return iso;
  const day = String(d.getDate()).padStart(2, '0');
  return `${DAYS[d.getDay()]}, ${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

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
 * @returns {{ label: string | null, lines: string[], isEmpty: boolean }}
 */
export function cardContent(feed, today) {
  const label = feed?.label ?? null;
  const next = nextEvent(feed, today);

  if (!next) {
    return {
      label,
      lines: [feed?.emptyMessage ?? 'New dates coming soon (TBA)'],
      isEmpty: true,
    };
  }

  const lines = [(feed?.prefix ?? '') + formatDate(next.date)];
  if (next.time) lines.push(next.time);

  return { label, lines, isEmpty: false };
}
