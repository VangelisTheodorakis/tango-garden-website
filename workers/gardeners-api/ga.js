/**
 * Read-only Google access (GA4, Sheets, Search Console) with a Google service account key (GA_SA_KEY secret,
 * the JSON file Google gives you). The key signs a short-lived JWT, which
 * Google swaps for an access token; the token is reused until shortly before
 * it expires.
 */

// Read-only: GA4, the form response sheets, Search Console.
const SCOPE = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
].join(' ');
let tokenCache = { token: null, exp: 0 };

const b64url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
const b64urlText = (text) => b64url(new TextEncoder().encode(text));

function pemToDer(pem) {
  const body = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  return Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
}

export async function accessToken(saKeyJson) {
  if (tokenCache.token && tokenCache.exp - Date.now() > 60_000) return tokenCache.token;
  const sa = JSON.parse(saKeyJson);
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64urlText(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64urlText(
    JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })
  )}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToDer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${b64url(signature)}`,
    }),
  });
  if (!res.ok) throw new Error(`Google token ${res.status}: ${await res.text()}`);
  const data = await res.json();
  tokenCache = { token: data.access_token, exp: Date.now() + data.expires_in * 1000 };
  return tokenCache.token;
}

/** Runs the requests in batches of five (the batchRunReports limit). */
export async function runReports(propertyId, token, requests) {
  const batches = [];
  for (let i = 0; i < requests.length; i += 5) batches.push(requests.slice(i, i + 5));
  const results = await Promise.all(
    batches.map(async (batch) => {
      const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ requests: batch }),
      });
      if (!res.ok) throw new Error(`GA4 ${res.status}: ${await res.text()}`);
      return (await res.json()).reports ?? [];
    })
  );
  return results.flat();
}
