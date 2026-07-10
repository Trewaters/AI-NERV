# React Git And Release Hygiene

Use this fragment for projects that want stronger commit, branch, changelog, and release discipline.

## Commit rules

- Use a consistent commit-message convention across the repo.
- Keep commit summaries short, specific, and in present tense.
- Prefer one logical change per commit.
- Update the changelog in the same change when the repo keeps one.

## Branch rules

- Do not commit directly to the main production branch.
- Use short-lived feature or fix branches with descriptive names.
- Keep branch purpose narrow so reviews stay focused.

## Changelog and release rules

- Keep changelog entries user-facing rather than implementation-focused.
- Maintain a clear unreleased section when the repo follows changelog-based release notes.
- Use stable date formatting in release entries.
- Run the relevant quality gates before release or merge to the production branch.

## CI and version-control hygiene

- Do not commit secrets, generated build output, dependency directories, or machine-specific junk.
- Keep CI environment values in secrets management rather than hardcoded workflow files.
- Treat passing lint, tests, and build checks as merge prerequisites when the repo supports them.
