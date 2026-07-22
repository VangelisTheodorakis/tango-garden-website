#!/usr/bin/env node
/**
 * find-dead-css.mjs — dead-selector finder for the Tango Garden Astro site.
 *
 * Parses every CSS source (src/styles/*.css + every <style> block inside
 * src/**\/*.astro), extracts each individual selector, and tests it against the
 * BUILT html in dist/ using a real DOM + real CSS selector engine
 * (htmlparser2 + css-select). No regex/grep matching.
 *
 * Selectors that only ever match after JS runs (.is-open, [aria-expanded="true"], ...)
 * are cross-checked against the JS that ships in dist/_astro/*.js and the inline
 * <script> blocks in src, and reported as RUNTIME instead of DEAD.
 *
 * Usage:  node find-dead-css.mjs [path-to-repo]
 * Requires the repo's node_modules (postcss, css-select, htmlparser2, domutils).
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const REPO = path.resolve(process.argv[2] ?? process.cwd());
const require = createRequire(path.join(REPO, 'package.json'));
const postcss = require('postcss');
const cssSelect = require('css-select');
const htmlparser2 = require('htmlparser2');

const SRC = path.join(REPO, 'src');
const DIST = path.join(REPO, 'dist');

/* ---------------------------------------------------------------- helpers */

function walk(dir, filter, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}

const rel = (p) => path.relative(REPO, p).split(path.sep).join('/');

/* ------------------------------------------------------- collect CSS text */

/** @type {{file:string, css:string, lineOffset:number, label:string}[]} */
const sources = [];

for (const f of walk(path.join(SRC, 'styles'), (p) => p.endsWith('.css'))) {
  sources.push({ file: rel(f), css: fs.readFileSync(f, 'utf8'), lineOffset: 0, label: rel(f) });
}

/**
 * A <style> block that lives in src/pages/**.astro only ever ships on the page(s)
 * that file generates — even with is:global. Testing it against ALL of dist/
 * hides rules that are dead *on their own page*. Map each page file to the dist
 * HTML it produces; components stay unscoped (tested against every page).
 */
function distScopeFor(astroFile) {
  const r = rel(astroFile);
  if (!r.startsWith('src/pages/')) return null; // component → all docs
  const route = r.slice('src/pages/'.length).replace(/\.astro$/, '');
  if (route.includes('[')) {
    // dynamic route: every page under that directory
    const dir = route.slice(0, route.lastIndexOf('/'));
    return (docFile) => docFile.startsWith(`dist/${dir}/`);
  }
  if (route === 'index') return (d) => d === 'dist/index.html';
  if (route === '404') return (d) => d === 'dist/404.html';
  if (route.endsWith('/index')) return (d) => d === `dist/${route}.html`;
  return (d) => d === `dist/${route}/index.html` || d === `dist/${route}.html`;
}

const STYLE_RE = /<style([^>]*)>([\s\S]*?)<\/style>/g;
for (const f of walk(SRC, (p) => p.endsWith('.astro'))) {
  const text = fs.readFileSync(f, 'utf8');
  const scope = distScopeFor(f);
  for (const m of text.matchAll(STYLE_RE)) {
    const before = text.slice(0, m.index + m[0].indexOf(m[2]));
    const lineOffset = before.split('\n').length - 1; // 0-based line of block start
    sources.push({
      file: rel(f),
      css: m[2],
      lineOffset,
      scope,
      label: `${rel(f)} <style${m[1]}>`,
    });
  }
}

/* ------------------------------------------------------- collect JS text  */

