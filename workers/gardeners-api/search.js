/**
 * What people searched on Google before landing on the site (Search Console).
 * Google leaves out rare searches to protect privacy, and its numbers arrive
 * about two days late.
 */

const isoDate = (d) => d.toISOString().slice(0, 10);

export function searchRequest(days, now = new Date()) {
  return {
    startDate: isoDate(new Date(now.getTime() - (days - 1) * 86400000)),
    endDate: isoDate(now),
    dimensions: ['query'],
    rowLimit: 15,
  };
}

/** Search Console rows -> [{ query, clicks, impressions, position }]. */
export function buildSearch(answer) {
  return (answer?.rows ?? []).map((r) => ({
    query: r.keys?.[0] ?? '',
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    position: Math.round((r.position ?? 0) * 10) / 10,
  }));
}

export async function fetchSearch(site, token, days) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(searchRequest(days)),
    }
  );
  if (!res.ok) throw new Error(`Search Console ${res.status}: ${await res.text()}`);
  return buildSearch(await res.json());
}
