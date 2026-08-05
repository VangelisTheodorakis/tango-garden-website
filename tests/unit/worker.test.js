import { describe, expect, it } from 'vitest';
import worker from '../../workers/registration-email/worker.js';

const env = { SHARED_SECRET: 'test-secret' };

function post(body, { secret = 'test-secret', method = 'POST', raw } = {}) {
  const init = {
    method,
    headers: { 'x-tg-secret': secret, 'content-type': 'application/json' },
  };
  // A GET/HEAD Request may not carry a body.
  if (method !== 'GET' && method !== 'HEAD') {
    init.body = raw !== undefined ? raw : JSON.stringify(body);
  }
  return worker.fetch(new Request('https://worker.example/', init), env);
}

describe('registration-email worker', () => {
  it('renders the confirmation email for a valid request', async () => {
    const res = await post({ name: 'Mia', courseSlug: 'regular-classes' });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.subject).toContain('The Sprouting Sessions');
    expect(data.html).toContain("You're in, Mia");
    expect(data.attachments).toHaveLength(1);
    expect(data.attachments[0].filename).toMatch(/\.ics$/);
    expect(data.attachments[0].content).toContain('BEGIN:VCALENDAR');
  });

  it('defaults to the regular-classes course when no slug is given', async () => {
    const res = await post({ name: 'Sam' });
    expect(res.status).toBe(200);
    expect((await res.json()).html).toContain("You're in, Sam");
  });

  it('rejects a non-POST request', async () => {
    expect((await post({}, { method: 'GET' })).status).toBe(405);
  });

  it('rejects a missing or wrong secret', async () => {
    expect((await post({ name: 'Mia' }, { secret: 'nope' })).status).toBe(401);
    expect((await post({ name: 'Mia' }, { secret: '' })).status).toBe(401);
  });

  it('rejects an unknown course', async () => {
    expect((await post({ name: 'Mia', courseSlug: 'nope' })).status).toBe(400);
  });

  it('rejects prototype-chain property names as a course slug', async () => {
    // Plain-object lookups (courses[slug]) fall through to Object.prototype
    // for these keys, which is itself truthy: a naive `if (!course)` guard
    // would let them through and render a broken email full of "undefined".
    for (const slug of ['__proto__', 'constructor', 'toString', 'hasOwnProperty']) {
      expect((await post({ name: 'Mia', courseSlug: slug })).status, slug).toBe(400);
    }
  });

  it('rejects an invalid JSON body', async () => {
    expect((await post(null, { raw: 'not json' })).status).toBe(400);
  });
});
