# Hooks

Deterministic enforcement of this project's two easiest-to-forget rules. Wired in
`.claude/settings.json` under `PreToolUse`. Each hook reads the tool-call JSON on stdin
and exits `2` with a stderr message (shown to Claude) to block the call, or `0` to allow.

**Why Node, not jq:** the usual template hooks parse JSON with `jq`, which isn't installed
on this machine — and a missing `jq` makes those hooks *fail open* (silently allow
everything). These are rewritten in Node (`.mjs`), which is always present in this project,
so they actually enforce. No install, no executable-bit requirement (they're invoked as
`node <script>`).

## block-deploy.mjs
Blocks `wrangler deploy` / `wrangler publish` / `wrangler pages deploy`. This site deploys
**only** via `git push origin main` (Cloudflare auto-builds from GitHub); a direct wrangler
deploy would bypass CI and could ship uncommitted local state.

## protect-critical-files.mjs
Blocks Edit/Write and destructive shell ops (`rm`, `mv`, `truncate`, `>` redirect) against
files in its `PROTECTED` list — currently `.env` and `wrangler.jsonc` (the Cloudflare deploy
config: rarely changes, expensive to break). Edit the `PROTECTED` array to add more.

## Adding a hook
Write a `.mjs` that reads stdin JSON, exits 2 (+ stderr) to block or 0 to allow, then add a
`{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/<name>.mjs\"" }`
entry under the right matcher in `.claude/settings.json`.
