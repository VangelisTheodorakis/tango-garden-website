/**
 * Gardeners' Area data: GET /gardeners-area/api/report?days=7|28|90
 *
 * Runs on the route tangogarden.de/gardeners-area/api/*, in front of the
 * site's own (assets-only) Worker. Cloudflare Access guards the whole
 * /gardeners-area path; verifyAccess checks again here. Answers are cached for
 * 10 minutes per period, so opening the dashboard repeatedly does not use up
 * the GA4 API quota.
 *
 * Secrets (wrangler secret put … --config ./wrangler.toml):
 *   GA_SA_KEY           service account key JSON (GA4 Viewer on the property)
 *   ACCESS_AUD          the Access application's "Application Audience (AUD) Tag"
 *   ALLOWED_EMAILS      comma-separated, same list as the Access policy
 * Vars (wrangler.toml): GA_PROPERTY_ID, ACCESS_TEAM_DOMAIN, GSC_SITE, COURSE_ROUNDS
 *
 * GA4 is required. Search Console and the response sheets are extras: if one
 * fails (not shared yet, say), the report still answers, with that part null.
 */

import { verifyAccess } from './access.js';
import { accessToken, runReports } from './ga.js';
import { buildRegistrations, fetchSheet } from './registrations.js';
import { PERIODS, buildReport, reportRequests } from './report.js';
import { fetchSearch } from './search.js';

const CACHE_SECONDS = 600;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Private data: never stored by browsers or shared caches.
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== '/gardeners-area/api/report') return json({ error: 'not found' }, 404);
    if (request.method !== 'GET') return json({ error: 'method not allowed' }, 405);

    if (!(await verifyAccess(request, env))) return json({ error: 'unauthorized' }, 401);

    const days = Number(url.searchParams.get('days') ?? 28);
    if (!PERIODS.includes(days)) return json({ error: `days must be one of ${PERIODS.join(', ')}` }, 400);

    // Internal cache key: not a real URL anyone can request.
    const cacheKey = new Request(`https://gardeners-cache.internal/report/${days}`);
    const cached = await caches.default.match(cacheKey);
    if (cached) return json(await cached.json());

    try {
      const token = await accessToken(env.GA_SA_KEY);
      const rounds = env.COURSE_ROUNDS ?? {};
      const withSheets = Object.entries(rounds).filter(([, r]) => r.sheet);
      const [reports, search, sheets] = await Promise.allSettled([
        runReports(env.GA_PROPERTY_ID, token, reportRequests(days)),
        env.GSC_SITE ? fetchSearch(env.GSC_SITE, token, days) : Promise.reject(new Error('GSC_SITE not set')),
        Promise.all(withSheets.map(async ([slug, r]) => [slug, await fetchSheet(r.sheet, token)])),
      ]);
      if (reports.status === 'rejected') throw reports.reason;
      for (const extra of [search, sheets]) if (extra.status === 'rejected') console.error(extra.reason);
      const report = {
        ...buildReport(days, reports.value),
        search: search.status === 'fulfilled' ? search.value : null,
        registrations:
          sheets.status === 'fulfilled' && withSheets.length
            ? buildRegistrations(rounds, Object.fromEntries(sheets.value))
            : null,
      };
      ctx.waitUntil(
        caches.default.put(
          cacheKey,
          new Response(JSON.stringify(report), { headers: { 'cache-control': `max-age=${CACHE_SECONDS}` } })
        )
      );
      return json(report);
    } catch (err) {
      console.error(err);
      return json({ error: 'Could not load the numbers from Google Analytics.' }, 502);
    }
  },
};
