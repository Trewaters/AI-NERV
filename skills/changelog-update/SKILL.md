---
name: changelog-update
description: Update CHANGELOG.md for the changes on the current branch, following Keep a Changelog format. Use when the user asks to update the changelog, prep release notes, or before opening a PR in repos that keep a changelog.
---

# Changelog update

Update `CHANGELOG.md` to reflect the work on the current branch.

## Steps

1. Find the changes to describe: `git log --oneline <default-branch>..HEAD` plus `git diff --stat <default-branch>...HEAD`. If the branch has no commits yet, use the staged/working changes instead.
2. Open `CHANGELOG.md`. If it doesn't exist, create it with a `# Changelog` header, a note that it follows [Keep a Changelog](https://keepachangelog.com), and an `## [Unreleased]` section.
3. Add entries under `## [Unreleased]`, grouped by category — only include categories that have entries:
   - `### Added` — new features
   - `### Changed` — changes to existing behavior
   - `### Fixed` — bug fixes
   - `### Removed` — removed features
   - `### Security` — vulnerability fixes
4. Write entries for **users of the software**, not for developers reading the diff: describe visible behavior ("Fixed window position not restored on second monitor"), not implementation ("refactored WindowManager").
5. One entry per meaningful change; fold trivial commits (typo fixes, CI tweaks) into nothing — they don't belong in a changelog.
6. Don't invent a version number or date — releases get cut separately. Entries stay under `[Unreleased]` until then.

## On release (only when explicitly asked to cut a version)

Rename `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD` (matching the version in `package.json`), and add a fresh empty `[Unreleased]` section above it.
