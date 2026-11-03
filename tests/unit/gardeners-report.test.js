import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { buildReport, isoWeekKey, reportRequests } from '../../workers/gardeners-api/report.js';
import { verifyAccess } from '../../workers/gardeners-api/access.js';
import { buildRegistrations, parseSheet, roleOf } from '../../workers/gardeners-api/registrations.js';
import { buildSearch, searchRequest } from '../../workers/gardeners-api/search.js';
import worker from '../../workers/gardeners-api/worker.js';

const row = (dims, metrics) => ({
  dimensionValues: dims.map((value) => ({ value })),
  metricValues: metrics.map((m) => ({ value: String(m) })),
});

describe('isoWeekKey', () => {
  it('matches GA4 isoYearIsoWeek, including the year boundary', () => {
    expect(isoWeekKey(new Date('2026-11-02T12:00:00Z'))).toBe('202645');
    expect(isoWeekKey(new Date('2027-01-01T12:00:00Z'))).toBe('202653'); // Fri, still ISO 2026
    expect(isoWeekKey(new Date('2027-01-04T12:00:00Z'))).toBe('202701');
  });
});

describe('reportRequests', () => {
  it('asks for nine reports over the chosen period, today included', () => {
    const reqs = reportRequests(28);
    expect(reqs).toHaveLength(9);
    expect(reqs[0].dateRanges).toEqual([{ startDate: '27daysAgo', endDate: 'today' }]);
  });

  it('does not limit the event queries to the website host', () => {
    // registration_submit comes from Apps Script and has no hostname.
    expect(JSON.stringify(reportRequests(7)[2].dimensionFilter)).not.toContain('hostName');
  });
});

describe('buildReport', () => {
  const now = new Date('2026-11-02T12:00:00Z');
  const reports = [
    { rows: [row([], [1200, 0.52])] },
    {
      rows: [
        row(['/pages/beginner-course'], [300]),
        row(['/de/pages/beginner-course'], [20]),
        row(['/pages/growth-sessions'], [80]),
      ],
    },
    {
      rows: [
        row(['register_click', 'beginner-course', '/pages/beginner-course'], [25]),
        // An older click without the course parameter: the page names it.
        row(['register_click', '(not set)', '/de/pages/beginner-course'], [5]),
        row(['registration_submit', 'beginner-course', '(not set)'], [12]),
        row(['register_click', 'growth-sessions', '/pages/growth-sessions'], [8]),
        row(['registration_submit', 'growth-sessions', '(not set)'], [3]),
        row(['register_click', '(not set)', '/pages/contact'], [5]),
        row(['registration_submit', 'regular-classes', '(not set)'], [1]),
      ],
    },
    { rows: [row(['Organic Social'], [500, 0.4]), row(['Direct'], [400, 0.6])] },
    { rows: [row(['Organic Social'], [20])] },
    { rows: [row(['202645', 'register_click'], [4]), row(['202645', 'registration_submit'], [2])] },
    { rows: [row(['(not set)'], [50]), row(['What should I wear?'], [9]), row(['Do I need to bring a partner?'], [7])] },
    { rows: [row(['/pages/contact'], [6]), row(['/'], [3])] },
    {
      rows: [
        row(['read_expect', 'beginner-course'], [200]),
        row(['read_prices', 'beginner-course'], [120]),
        row(['read_end', 'growth-sessions'], [10]),
        row(['read_prices', 'garden-practica'], [7]),
      ],
    },
  ];
  const r = buildReport(28, reports, now);

  it('adds up each course across both languages', () => {
    expect(r.courses).toEqual([
      {
        slug: 'beginner-course',
        label: 'Beginners',
        pageSessions: 320,
        clicks: 30,
        submits: 12,
        lang: { en: { pageSessions: 300, clicks: 25 }, de: { pageSessions: 20, clicks: 5 } },
        read: { expect: 200, prices: 120, faq: 0, end: 0 },
      },
      {
        slug: 'growth-sessions',
        label: 'Improvers',
        pageSessions: 80,
        clicks: 8,
        submits: 3,
        lang: { en: { pageSessions: 80, clicks: 8 }, de: { pageSessions: 0, clicks: 0 } },
        read: { expect: 0, prices: 0, faq: 0, end: 10 },
      },
    ]);
  });

  it('lists the opened FAQ questions, without the unrecorded ones', () => {
    expect(r.faq).toEqual([
      { question: 'What should I wear?', count: 9 },
      { question: 'Do I need to bring a partner?', count: 7 },
    ]);
  });

  it('adds up WhatsApp clicks and keeps the pages', () => {
    expect(r.whatsapp).toEqual({ total: 9, pages: [{ path: '/pages/contact', count: 6 }, { path: '/', count: 3 }] });
  });

  it('counts events without a known course as unassigned', () => {
    expect(r.unassigned).toEqual({ clicks: 5, submits: 1 });
  });

  it('joins register clicks onto the channel rows', () => {
    expect(r.channels).toEqual([
      { channel: 'Organic Social', sessions: 500, bounceRate: 0.4, clicks: 20 },
      { channel: 'Direct', sessions: 400, bounceRate: 0.6, clicks: 0 },
    ]);
  });

  it('lists all 12 weeks, oldest first, zero where nothing happened', () => {
    expect(r.weeks).toHaveLength(12);
    expect(r.weeks.at(-1)).toEqual({ week: '202645', clicks: 4, submits: 2 });
    expect(r.weeks[0]).toEqual({ week: '202634', clicks: 0, submits: 0 });
  });

  it('copes with empty GA4 answers', () => {
    const empty = buildReport(7, [{}, {}, {}, {}, {}, {}, {}, {}, {}], now);
    expect(empty.site).toEqual({ sessions: 0, bounceRate: 0 });
    expect(empty.courses.every((c) => c.clicks === 0)).toBe(true);
    expect(empty.faq).toEqual([]);
    expect(empty.whatsapp).toEqual({ total: 0, pages: [] });
  });
});

