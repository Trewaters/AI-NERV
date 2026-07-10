# Hooks

Reusable Claude Code hooks, written in Node so they work identically on Windows, macOS, and Linux.

| Hook | Event | What it does |
| --- | --- | --- |
| `block-main-branch.js` | PreToolUse (Bash) | Blocks `git commit` / `git push` while on `main` or `master`. Matches the actual git subcommand only — `git stash push` is not affected. |
| `secret-scan.js` | PreToolUse (Write\|Edit) | Simulates the pending write/edit and scans the resulting file content for credential patterns (private keys, AWS/GitHub/Anthropic/Stripe/Slack tokens, hardcoded `api_key = "..."` assignments), blocking matches the change would newly introduce — including secrets assembled across an edit boundary. Pre-existing matches, placeholders, and `.env.example` are allowed. |
| `format-on-save.js` | PostToolUse (Write\|Edit) | Runs Prettier on the written file if the project has Prettier installed. Never blocks. |

## Installing in a consuming repo

These are not active just by existing — Claude Code only runs hooks declared in settings. In the consuming repo (which has this core vendored at `.harness-core/`), merge the entries you want from [`settings.snippets.json`](settings.snippets.json) into `.claude/settings.json`. The `exampleCombined` key in that file shows a complete `hooks` block with all three wired up — you can copy it wholesale into a fresh `settings.json`.

## Conventions for adding hooks here

- Node scripts, no dependencies outside the standard library.
- Read the hook payload from stdin as JSON; tolerate unparseable input by exiting 0.
- Exit `2` with a one-line explanation on stderr to block; exit `0` otherwise. PostToolUse hooks always exit 0.
- Fail open: if the check itself errors (no git repo, no prettier), let the tool call proceed.
