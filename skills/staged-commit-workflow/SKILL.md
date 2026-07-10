---
name: staged-commit-workflow
description: "Create a commit message from staged changes, bump and sync version numbers, update CHANGELOG.md, and run npm run docs only when changes are not minor. Use for pre-commit finalization, version hygiene, changelog hygiene, and docs gating."
argument-hint: "Optional: extra context for commit intent or release note tone"
user-invocable: true
disable-model-invocation: false
---

# Staged Commit Workflow

## What This Skill Produces

This skill produces a ready-to-use commit package from the current staged diff:

1. A commit message based on staged changes
2. A synchronized version bump across `package.json` (`"version"`) and `public/sw.js` (`SW_VERSION`)
3. An updated `CACHE_VERSION` in `public/sw.js` using format `v<YYYY>.<MM>.<DD>.<branch>`
4. An updated `CHANGELOG.md` entry under the new package version header
5. Updated generated docs from `npm run docs` when the change is not minor

## When to Use

Use this skill when:

- You already staged changes and want a consistent commit message
- You want changelog updates enforced before commit
- You want docs generation to run only when warranted

Do not use this skill when:

- Nothing is staged
- You only want to commit without changelog/docs checks

## Inputs

- Optional user note describing intent (bug fix, feature, audit cleanup)
- Optional flag: `force-docs` to run docs even for minor changes
- Optional flag: `skip-version-bump` to skip version increment (for example, test-only or config-only commits)
- Optional flag: `bump=patch`, `bump=minor`, or `bump=major` to override the default minor version increment
- Optional changelog policy note if team-specific rules differ from standard Keep a Changelog usage
- Current staged changes in git index

## Commit Keywords

- `ADD`: for new features.
- `UPDATE`: for changes in existing functionality.
- `DEPRECATE`: for soon-to-be removed features.
- `REMOVE`: for now removed features.
- `FIX`: for any bug fixes.
- `SECURITY`: in case of vulnerabilities.
- `AUDIT`: code clean up. Carefully removing unnecessary files.

## Procedure

1. Inspect staged changes only:
   - `git diff --cached --name-only`
   - `git diff --cached`
2. Classify the change category:
   - `ADD`, `FIX`, `UPDATE`, `REMOVE`, `DEPRECATE`, `SECURITY`, or `AUDIT`
3. Draft commit message from observed impact:
   - Format: `KEYWORD: short present-tense summary`
   - Keep summary under 72 characters when possible
   - Prefer user-visible impact over implementation detail
4. Sync version numbers (skip if `skip-version-bump` flag is set):
   - Read current `"version"` from `package.json` -> format `major.minor.patch`
   - Apply bump: default is **minor** increment (`major.(minor+1).0`, reset patch to 0) because all branch-based staged changes are minor by semver convention; honor `bump=patch`, `bump=minor`, or `bump=major` if provided
   - Update `"version"` in `package.json` to the new version string
   - Update `SW_VERSION` constant on line 3 of `public/sw.js` to match the new version string exactly
   - Get current branch name: `git rev-parse --abbrev-ref HEAD`
   - Normalize branch name: replace all `/` with `-`, lowercase (for example, `feature/fix-csp` -> `feature-fix-csp`)
   - Compute new cache version: `v<YYYY>.<MM>.<DD>.<normalized-branch>` using today's date with zero-padded month and day
   - Update `CACHE_VERSION` constant on line 1 of `public/sw.js` to the computed cache version string
   - Stage both `package.json` and `public/sw.js`
5. Perform changelog preflight checks:
   - If changelog formatting expectations are not clear, ask the user before editing
   - Use [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) conventions as default
6. Update changelog with versioned header flow:
   - Read the **new** package version from `package.json` (after step 4)
   - Compute today's date in `YYYY-MM-DD`
   - In `CHANGELOG.md`, find header `## [<package-version>] - <date>`
   - If that package version section already exists, append the new bullet there (group same version changes together across commits)
   - If that package version section does not exist, create `## [<package-version>] - <today>` and add the entry
   - Map commit keyword to changelog section names:
     - `ADD` -> `### Added`
     - `FIX` -> `### Fixed`
     - `UPDATE` and `AUDIT` -> `### Changed`
     - `REMOVE` -> `### Removed`
     - `DEPRECATE` -> `### Deprecated`
     - `SECURITY` -> `### Security`
   - If target section is missing in an existing version block, ask before creating it
   - Keep wording user-facing and concise
7. Decide docs generation requirement using [docs threshold rules](./references/changelog-docs-thresholds.md)
8. If docs update is required:
   - Run `npm run docs`
   - Stage doc artifacts changed by that command
9. If docs update is not required:
   - Explicitly note skip reason in output
10. Return final output:
    - Proposed commit message
    - Version change: old -> new (or skipped)
    - New `CACHE_VERSION` value (or skipped)
    - Changelog header and line added
    - Whether docs were run or skipped (with reason)
    - Final command suggestion only: `git commit -m "<message>"`

## Decision Rules

Use these rules in priority order:

1. If no staged files: stop and ask user to stage files first.
2. If staged changes are test-only, typo-only, comment-only, or non-functional refactors: treat as minor and use `bump=patch` to keep the version increment minimal; skip version bump entirely if `skip-version-bump` is provided.
3. If staged changes alter exported APIs, user-facing behavior, routing, schema/contracts, or docs-source comments used by TypeDoc: treat as non-minor.
4. If user passes `skip-version-bump`, do not modify `package.json` or `public/sw.js` versions.
5. If user passes `force-docs`, run docs even when change is minor.
6. If uncertain, treat as non-minor and run docs.
7. `SW_VERSION` in `public/sw.js` must always equal `"version"` in `package.json`. If they are out of sync when the skill runs, fix the mismatch first before applying the new bump.

## Quality Checks

Before finalizing:

- Commit message keyword matches actual change type
- Message is present tense and specific
- `"version"` in `package.json` and `SW_VERSION` in `public/sw.js` are identical
- `CACHE_VERSION` in `public/sw.js` matches format `v<YYYY>.<MM>.<DD>.<branch>` with today's date and the current branch
- Both `package.json` and `public/sw.js` are staged when version bump runs
- `CHANGELOG.md` updated under the matching **new** package version section
- Version header includes package version and date in `YYYY-MM-DD` format when newly created
- Existing version sections are reused to keep same-version commits grouped together
- Docs decision clearly justified
- No unstated assumptions about unstaged files

## Output Template

- `Commit message:` <KEYWORD: summary>
- `Version:` <old-version> -> <new-version> (package.json + sw.js synced) | Skipped (test-only / skip-version-bump)
- `Cache:` <new CACHE_VERSION, for example v2026.05.22.feature-fix-csp> | Skipped
- `Changelog:` <section [new-version] and line added>
- `Docs:` <Ran npm run docs | Skipped (minor change)>
- `Next command:` `git commit -m "..."`