describe('registrations', () => {
  // Sheets date serials: 46266 = 1 Sep 2026, 46327 = 1 Nov 2026.
  const SEP_1 = 46266;
  const NOV_1 = 46327;
  const header = ['Timestamp', 'Name', 'Email address', 'Which role do you want to dance?'];
  const beginners = [
    header,
    [SEP_1, 'Old', 'ana@example.com', 'Leader'], // earlier round
    [NOV_1, 'Ana', 'Ana@Example.com ', 'Follower'], // returning, answer changed
    [NOV_1 + 1, 'Ben', 'ben@example.com', 'Leader'],
    [NOV_1 + 2, 'Ben', 'ben@example.com', 'Both / switch'], // submitted twice: latest counts
    [NOV_1 + 3, 'Cem', 'cem@example.com', ''],
  ];
  const improvers = [header, [NOV_1, 'Dia', 'ana@example.com', 'Leader & Follower']];
  const rounds = {
    'beginner-course': { from: '2026-09-10', spots: 20 },
    'growth-sessions': { from: '2026-01-01', spots: 20 },
  };

  it('reads the role answer in English or German', () => {
    expect(roleOf('Leader')).toBe('leader');
    expect(roleOf('Follower')).toBe('follower');
    expect(roleOf('Both roles')).toBe('both');
    expect(roleOf('Führende Rolle')).toBe('leader');
    expect(roleOf('Leader & Follower')).toBe('both');
    expect(roleOf('')).toBe('unknown');
  });

  it('finds the email and role columns by their question', () => {
    expect(parseSheet(beginners)[1]).toMatchObject({ email: 'ana@example.com', role: 'follower' });
  });

  it('counts each person once, by role, and spots returning students', () => {
    const r = buildRegistrations(rounds, { 'beginner-course': beginners, 'growth-sessions': improvers });
    expect(r['beginner-course']).toEqual({
      from: '2026-09-10',
      spots: 20,
      registered: 3,
      roles: { leader: 0, follower: 1, both: 1, unknown: 1 },
      returning: 1,
    });
    // Ana did the September beginners round, so she returns for the improvers.
    expect(r['growth-sessions']).toMatchObject({ registered: 1, roles: { both: 1 }, returning: 1 });
  });

  it('leaves a course without a sheet empty', () => {
    expect(buildRegistrations(rounds, { 'beginner-course': beginners })['growth-sessions']).toBeNull();
  });

  it('never puts names or emails in the result', () => {
    const text = JSON.stringify(buildRegistrations(rounds, { 'beginner-course': beginners, 'growth-sessions': improvers }));
    expect(text).not.toMatch(/example\.com|Ana|Ben/);
  });
});

