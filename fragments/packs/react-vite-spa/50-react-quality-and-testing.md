# React Quality And Testing

Use this fragment for React SPA projects that rely on automated checks before merge.

## Core quality bar

- Test behavior, not implementation details.
- New user-facing behavior should ship with tests.
- Treat tests as first-class code: same TypeScript and readability standards as source files.
- Do not leave `test.only`, `it.only`, or unexplained skipped tests in the repo.

## Frontend testing rules

- Use the repo's configured runner; in Vite repos this is commonly Vitest with a jsdom environment and Testing Library.
- Prefer accessible queries first: role, label text, visible text, then `data-testid` as a fallback.
- Wrap component tests in the same providers the component actually depends on, including the router when the component navigates.
- Add accessibility assertions for interactive UI when the repo supports them.
- Mock context and router dependencies deliberately rather than letting tests couple to unrelated runtime state.

## Network and integration testing rules

- Mock the network at the HTTP boundary (for example with MSW or the repo's equivalent) instead of mocking the API client's internals.
- Cover success, validation failure, unauthenticated response, and server-error paths for new data-fetching flows.
- Assert on the user-visible outcome of failures — error messages, retry affordances, disabled controls — not just that a rejection occurred.
- Keep test data isolated so tests do not depend on execution order.

## Verification before finishing work

- Run the narrowest relevant checks first.
- Prefer repo scripts such as `lint`, `test`, `typecheck`, and `build` when they exist.
- Do not claim success without running at least one relevant verification step when the environment supports it.
