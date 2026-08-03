#!/usr/bin/env node
// Block Edit/Write and destructive shell ops against files that are expensive
// to regenerate or dangerous to clobber. Add basenames to PROTECTED below.
//
// Node-based (not jq) so it works on Windows/Git Bash without extra installs —
// node is always present in this project. Reads the tool-call JSON on stdin,
// exits 2 (+ stderr message shown to Claude) to block, exits 0 to allow.
import { readFileSync } from 'node:fs';

const PROTECTED = ['.env', 'wrangler.jsonc'];

let data = {};
try {
  data = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // malformed input: fail open, don't wedge the tool
}

const tool = data.tool_name || '';
const ti = data.tool_input || {};
const basename = (p = '') => p.split(/[\\/]/).pop();

if (tool === 'Edit' || tool === 'Write') {
  const fp = ti.file_path || '';
  if (PROTECTED.includes(basename(fp))) {
    console.error(
      `Blocked: ${fp} is protected — do not modify it directly. If a change is genuinely needed, ask the user to make it themselves.`
    );
    process.exit(2);
  }
} else if (tool === 'Bash') {
  const cmd = ti.command || '';
  for (const name of PROTECTED) {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mentions = new RegExp(`(^|[\\s/\\\\])${esc}(\\s|$)`).test(cmd);
    const destructive = /\brm\b|\bmv\b|\btruncate\b|>\s*\S/.test(cmd);
    if (mentions && destructive) {
      console.error(`Blocked: ${name} must never be deleted or overwritten via shell commands.`);
      process.exit(2);
    }
  }
}

process.exit(0);
