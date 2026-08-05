/**
 * Registration confirmation email for a course.
 *
 * A pure function so it can be rendered anywhere: the Phase 3 Cloudflare Worker
 * that sends the mail, and the unit tests, both call this. It reuses the same
 * course descriptor and calendar links as the .ics endpoint, so the email and
 * the calendar can never drift apart.
 *
 * This is the Evey/Shopify ticket email rebuilt in-repo, with the ticket/QR,
 * PDF/Wallet downloads and Shopify links removed (registration is via Google
 * Form now, not a Shopify checkout), the logo self-hosted, and the calendar
 * buttons pointed at our own feed.
 *
 * @typedef {import('../data/courses.js').Course} Course
 * @typedef {import('./next-event.js').GardenEvent} GardenEvent
 */

import { parseDate, formatDate } from './next-event.js';
import { buildIcs, googleCalendarUrl } from './ics.js';

const DAYS_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

/** A filename-safe slug, e.g. "the-sprouting-sessions-beginner-level". */
function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Escapes a value for interpolation into HTML text/attributes. */
function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** The sorted, valid occurrences of a feed, soonest first. */
function sortedEvents(events) {
  return (events ?? [])
    .map((e) => ({ event: e, date: parseDate(e?.date) }))
    .filter((x) => x.date)
    .sort((a, b) => a.date - b.date)
    .map((x) => x.event);
}

/**
 * A human summary of the schedule, e.g.
 * "Thursdays, 10 Sep to 26 Nov 2026 (12 classes)".
 * Falls back to a single date when there is only one occurrence.
 */
function scheduleSummary(sorted) {
  if (!sorted.length) return 'Dates to be announced';
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const weekday = DAYS_LONG[parseDate(first.date).getDay()];
  if (sorted.length === 1) return `${formatDate(first.date)}`;
  // formatDate already leads with the weekday ("Thu, 10 Sep 2026"); strip it
  // from the range endpoints so we do not repeat "Thursdays, Thu, ...".
  const dateOnly = (iso) => formatDate(iso).replace(/^\w{3}, /, '');
  return `${weekday}s, ${dateOnly(first.date)} to ${dateOnly(last.date)} (${sorted.length} classes)`;
}

/**
 * Builds the confirmation email.
 *
 * @param {{
 *   name?: string,
 *   course: Course,
 *   events: GardenEvent[],
 *   baseUrl?: string,
 *   today?: Date,
 * }} params
 * @returns {{
 *   subject: string,
 *   html: string,
 *   attachments: { filename: string, content: string, contentType: string }[],
 * }}
 */
