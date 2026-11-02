/**
 * Second lock behind Cloudflare Access. Access already stops anyone not on the
 * list at the door; this check makes sure the Worker answers only requests
 * that really came through Access, for an allowed email, even if the Access
 * rule were ever removed or misconfigured.
 *
 * Access signs every request it lets through with a JWT in the
 * Cf-Access-Jwt-Assertion header. We verify its signature against the team's
 * public keys, its audience (the Access application), issuer and expiry, and
 * that its email is in ALLOWED_EMAILS.
 */

const certCache = { keys: null, at: 0 };

const b64urlToBytes = (s) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
};
const b64urlToJson = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

async function teamKeys(teamDomain) {
  if (certCache.keys && Date.now() - certCache.at < 3600_000) return certCache.keys;
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`Access certs ${res.status}`);
  certCache.keys = (await res.json()).keys ?? [];
  certCache.at = Date.now();
  return certCache.keys;
}

/**
 * @returns {Promise<string | null>} the signed-in email, or null if not allowed
 */
export async function verifyAccess(request, env) {
  const token = request.headers.get('cf-access-jwt-assertion');
  const teamDomain = env.ACCESS_TEAM_DOMAIN;
  if (!token || !teamDomain || !env.ACCESS_AUD) return null;

  const [h, p, s] = token.split('.');
  if (!h || !p || !s) return null;
  let header, payload;
  try {
    header = b64urlToJson(h);
    payload = b64urlToJson(p);
  } catch {
    return null;
  }

  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(env.ACCESS_AUD)) return null;
  if (payload.iss !== `https://${teamDomain}`) return null;
  if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;

  const jwk = (await teamKeys(teamDomain)).find((k) => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, [
    'verify',
  ]);
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(s),
    new TextEncoder().encode(`${h}.${p}`)
  );
  if (!valid) return null;

  const email = String(payload.email ?? '').toLowerCase();
  const allowed = String(env.ALLOWED_EMAILS ?? '')
    .toLowerCase()
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  return allowed.includes(email) ? email : null;
}
