# Changelog And Docs Thresholds

Use this policy when deciding whether `npm run docs` must run.

Run docs when changes are non-minor, including:

- Exported API changes
- User-facing behavior changes
- Routing changes
- Schema or contract changes
- Documentation-source comments used by TypeDoc
- Any change where the impact is unclear and could affect generated docs

Skip docs when changes are minor, including:

- Tests only
- Typos only
- Comment-only edits that do not affect generated docs
- Non-functional refactors
- Config-only changes with no public behavior or docs impact

Overrides:

- If `force-docs` is provided, run docs regardless of classification.
- If classification is uncertain, treat the change as non-minor and run docs.

When docs are skipped, the skill should explicitly say why.