export function confirmationEmail({ name, course, events, baseUrl = 'https://tangogarden.de' }) {
  const origin = baseUrl.replace(/\/$/, '');
  const sorted = sortedEvents(events);
  const weeklyTime = sorted.find((e) => e.time)?.time ?? '';
  const schedule = scheduleSummary(sorted);
  const icsUrl = `${origin}/calendar/${course.slug}.ics`;
  const googleUrl = googleCalendarUrl(course, events);
  const logoUrl = `${origin}/images/email-logo.png`;

  const safeName = htmlEscape((name ?? '').trim());
  const safeTitle = htmlEscape(course.title);
  const safeLocation = htmlEscape(course.location);
  const safeVenue = htmlEscape(course.venue ?? course.location);
  const mapsUrl = course.mapsUrl ? htmlEscape(course.mapsUrl) : '';

  const subject = `You're registered: ${course.title}`;

  const attendeeRow = safeName
    ? `<div class="event-info-row">
                        <div class="event-info-label">🎫 Attendee</div>
                        <div class="event-info-value">${safeName}</div>
                    </div>`
    : '';

  const timeRow = weeklyTime
    ? `<div class="event-info-row">
                        <div class="event-info-label">🕖 Time</div>
                        <div class="event-info-value">${htmlEscape(weeklyTime)}</div>
                    </div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} - Registration Confirmed</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #F5F1E8;
            -webkit-font-smoothing: antialiased;
        }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        .email-wrapper { width: 100% !important; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #2D5016 0%, #5a8a2d 100%); padding: 30px 20px; text-align: center; color: white; }
        .header .logo { max-width: 180px; height: auto; margin-bottom: 12px; }
        .header h1 { font-size: 26px; font-weight: 700; line-height: 1.2; }
        .content { padding: 20px; }
        .welcome-message { background: #F5F1E8; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center; }
        .welcome-message h2 { font-size: 22px; color: #2D5016; margin-bottom: 10px; font-weight: 700; }
        .welcome-message p { font-size: 16px; color: #333; }
        .event-details { background: white; border: 2px solid #F5F1E8; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .event-header { text-align: center; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; margin-bottom: 15px; }
        .event-header h2 { font-size: 20px; color: #2D5016; font-weight: 700; }
        .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #2D5016; font-weight: 600; margin-bottom: 15px; }
        .event-info-grid { display: table; width: 100%; }
        .event-info-row { display: table-row; }
        .event-info-label { display: table-cell; padding: 8px 0; font-size: 14px; color: #718096; width: 32%; }
        .event-info-value { display: table-cell; padding: 8px 0; font-size: 15px; color: #2D5016; font-weight: 600; }
        .next-steps { background: linear-gradient(135deg, #2D5016 0%, #5a8a2d 100%); color: white; border-radius: 12px; padding: 25px 20px; margin: 20px 0; }
        .next-steps h2 { font-size: 22px; margin-bottom: 15px; }
        .next-steps ul { list-style: none; padding: 0; margin: 0; }
        .next-steps li { margin-bottom: 12px; padding-left: 25px; position: relative; font-size: 15px; line-height: 1.5; }
        .next-steps li:last-child { margin-bottom: 0; }
        .next-steps li::before { content: "✓"; position: absolute; left: 0; font-weight: bold; }
        .calendar-section { background: #F5F1E8; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
        .calendar-section h3 { font-size: 12px; color: #2D5016; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1.5px; }
        .calendar-section p.hint { font-size: 13px; color: #718096; margin-bottom: 14px; }
        .calendar-links { display: flex; flex-wrap: wrap; }
        .calendar-link { display: inline-block; background: #2D5016; color: white !important; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-weight: 600; margin: 0 8px 8px 0; }
        .info-section { background: #F5F1E8; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
        .info-section h3 { font-size: 12px; color: #2D5016; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1.5px; }
        .info-section p { font-size: 15px; line-height: 1.6; }
        .info-section a { color: #2D5016; text-decoration: none; font-weight: 600; }
        .footer { background-color: #2D5016; color: #cbd5c0; text-align: center; padding: 25px 20px; font-size: 14px; }
        .footer p { margin: 0 0 10px 0; line-height: 1.6; }
        .footer a { color: #7CAA2D; text-decoration: none; }
        @media screen and (max-width: 480px) {
            .header { padding: 25px 15px; }
            .content { padding: 15px; }
            .welcome-message, .event-details, .next-steps, .info-section, .calendar-section { padding: 15px; }
            .event-info-grid, .event-info-row, .event-info-label, .event-info-value { display: block; width: 100%; }
            .event-info-label { padding-bottom: 0; }
            .calendar-links { flex-direction: column; }
            .calendar-link { text-align: center; margin-right: 0; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <img src="${logoUrl}" alt="Tango Garden" class="logo" width="180">
            <h1>Welcome to Tango Garden</h1>
        </div>
        <div class="content">
            <div class="welcome-message">
                <h2>You're in${safeName ? `, ${safeName}` : ''}</h2>
                <p>Thanks for registering for ${safeTitle}. Your place is confirmed and we're excited to see you.</p>
            </div>

            <div class="event-details">
                <div class="event-header"><h2>${safeTitle}</h2></div>
                <div class="section-title">Course Details</div>
                <div class="event-info-grid">
                    <div class="event-info-row">
                        <div class="event-info-label">📅 Dates</div>
                        <div class="event-info-value">${htmlEscape(schedule)}</div>
                    </div>
                    ${timeRow}
                    <div class="event-info-row">
                        <div class="event-info-label">📍 Location</div>
                        <div class="event-info-value">${safeLocation}</div>
                    </div>
                    ${attendeeRow}
                </div>
            </div>

            <div class="calendar-section">
                <h3>📅 Add the classes to your calendar</h3>
                <p class="hint">The calendar file is attached to this email. Open it to add every class at once, or use a button below.</p>
                <div class="calendar-links">
                    ${googleUrl ? `<a href="${htmlEscape(googleUrl)}" class="calendar-link" target="_blank" rel="noopener">Google Calendar</a>` : ''}
                    <a href="${icsUrl}" class="calendar-link">Apple / Outlook (.ics)</a>
                </div>
            </div>

            <div class="next-steps">
                <h2>What happens next</h2>
                <ul>
                    <li>Save this email so you have the dates and location handy.</li>
                    <li>Arrive 10 minutes early to your first class.</li>
                    <li>Wear comfortable clothes and clean socks or indoor shoes.</li>
                    <li>Bring an open mind and leave perfection at the door.</li>
                </ul>
            </div>

            <div class="info-section">
                <h3>📍 Where to find us</h3>
                <p><strong>${safeVenue}</strong>${mapsUrl ? `<br><a href="${mapsUrl}" target="_blank" rel="noopener">Get Directions</a>` : ''}</p>
            </div>
        </div>
        <div class="footer">
            <p><strong>Tango Garden</strong><br>${mapsUrl ? `<a href="${mapsUrl}" target="_blank" rel="noopener">Thürmchenswall 21, 50668 Cologne, Germany</a>` : 'Thürmchenswall 21, 50668 Cologne, Germany'}</p>
            <p>Questions? Just reply to this email or write to <a href="mailto:hello@tangogarden.de">hello@tangogarden.de</a></p>
            <p>See you in the garden,<br><strong>Vangelis &amp; The Tango Garden Team</strong></p>
        </div>
    </div>
</body>
</html>`;

  const attachments = [
    {
      filename: `${slugify(course.title)}.ics`,
      content: buildIcs(course, events),
      contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
    },
  ];

  return { subject, html, attachments };
}
