#!/usr/bin/env node
// Enforce the deploy convention: this site deploys ONLY via `git push` to main
// (Cloudflare auto-builds from GitHub). A direct `wrangler deploy/publish` would
// bypass CI and could ship uncommitted local state — so block it.
//
// Node-based (not jq) for Windows/Git Bash portability. Exit 2 blocks, 0 allows.
import { readFileSync } from 'node:fs';

let data = {};
try {
  data = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0);
}

if ((data.tool_name || '') !== 'Bash') process.exit(0);

const cmd = (data.tool_input && data.tool_input.command) || '';
if (/\bwrangler\s+(deploy|publish|pages\s+deploy)\b/.test(cmd)) {
  console.error(
    'Blocked: do not deploy with wrangler directly. This site deploys via `git push origin main`, which triggers the Cloudflare build. Commit and push instead.'
  );
  process.exit(2);
}

process.exit(0);
