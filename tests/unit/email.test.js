import { describe, expect, it } from 'vitest';
import { confirmationEmail } from '../../src/lib/email.js';

const course = {
  slug: 'regular-classes',
  title: 'The Sprouting Sessions (Beginner Level)',
  description: 'Weekly beginner Argentine Tango course. No partner needed, come as you are.',
  location: 'Yoga Drop Studio, Thürmchenswall 21, 50668 Köln, Germany',
  venue: 'Tango Garden Venue (Yogadrop)',
  mapsUrl: 'https://maps.app.goo.gl/6kEkUYzG6CVq1AVp7',
  timezone: 'Europe/Berlin',
  feed: '/assets/data/regular-classes.json',
};

const events = [
  { date: '2026-09-10', time: '19:30 – 21:00' },
  { date: '2026-09-17', time: '19:30 – 21:00' },
  { date: '2026-11-26', time: '19:30 – 21:00' },
];

const render = (over = {}) =>
  confirmationEmail({ name: 'Mia', course, events, ...over });

describe('confirmationEmail', () => {
  it('names the course in the subject', () => {
    expect(render().subject).toBe("You're registered: The Sprouting Sessions (Beginner Level)");
  });

  it('greets the registrant by name', () => {
    expect(render().html).toContain("You're in, Mia");
  });

  it('omits the name gracefully when none is given', () => {
    const { html } = render({ name: undefined });
    expect(html).toContain("You're in</h2>");
    expect(html).not.toContain('>Attendee<');
  });

  it('uses no astral-plane emoji (surrogate pairs corrupt in GmailApp)', () => {
    // Confirmed in production: Apps Script's GmailApp.sendEmail garbles
    // characters above U+FFFF (calendar/clock/pin/ticket emoji all showed as
    // replacement boxes) while lower-plane characters like umlauts survive
    // intact. So no code point outside the Basic Multilingual Plane belongs
    // in this template.
    const { html } = render();
    for (const char of html) {
      expect(char.codePointAt(0), `astral-plane character: ${char}`).toBeLessThanOrEqual(0xffff);
    }
  });

  it('summarises the whole schedule, without doubling the weekday', () => {
    expect(render().html).toContain('Thursdays, 10 Sep 2026 to 26 Nov 2026 (3 classes)');
  });

  it('offers both an ics feed and a Google Calendar link', () => {
    const { html } = render();
    expect(html).toContain('href="https://tangogarden.de/calendar/regular-classes.ics"');
    expect(html).toContain('https://calendar.google.com/calendar/render?');
  });

  it('builds calendar links against a custom base URL', () => {
    expect(render({ baseUrl: 'http://localhost:3001' }).html).toContain(
      'href="http://localhost:3001/calendar/regular-classes.ics"'
    );
  });

  it('links the venue and footer address to the Google Maps pin', () => {
    const { html } = render();
    // "Where to find us": short venue name + a Get Directions link.
    expect(html).toContain('Tango Garden Venue (Yogadrop)');
    expect(html).toContain(
      '<a href="https://maps.app.goo.gl/6kEkUYzG6CVq1AVp7" target="_blank" rel="noopener">Get Directions</a>'
    );
    // Footer address is the same pin.
    expect(html).toContain(
      '<a href="https://maps.app.goo.gl/6kEkUYzG6CVq1AVp7" target="_blank" rel="noopener">Thürmchenswall 21, 50668 Cologne, Germany</a>'
    );
  });

  it('self-hosts the logo (no Shopify CDN)', () => {
    const { html } = render();
    expect(html).toContain('/images/email-logo.png');
    expect(html.toLowerCase()).not.toContain('shopify');
  });

  it('drops the ticket, QR and download sections of the old email', () => {
    const html = render().html.toLowerCase();
    expect(html).not.toContain('eveyevents');
    expect(html).not.toContain('qr');
    expect(html).not.toContain('apple wallet');
    expect(html).not.toContain('.pkpass');
  });

  it('contains no em dash', () => {
    const { html, attachments } = render();
    expect(html).not.toContain('—');
    expect(attachments[0].content).not.toContain('—');
  });

  it('attaches the semester .ics', () => {
    const { attachments, html } = render();
    expect(attachments).toHaveLength(1);
    const ics = attachments[0];
    expect(ics.filename).toBe('the-sprouting-sessions-beginner-level.ics');
    expect(ics.contentType).toMatch(/^text\/calendar/);
    expect(ics.content).toContain('BEGIN:VCALENDAR');
    expect(ics.content.match(/BEGIN:VEVENT/g)).toHaveLength(3);
    // The body should tell the reader the file is attached.
    expect(html).toContain('attached to this email');
  });

  it('escapes HTML in the registrant name', () => {
    const { html } = render({ name: '<script>x</script>' });
    expect(html).not.toContain('<script>x</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
