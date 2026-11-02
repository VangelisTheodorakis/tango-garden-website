/**
 * GA4 queries for the Gardeners' Area dashboard, and the shaping of their
 * answers into one small JSON report. Pure functions, so they are unit tested
 * without GA4 (tests/unit/gardeners-report.test.js).
 *
 * Steps per course: course page visits -> register_click -> registration_submit.
 * The two events carry `course` = the page slug (beginner-course,
 * growth-sessions); events from before the Course dimension existed, or with
 * any other value, are counted as "unassigned".
 */

export const COURSES = [
  { slug: 'beginner-course', label: 'Beginners' },
  { slug: 'growth-sessions', label: 'Improvers' },
];

/** Periods the dashboard offers, in days, today included. */
export const PERIODS = [7, 28, 90];

/** The weekly trend always covers the last 12 weeks. */
const TREND_DAYS = 84;

const EVENTS = ['register_click', 'registration_submit'];

const liveSite = { filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: 'tangogarden.de' } } };
const ourEvents = { filter: { fieldName: 'eventName', inListFilter: { values: EVENTS } } };
const coursePages = {
  filter: {
    fieldName: 'pagePath',
    stringFilter: { matchType: 'FULL_REGEXP', value: '^(/de)?/pages/(beginner-course|growth-sessions)/?$' },
  },
};
const registerClicks = { filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: 'register_click' } } };
const and = (...expressions) => ({ andGroup: { expressions } });

const range = (days) => [{ startDate: `${days - 1}daysAgo`, endDate: 'today' }];

/**
 * The six GA4 runReport requests, in the order buildReport expects them.
 * registration_submit is sent by the form's Apps Script and has no hostname,
 * so the event queries are not limited to the live site (localhost never
 * reports to GA4 anyway).
 *
 * @param {number} days
 */
export function reportRequests(days) {
  return [
    // 0. Site: visits and bounce rate.
    { dateRanges: range(days), metrics: [{ name: 'sessions' }, { name: 'bounceRate' }], dimensionFilter: liveSite },
    // 1. Visits to the two course pages (EN and DE).
    {
      dateRanges: range(days),
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'sessions' }],
      dimensionFilter: and(liveSite, coursePages),
    },
    // 2. Register clicks and submitted forms, by course. The page path names
    //    the course for clicks sent before the `course` parameter existed.
    {
      dateRanges: range(days),
      dimensions: [{ name: 'eventName' }, { name: 'customEvent:course' }, { name: 'pagePath' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: ourEvents,
    },
    // 3. Visits and bounce rate by channel.
    {
      dateRanges: range(days),
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'bounceRate' }],
      dimensionFilter: liveSite,
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    },
    // 4. Register clicks by channel.
    {
      dateRanges: range(days),
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: and(liveSite, registerClicks),
    },
    // 5. Weekly trend of both events, last 12 weeks.
    {
      dateRanges: range(TREND_DAYS),
      dimensions: [{ name: 'isoYearIsoWeek' }, { name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: ourEvents,
    },
  ];
}

/** ISO week key the way GA4's isoYearIsoWeek writes it: "202645". */
export function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day); // Thursday of this week decides the year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}${String(week).padStart(2, '0')}`;
}

/** The last `count` ISO week keys, oldest first, ending with the current week. */
function lastWeeks(now, count) {
  const keys = [];
  for (let i = count - 1; i >= 0; i--) keys.push(isoWeekKey(new Date(now.getTime() - i * 7 * 86400000)));
  return keys;
}

/** The course a page path belongs to, or null ("/de/pages/growth-sessions" -> "growth-sessions"). */
function courseFromPath(path) {
  const slug = String(path ?? '').match(/^(?:\/de)?\/pages\/([a-z-]+)\/?$/)?.[1];
  return COURSES.some((c) => c.slug === slug) ? slug : null;
}

/** GA4 rows as plain arrays: [[dim1, dim2, ...], [metric1, ...]]. */
const rowsOf = (report) =>
  (report?.rows ?? []).map((r) => [
    (r.dimensionValues ?? []).map((d) => d.value),
    (r.metricValues ?? []).map((m) => Number(m.value) || 0),
  ]);

/**
 * Turns the six GA4 reports into the dashboard's JSON.
 *
 * @param {number} days
 * @param {any[]} reports runReport responses, in reportRequests order
 * @param {Date} [now]
 */
export function buildReport(days, reports, now = new Date()) {
  const [siteR, pagesR, eventsR, channelsR, channelClicksR, weeksR] = reports;

  const [siteRow] = rowsOf(siteR);
  const site = { sessions: siteRow?.[1][0] ?? 0, bounceRate: siteRow?.[1][1] ?? 0 };

  const courses = COURSES.map((c) => ({ ...c, pageSessions: 0, clicks: 0, submits: 0 }));
  const bySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));
  const unassigned = { clicks: 0, submits: 0 };

  for (const [[path], [sessions]] of rowsOf(pagesR)) {
    const slug = courseFromPath(path);
    if (slug) bySlug[slug].pageSessions += sessions;
  }
  for (const [[event, param, path], [count]] of rowsOf(eventsR)) {
    const key = event === 'register_click' ? 'clicks' : event === 'registration_submit' ? 'submits' : null;
    if (!key) continue;
    const course = Object.hasOwn(bySlug, param) ? param : courseFromPath(path);
    if (course) bySlug[course][key] += count;
    else unassigned[key] += count;
  }

  const clicksByChannel = Object.fromEntries(rowsOf(channelClicksR).map(([[ch], [n]]) => [ch, n]));
  const channels = rowsOf(channelsR).map(([[channel], [sessions, bounceRate]]) => ({
    channel,
    sessions,
    bounceRate,
    clicks: clicksByChannel[channel] ?? 0,
  }));

  const weekMap = new Map();
  for (const [[week, event], [count]] of rowsOf(weeksR)) {
    const w = weekMap.get(week) ?? { week, clicks: 0, submits: 0 };
    if (event === 'register_click') w.clicks += count;
    if (event === 'registration_submit') w.submits += count;
    weekMap.set(week, w);
  }
  // Every one of the 12 weeks, so a quiet week shows as 0 instead of vanishing.
  const weeks = lastWeeks(now, TREND_DAYS / 7).map((week) => weekMap.get(week) ?? { week, clicks: 0, submits: 0 });

  return { days, generatedAt: now.toISOString(), site, courses, unassigned, channels, weeks };
}
