// Migration check: compares the visible text of every built page against its
// legacy HTML counterpart, so content drift shows up as a diff rather than
// something a human has to spot.
import { readFileSync, existsSync } from 'node:fs';

const text = (html) =>
  html
    // Removed by request from the off-live product pages: the "← ..." back link
    // and the "X · Y" badge that sat above the title. Stripped from both sides
    // so the rest of the page is still compared.
    .replace(/<a[^>]*class="back-link"[^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/<div class="product-badge">[\s\S]*?<\/div>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&minus;/g, '−')
    .replace(/&times;/g, '✕')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/\s+/g, ' ')
    .trim()
    // The skip link is a deliberate addition of the migration.
    .replace('Skip to content ', '');

const pairs = [
  ['legacy/index.html', 'dist/index.html'],
  ['legacy/404.html', 'dist/404.html'],
];

for (const slug of [
  'the-garden', 'start-here', 'contact', 'impressum', 'code-of-care',
  'privacy-policy', 'terms-of-service', 'refund-and-cancellation-policy',
  'agb', 'datenschutz', 'widerruf',
]) {
  pairs.push([`legacy/pages/${slug}/index.html`, `dist/pages/${slug}/index.html`]);
}

for (const handle of [
  'enter-the-garden-general-admission',
  'enter-the-garden-introductory-session-student-and-under-28-admission',
  'the-garden-practica-1-practica-pass-door-only-student-and-under-28-admission',
  'the-garden-practica-1-practica-pass-general-admission',
  'the-garden-practica-1-time-pass-evey',
  'the-sprouting-sessions-beginner-level-1-class-pass-general-admission',
  'the-sprouting-sessions-beginner-level-1-class-pass-student-and-under-28-admission',
  'the-sprouting-sessions-beginner-level-1-class-welcome-pass',
  'the-sprouting-sessions-beginner-level-4-classes-pass-student-and-under-28-admission',
  'the-sprouting-sessions-beginner-level-full-course-pass-general-admission',
  'the-sprouting-sessions-beginner-level-full-course-pass-student-and-under28-admission',
  'the-sprouting-sessions-beginners-level-4-classes-pass-general-admission',
]) {
  pairs.push([`legacy/products/${handle}/index.html`, `dist/products/${handle}/index.html`]);
}

let same = 0;
const diffs = [];

for (const [oldPath, newPath] of pairs) {
  if (!existsSync(oldPath) || !existsSync(newPath)) {
    diffs.push([oldPath, 'MISSING FILE', newPath]);
    continue;
  }
  const a = text(readFileSync(oldPath, 'utf8'));
  const b = text(readFileSync(newPath, 'utf8'));
  if (a === b) {
    same++;
    continue;
  }

  // Report the first divergence with a little context on each side.
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  diffs.push([
    newPath,
    `old: …${a.slice(Math.max(0, i - 60), i + 90)}…`,
    `new: …${b.slice(Math.max(0, i - 60), i + 90)}…`,
  ]);
}

console.log(`identical: ${same}/${pairs.length}\n`);
for (const [file, ...lines] of diffs) {
  console.log(`### ${file}`);
  for (const l of lines) console.log('  ' + l);
  console.log();
}
