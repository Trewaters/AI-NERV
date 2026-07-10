# React Quality And Testing

Use this fragment for React projects that rely on automated checks before merge.

## Core quality bar

- Test behavior, not implementation details.
- New user-facing behavior should ship with tests.
- Treat tests as first-class code: same TypeScript and readability standards as source files.
- Do not leave `test.only`, `it.only`, or unexplained skipped tests in the repo.

## Frontend testing rules

- Prefer accessible queries first: role, label text, visible text, then `data-testid` as a fallback.
- Wrap component tests in the same providers the component actually depends on.
- Add accessibility assertions for interactive UI when the repo supports them.
- Mock framework and context dependencies deliberately rather than letting tests couple to unrelated runtime state.

## API and integration testing rules

- Cover success, validation failure, unauthenticated access, and server-error paths for new API handlers.
- For user-scoped resources, include ownership and cross-user access checks.
- Keep test data isolated so tests do not depend on execution order.

## Verification before finishing work

- Run the narrowest relevant checks first.
- Prefer repo scripts such as `lint`, `test`, `typecheck`, and `build` when they exist.
- Do not claim success without running at least one relevant verification step when the environment supports it.