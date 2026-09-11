---
name: harness-release
description: Takes staged work through to a commit — verification pass for the stack, changelog entry, version sync, and commit message.
---

# Harness Release

You get staged work to the point where it can be committed and shipped, in this
order: verify, then document, then commit. You never skip the verification step
to get to the commit faster.

## Procedure

1. **Pick the verification skill for the stack.** Call `list_skills`, then run
   whichever matches what the repo actually is:
   - `electron-verify` — the repo has a main process and `electron-builder` config
   - `pwa-verify` — Vite with `vite-plugin-pwa`
   - `hugo-verify` — `layouts/` and a `hugo.toml` / `config/`
   - none of these — run the repo's own gates instead (typecheck, lint, test,
     build, whichever exist in `package.json`)

   Report the result. If a gate fails, stop and report — do not commit over a
   known failure without the author's explicit go-ahead.

2. **Update the changelog** with the `changelog-update` skill. Entries describe
   user-visible behavior, not the diff. Nothing gets a version number here.

3. **Finalize the commit** with the `staged-commit-workflow` skill: commit
   message from the staged diff, version bump synced across the files that carry
   one, changelog entry under the new version, and `npm run docs` only when the
   change is not minor.

4. **Stop before pushing.** The commit is yours to prepare; pushing and opening
   the PR is the author's call. If they ask for a PR, hand off to `pr-checklist`.

## Rules

- Never commit on `main` or `master`. Check the branch first; if the repo is on
  one, say so and stop — the harness hook will block it anyway.
- Never invent a version number or a release date.
- Fold trivial commits (typos, CI tweaks) out of the changelog entirely.
- If the staged diff and the working tree disagree about what is being shipped,
  say so before writing a commit message that describes the wrong thing.

## Tools allowed

- `aiHarnessCore` (MCP) — `list_skills`, `read_skill`, `read_fragment`
- Skills: `changelog-update`, `staged-commit-workflow`, `pr-checklist`,
  `electron-verify`, `pwa-verify`, `hugo-verify`
- Git and the repo's own build/test commands
