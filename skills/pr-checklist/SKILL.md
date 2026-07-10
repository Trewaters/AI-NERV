---
name: pr-checklist
description: Pre-PR verification pass — run checks, review the diff, and draft the PR description. Use when the user says the work is ready for a PR, asks to open a PR, or asks for a pre-PR review.
---

# PR checklist

Run through this before opening a pull request. Report each item's result; don't silently skip failures.

## 1. Branch hygiene

- Confirm you're on a feature branch, not `main`/`master`.
- `git status` — no unintended files staged (build output, `.env`, editor junk, lockfile churn from an unrelated package manager).

## 2. Quality gates

Run whichever exist in the repo (check `package.json` scripts first):

- Type check (`tsc --noEmit` or the repo's `typecheck` script)
- Lint (`lint` script)
- Tests (`test` script)
- Build (`build` script) — for app repos, confirm it completes

If a gate fails, fix it or stop and report — never open the PR with known-failing gates without the user's explicit OK.

## 3. Diff self-review

Read the full diff (`git diff <default-branch>...HEAD`) looking for:

- Leftover debug code: `console.log`, commented-out blocks, `TODO`s added by this branch
- Secrets or environment-specific values hardcoded
- Changes unrelated to the branch's purpose (split them out if found)
- New env vars missing from `.env.example`

## 4. Docs

- Update `CHANGELOG.md` if the repo keeps one (use the `changelog-update` skill).
- Update README/docs if the change affects setup, commands, or public behavior.

## 5. PR description

Draft with this shape:

```
## What
One or two sentences: the change from the user's/reviewer's perspective.

## Why
The problem or requirement driving it. Link the issue if one exists.

## How to verify
Concrete steps a reviewer can follow to confirm it works.
```

Present the checklist results and the draft description before pushing, unless the user asked for the PR to be opened directly.
