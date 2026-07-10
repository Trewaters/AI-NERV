# Commit conventions

## Format

Use Conventional Commits:

```
<type>(<optional scope>): <short imperative summary>

<optional body: what and why, not how>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`, `ci`, `perf`, `style`.

## Rules

- Summary line: imperative mood ("add", not "added" or "adds"), lowercase after the type, no trailing period, aim for ≤ 72 characters.
- One logical change per commit. Don't mix a feature with an unrelated fix or formatting pass.
- The body explains *why* the change was made when it isn't obvious from the summary. Skip the body for trivial changes.
- Reference issues/tickets in the body when one exists (e.g. `Refs #42`).
- Never commit directly to `main` — work on a feature branch and merge via PR.

## Branch naming

`<type>/<short-kebab-description>` — e.g. `feat/user-settings-page`, `fix/ipc-race-on-quit`.