describe('search', () => {
  it('asks Search Console for the period, by search', () => {
    expect(searchRequest(28, new Date('2026-11-04T12:00:00Z'))).toEqual({
      startDate: '2026-10-08',
      endDate: '2026-11-04',
      dimensions: ['query'],
      rowLimit: 15,
    });
  });

  it('keeps search, clicks, impressions and a rounded position', () => {
    expect(buildSearch({ rows: [{ keys: ['tango cologne'], clicks: 3, impressions: 90, position: 4.26 }] })).toEqual([
      { query: 'tango cologne', clicks: 3, impressions: 90, position: 4.3 },
    ]);
    expect(buildSearch({})).toEqual([]);
  });
});

describe('Access check', () => {
  const env = {
    ACCESS_TEAM_DOMAIN: 'team.cloudflareaccess.com',
    ACCESS_AUD: 'aud-123',
    ALLOWED_EMAILS: 'Allowed@Example.com, other@example.com',
  };
  const b64url = (bytes) =>
    Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  // One key pair for the whole group: access.js caches the team keys for an
  // hour, so a fresh pair per test would make every later token fail on the
  // signature, and a "rejects X" test would pass for the wrong reason.
  let privateKey;
  beforeAll(async () => {
    const pair = await crypto.subtle.generateKey(
      { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['sign', 'verify']
    );
    privateKey = pair.privateKey;
    const jwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid: 'k1' };
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ keys: [jwk] })));
  });
  afterAll(() => vi.unstubAllGlobals());

  async function signedToken(payload) {
    const h = b64url(Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'k1' })));
    const p = b64url(Buffer.from(JSON.stringify(payload)));
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, new TextEncoder().encode(`${h}.${p}`));
    return `${h}.${p}.${b64url(new Uint8Array(sig))}`;
  }
  const req = (token) => new Request('https://tangogarden.de/x', { headers: token ? { 'cf-access-jwt-assertion': token } : {} });
  const good = (over = {}) => ({
    aud: ['aud-123'],
    iss: 'https://team.cloudflareaccess.com',
    exp: Math.floor(Date.now() / 1000) + 600,
    email: 'allowed@example.com',
    ...over,
  });


  it('lets an allowed, correctly signed user in', async () => {
    expect(await verifyAccess(req(await signedToken(good())), env)).toBe('allowed@example.com');
  });

  it('rejects an email that is not on the list', async () => {
    expect(await verifyAccess(req(await signedToken(good({ email: 'stranger@example.com' }))), env)).toBeNull();
  });

  it('rejects a wrong audience, wrong issuer or expired token', async () => {
    expect(await verifyAccess(req(await signedToken(good({ aud: ['other'] }))), env)).toBeNull();
    expect(await verifyAccess(req(await signedToken(good({ iss: 'https://evil.example' }))), env)).toBeNull();
    expect(await verifyAccess(req(await signedToken(good({ exp: 1 }))), env)).toBeNull();
  });

  it('rejects a tampered token', async () => {
    const token = await signedToken(good());
    const [h, , s] = token.split('.');
    const forged = b64url(Buffer.from(JSON.stringify(good({ email: 'other@example.com', exp: 9999999999 }))));
    expect(await verifyAccess(req(`${h}.${forged}.${s}`), env)).toBeNull();
  });

  it('rejects a request without the Access header', async () => {
    expect(await verifyAccess(req(null), env)).toBeNull();
  });

  it('makes the Worker answer 401 without Access', async () => {
    const res = await worker.fetch(new Request('https://tangogarden.de/gardeners-area/api/report?days=28'), env, {});
    expect(res.status).toBe(401);
    expect(res.headers.get('cache-control')).toBe('private, no-store');
  });
});