let jsBlob = '';
const SCRIPT_RE = /<script(?![^>]*\btype=["']application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;
for (const f of walk(SRC, (p) => p.endsWith('.astro') || p.endsWith('.js') || p.endsWith('.ts'))) {
  const text = fs.readFileSync(f, 'utf8');
  if (f.endsWith('.astro')) for (const m of text.matchAll(SCRIPT_RE)) jsBlob += m[1] + '\n';
  else jsBlob += text + '\n';
}
if (fs.existsSync(path.join(DIST, '_astro'))) {
  for (const f of walk(path.join(DIST, '_astro'), (p) => p.endsWith('.js')))
    jsBlob += fs.readFileSync(f, 'utf8') + '\n';
}

/* ------------------------------------------------------------- parse DOMs */

const htmlFiles = walk(DIST, (p) => p.endsWith('.html'));
const docs = htmlFiles.map((f) => ({
  file: rel(f),
  dom: htmlparser2.parseDocument(fs.readFileSync(f, 'utf8')),
}));
if (!docs.length) {
  console.error('No HTML in dist/ — run `npm run build` first.');
  process.exit(1);
}

/* ------------------------------------------------ selector normalisation  */

// Pseudo-classes/elements that describe a *state* or a *rendered box*, never
// present in static markup. Stripping them tests the underlying structure.
const STATE_PSEUDO =
  // NOTE: longest alternatives first — `focus` must not shadow `focus-within`.
  /::?(-webkit-[a-z-]+|-moz-[a-z-]+|-ms-[a-z-]+|focus-visible|focus-within|placeholder-shown|file-selector-button|user-invalid|out-of-range|first-letter|read-only|read-write|indeterminate|in-range|first-line|selection|placeholder|backdrop|any-link|disabled|required|optional|default|enabled|checked|visited|invalid|target|active|marker|before|focus|hover|after|valid|link)\b/g;

function normalise(sel) {
  let s = sel.replace(STATE_PSEUDO, '');
  s = s.replace(/\s+/g, ' ').trim();
  // a bare combinator left over (e.g. "a:hover > " ) → invalid
  if (!s || /[>+~]\s*$/.test(s) || /^\s*[>+~]/.test(s)) return null;
  return s;
}

// class / id / attribute tokens a selector depends on, for the runtime check
function tokens(sel) {
  const out = [];
  for (const m of sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) out.push({ kind: 'class', name: m[1] });
  for (const m of sel.matchAll(/#(-?[_a-zA-Z][\w-]*)/g)) out.push({ kind: 'id', name: m[1] });
  for (const m of sel.matchAll(/\[([\w-]+)\s*(?:[~|^$*]?=\s*["']?([^\]"']*)["']?)?\]/g))
    out.push({ kind: 'attr', name: m[1], value: m[2] });
  return out;
}

// State-ish class names: present only while JS/UA has flipped something.
const STATE_CLASS = /^(is-|has-|js-)|^(active|open|visible|selected|current|expanded)$/;
// Attributes the *browser* toggles with no JS involved.
const UA_ATTRS = new Set(['open', 'checked', 'selected', 'disabled', 'hidden']);

const classInJs = (n) =>
  new RegExp(
    `(classList\\.(?:add|remove|toggle|contains|replace)\\([^)]*|className\\s*\\+?=\\s*[^;]*|['"\`][^'"\`]*)\\b${n}\\b`
  ).test(jsBlob);
const attrInJs = (n) =>
  new RegExp(
    `(setAttribute|toggleAttribute|removeAttribute|getAttribute)\\(\\s*['"\`]${n}['"\`]`
  ).test(jsBlob);

/**
 * Returns { level: 'runtime'|'uncertain'|'none', notes: [] }
 * 'runtime' = JS demonstrably targets an element matching this selector.
 * 'uncertain' = only a generic state token (.is-open) is referenced by JS, but
 *   nothing proves JS ever puts it on *this* element — needs a human look.
 */
function runtimeEvidence(sel) {
  const notes = [];
  let strong = false;
  let weak = false;

  // split into compounds so we can reason per-element
  for (const compound of sel.split(/\s*[\s>+~]\s*/).filter(Boolean)) {
    const t = tokens(compound);
    const classes = t.filter((x) => x.kind === 'class').map((x) => x.name);
    const ids = t.filter((x) => x.kind === 'id').map((x) => x.name);
    const attrs = t.filter((x) => x.kind === 'attr');

    const stateClasses = classes.filter((c) => STATE_CLASS.test(c));
    const anchorClasses = classes.filter((c) => !STATE_CLASS.test(c));

    for (const a of attrs) {
      if (UA_ATTRS.has(a.name)) {
        strong = true;
        notes.push(`[${a.name}] is toggled natively by the browser, never in static HTML`);
      } else if (attrInJs(a.name)) {
        strong = true;
        notes.push(`attribute "${a.name}" is set by shipped JS`);
      }
    }

    for (const c of stateClasses) {
      if (!classInJs(c)) continue;
      // does JS also reference the element this state class sits on?
      const anchored =
        anchorClasses.some(classInJs) ||
        ids.some((i) => new RegExp(`['"\`#]${i}['"\`]`).test(jsBlob)) ||
        (anchorClasses.length === 0 && ids.length === 0);
      if (anchored) {
        strong = true;
        notes.push(
          `.${c} is toggled by shipped JS on an element JS also selects (${[...anchorClasses, ...ids].join(', ') || 'bare state class'})`
        );
      } else {
        weak = true;
        notes.push(
          `.${c} exists in shipped JS, but JS never selects .${anchorClasses.join('/.')} — is this element really given .${c}?`
        );
      }
    }
    // non-state class that JS itself queries (e.g. .start-here-faq-btn)
    for (const c of anchorClasses) {
      if (classInJs(c)) {
        notes.push(`class "${c}" is referenced by shipped JS`);
      }
    }
  }

  return {
    level: strong ? 'runtime' : weak || notes.length ? 'uncertain' : 'none',
    notes: [...new Set(notes)],
  };
}

/* ------------------------------------------------------------- the sweep  */

const results = [];
let totalSelectors = 0;

for (const src of sources) {
  let root;
  try {
    root = postcss.parse(src.css, { from: src.file });
  } catch (e) {
    console.error(`! could not parse ${src.label}: ${e.message}`);
    continue;
  }

  root.walkRules((rule) => {
    // skip @keyframes step selectors, @font-face, @property, etc.
    let p = rule.parent;
    while (p && p.type === 'atrule') {
      if (/keyframes|font-face|property|counter-style/i.test(p.name)) return;
      p = p.parent;
    }

    const line = (rule.source?.start?.line ?? 0) + src.lineOffset;

    for (const raw of rule.selectors) {
      totalSelectors++;
      const sel = normalise(raw);
      const entry = {
        file: src.label,
        physFile: src.file,
        line,
        selector: raw.trim(),
        tested: sel,
        status: 'unknown',
        matchedIn: [],
        note: '',
      };

      if (!sel) {
        entry.status = 'unparseable';
        results.push(entry);
        continue;
      }

      let compiled;
      try {
        compiled = cssSelect.compile(sel);
      } catch (e) {
        entry.status = 'unsupported';
        entry.note = e.message;
        results.push(entry);
        continue;
      }

      const scoped = src.scope ? docs.filter((d) => src.scope(d.file)) : docs;
      entry.scopeSize = scoped.length;
      for (const d of scoped) {
        try {
          if (cssSelect.selectOne(compiled, d.dom)) entry.matchedIn.push(d.file);
        } catch {
          /* ignore per-doc engine errors */
        }
      }

      if (entry.matchedIn.length) {
        entry.status = 'used';
      } else {
        const ev = runtimeEvidence(sel);
        entry.note = ev.notes.join('; ');
        entry.status = ev.level === 'none' ? 'dead' : ev.level;
      }
      results.push(entry);
    }
  });
}

/* ------------------------------------------------------------- reporting  */

const by = (s) => results.filter((r) => r.status === s);

function print(title, rows, withNote = false) {
  console.log(`\n${'='.repeat(78)}\n${title}  (${rows.length})\n${'='.repeat(78)}`);
  let last = '';
  for (const r of rows.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
    if (r.file !== last) {
      console.log(`\n-- ${r.file}`);
      last = r.file;
    }
    console.log(
      `  ${String(r.line).padStart(4)}  ${r.selector}${withNote && r.note ? `\n          -> ${r.note}` : ''}`
    );
  }
}

console.log(`Repo:            ${REPO}`);
console.log(`CSS sources:     ${sources.length}`);
console.log(`dist HTML docs:  ${docs.length}`);
console.log(`Selectors tested:${totalSelectors}`);
console.log(
  `used=${by('used').length}  dead=${by('dead').length}  runtime=${by('runtime').length}  ` +
    `uncertain=${by('uncertain').length}  ` +
    `unsupported=${by('unsupported').length}  unparseable=${by('unparseable').length}`
);

print('DEAD — matches nothing in dist/, no JS evidence', by('dead'));
print('RUNTIME — matches nothing statically, but JS/UA toggles it: KEEP', by('runtime'), true);
print('UNCERTAIN — weak runtime evidence, check by hand', by('uncertain'), true);
print('UNSUPPORTED by the selector engine — inspect by hand', by('unsupported'), true);
print('UNPARSEABLE after pseudo-stripping — inspect by hand', by('unparseable'));

/* --------------------------------------- duplicate-rule detection (bonus) */

const norm = (s) => s.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
const seen = new Map();
for (const src of sources) {
  let root;
  try {
    root = postcss.parse(src.css, { from: src.file });
  } catch {
    continue;
  }
  root.walkRules((rule) => {
    const media = [];
    let p = rule.parent;
    while (p && p.type === 'atrule') {
      media.unshift(`@${p.name} ${p.params}`);
      p = p.parent;
    }
    const key = `${media.join(' ')}|${norm(rule.selector)}|${norm(rule.nodes.map((n) => n.toString()).join(';'))}`;
    const loc = `${src.label}:${(rule.source?.start?.line ?? 0) + src.lineOffset}`;
    if (!seen.has(key)) seen.set(key, { sel: rule.selector, media: media.join(' '), locs: [] });
    seen.get(key).locs.push(loc);
  });
}
const dupes = [...seen.values()].filter((v) => v.locs.length > 1);
console.log(`\n${'='.repeat(78)}\nEXACT DUPLICATE RULES (same selector + same declarations)  (${dupes.length})\n${'='.repeat(78)}`);
for (const d of dupes.sort((a, b) => b.locs.length - a.locs.length)) {
  console.log(`\n  ${d.media ? d.media + ' ' : ''}${d.sel}`);
  for (const l of d.locs) console.log(`      ${l}`);
}

/* selectors declared in more than one source file (possible consolidation) */
const bySel = new Map();
for (const r of results) {
  if (!bySel.has(r.selector)) bySel.set(r.selector, new Set());
  bySel.get(r.selector).add(`${r.file}:${r.line}`);
}
const cross = [...bySel.entries()].filter(
  ([, locs]) => new Set([...locs].map((l) => l.split(' ')[0].replace(/:\d+$/, ''))).size > 1
);
console.log(
  `\n${'='.repeat(78)}\nSELECTORS DECLARED IN >1 FILE (consolidation candidates)  (${cross.length})\n${'='.repeat(78)}`
);
for (const [sel, locs] of cross.sort((a, b) => b[1].size - a[1].size)) {
  console.log(`\n  ${sel}`);
  for (const l of [...locs].sort()) console.log(`      ${l}`);
}

if (process.env.JSON_OUT) fs.writeFileSync(process.env.JSON_OUT, JSON.stringify(results, null, 2));
