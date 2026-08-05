/**
 * Course descriptors for the calendar (.ics) feeds.
 *
 * The dated occurrences live in the JSON feeds under public/assets/data/ (the
 * same files the homepage pathway cards read), so a schedule change in one place
 * updates both the cards and the calendar. Everything the feeds do NOT carry
 * (title, location, timezone) lives here.
 *
 * Address is the studio in src/components/StructuredData.astro; the venue is in
 * Cologne, so the timezone is Europe/Berlin.
 *
 * `location` is the full postal string used in the calendar; `venue` is the
 * short name shown in the email; `mapsUrl` is the Google Maps pin (a plain link,
 * clicked by the reader, never an auto-loaded embed).
 *
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   description: string,
 *   location: string,
 *   venue: string,
 *   mapsUrl: string,
 *   timezone: string,
 *   feed: string,
 * }} Course
 */

/** @type {Course} */
export const regularClasses = {
  slug: 'regular-classes',
  title: 'The Sprouting Sessions (Beginner Level)',
  description:
    'Weekly beginner Argentine Tango course at Tango Garden Cologne. No partner needed, come as you are.',
  location: 'Yoga Drop Studio, Thürmchenswall 21, 50668 Köln, Germany',
  venue: 'Tango Garden Venue (Yogadrop)',
  mapsUrl: 'https://maps.app.goo.gl/6kEkUYzG6CVq1AVp7',
  timezone: 'Europe/Berlin',
  feed: '/assets/data/regular-classes.json',
};

/** Registry keyed by slug, so a sender can resolve a course by its slug. */
export const courses = {
  [regularClasses.slug]: regularClasses,
};
