# Hooks

Reusable hooks, written in Node so they work identically on Windows, macOS, and Linux.

There are two layers. They enforce the same rules at different moments, and share their
logic through `lib/` so they cannot drift apart.

## Tool-call hooks (Claude Code)

These fire per tool call, which is what lets them stop a secret *before* it reaches disk.

| Hook | Event | What it does |
| --- | --- | --- |
| `block-main-branch.js` | PreToolUse (Bash) | Blocks `git commit` / `git push` while on `main` or `master`. Matches the actual git subcommand only — `git stash push` is not affected. |
| `secret-scan.js` | PreToolUse (Write\|Edit) | Simulates the pending write/edit and scans the resulting file content for credential patterns (private keys, AWS/GitHub/Anthropic/OpenAI/Stripe/Slack tokens, hardcoded `api_key = "..."` assignments), blocking matches the change would newly introduce — including secrets assembled across an edit boundary. Pre-existing matches, placeholders, and `.env.example` are allowed. |
| `format-on-save.js` | PostToolUse (Write\|Edit) | Runs Prettier on the written file if the project has Prettier installed. Never blocks. |

### Installing in a consuming repo

These are not active just by existing — Claude Code only runs hooks declared in settings. In the consuming repo (which has this core vendored at `.harness-core/`), merge the entries you want from [`settings.snippets.json`](settings.snippets.json) into `.claude/settings.json`. The `exampleCombined` key in that file shows a complete `hooks` block with all three wired up — you can copy it wholesale into a fresh `settings.json`.

## Lifecycle hooks (agent plugin)

These fire once per agent turn rather than per tool call, and are declared by
[`../com.github.copilot/hooks/hooks.json`](../com.github.copilot/hooks/hooks.json). They are
the safety net for clients that run lifecycle hooks but not per-tool-call hooks.

| Hook | Event | What it does |
| --- | --- | --- |
| `pre-run.js` | preRun | Reports the branch and how many files are already uncommitted. Advisory only — always exits 0, because refusing to *start* a turn on `main` would block reading and exploring too. |
| `post-run.js` | postRun | Over every file the turn left changed: Prettier first, then a credential scan. Exits 2 with the findings on stderr so the client surfaces them before the code reaches a commit. Skips `node_modules`, `dist`, `build`, `out`, `coverage`, `.next`, and `.git`. |

They are active as soon as the plugin is installed — see [../docs/PLUGIN.md](../docs/PLUGIN.md).

## Shared logic (`lib/`)

| Module | Exports |
| --- | --- |
| `lib/secret-patterns.js` | `PATTERNS`, `PLACEHOLDER`, `ALLOWED_FILE`, `findSecrets(content, previous)` — matches, minus placeholders, minus anything already in `previous` |
| `lib/git.js` | `currentBranch()`, `isProtectedBranch()`, `changedFiles()` — each returns `null`/`[]` rather than throwing when there is no repo |
| `lib/format.js` | `FORMATTABLE`, `isFormattable()`, `formatFiles()` — Prettier via `npx --no-install`, so it is a no-op in projects without it |

Add a pattern or a protected branch once, in `lib/`, and both layers pick it up.

## Conventions for adding hooks here

- Node scripts, no dependencies outside the standard library.
- Read the hook payload from stdin as JSON; tolerate unparseable input — including valid JSON that is not an object — by exiting 0.
- Exit `2` with a one-line explanation on stderr to block; exit `0` otherwise. Claude Code PostToolUse hooks always exit 0.
- Fail open: if the check itself errors (no git repo, no prettier), let the tool call proceed.
- Shared logic goes in `lib/`, so the tool-call and lifecycle layers stay in agreement.

## Testing a hook

Pipe a payload in and check the exit code — both the blocking and the fail-open path:

```bash
echo '{"tool_input":{"command":"git commit -m x"}}' | node hooks/block-main-branch.js; echo "exit=$?"
echo 'garbage' | node hooks/block-main-branch.js; echo "exit=$?"   # must be 0
node hooks/post-run.js < /dev/null; echo "exit=$?"
```
