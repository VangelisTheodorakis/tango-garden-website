/**
 * Registrations per course, read from the Google Form response sheets.
 *
 * Each course round is configured in wrangler.toml (COURSE_ROUNDS): the sheet,
 * the date its sign-ups start counting from, and the number of spots. Rows
 * before that date belong to earlier rounds; they, and earlier sign-ups for
 * the other course, are only used to tell returning students from new ones.
 * Deleting a row in the sheet (a test, a cancellation) removes it here too.
 *
 * Only counts leave this module: no names or emails reach the dashboard.
 */

/** Google Sheets date serial (days since 30 Dec 1899) -> Date. */
const fromSerial = (serial) => new Date(Date.UTC(1899, 11, 30) + serial * 86400000);

/** The role answer as one of leader / follower / both / unknown. */
export function roleOf(answer) {
  const a = String(answer ?? '').toLowerCase();
  const lead = /lead|führ/.test(a);
  const follow = /follow|folg/.test(a);
  if (/both|beide|double|switch|dual|either/.test(a) || (lead && follow)) return 'both';
  if (lead) return 'leader';
  if (follow) return 'follower';
  return 'unknown';
}

/**
 * Sheet rows (first row = the form's questions) as { ts, email, role }.
 * Timestamp is the form's first column; email and role columns are found by
 * their question text.
 */
export function parseSheet(values) {
  const [header = [], ...rows] = values ?? [];
  const find = (re) => header.findIndex((h) => re.test(String(h)));
  const emailCol = find(/e-?mail/i);
  const roleCol = find(/role|rolle|lead|follow|führ|folg/i);
  return rows
    .filter((r) => typeof r[0] === 'number')
    .map((r) => ({
      ts: fromSerial(r[0]),
      email: emailCol >= 0 ? String(r[emailCol] ?? '').trim().toLowerCase() : '',
      role: roleCol >= 0 ? roleOf(r[roleCol]) : 'unknown',
    }));
}

/**
 * @param {Record<string, {from: string, spots: number}>} rounds  per course slug
 * @param {Record<string, any[][]>} sheets  raw sheet values per course slug
 */
export function buildRegistrations(rounds, sheets) {
  const rows = Object.entries(sheets).flatMap(([slug, values]) => parseSheet(values).map((r) => ({ ...r, slug })));

  const result = {};
  for (const [slug, round] of Object.entries(rounds)) {
    if (!sheets[slug]) {
      result[slug] = null;
      continue;
    }
    const from = new Date(`${round.from}T00:00:00Z`);
    // One registration per person: someone who submits twice counts once,
    // with their latest answer.
    const people = new Map();
    for (const r of rows) {
      if (r.slug === slug && r.ts >= from) people.set(r.email || `row-${people.size}`, r);
    }
    const roles = { leader: 0, follower: 0, both: 0, unknown: 0 };
    let returning = 0;
    for (const p of people.values()) {
      roles[p.role] += 1;
      // Returning: the same email signed up before, for an earlier round of
      // this course or for another course (beginners moving up to improvers).
      const before = (r) => (r.slug === slug ? r.ts < from : r.ts < p.ts);
      if (p.email && rows.some((r) => r.email === p.email && before(r))) returning += 1;
    }
    result[slug] = { from: round.from, spots: round.spots, registered: people.size, roles, returning };
  }
  return result;
}

/** Reads the first tab of a sheet, with timestamps as date serials. */
export async function fetchSheet(sheetId, token) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/A1:Z5000` +
    '?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER';
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Sheets ${res.status}: ${await res.text()}`);
  return (await res.json()).values ?? [];
}
