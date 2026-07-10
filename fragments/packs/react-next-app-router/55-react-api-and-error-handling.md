# React API And Error Handling

Use this fragment for React and Next.js projects with API handlers, server actions, or other request boundaries.

## API boundary rules

- Validate external input at the boundary before business logic runs.
- Prefer schema-based validation when the repo already uses a library such as Zod.
- Return consistent error shapes from API handlers.
- Map validation failures, authentication failures, missing records, and unexpected server failures to distinct status codes.
- Do not leak stack traces, raw ORM errors, or internal implementation details in responses.

## Handler structure

- Authenticate first when the route is user-scoped.
- Parse and validate request input before database or side-effecting work.
- Keep success and failure responses explicit.
- Wrap async handler logic in `try/catch` when failures can occur.

## Logging and failure handling

- Use the repo's structured logger when one exists.
- Include route or function context in logs so failures are traceable.
- Do not add new ad hoc `console.log`, `console.warn`, or `console.error` calls in application code when a logger exists.
- Never swallow promise rejections or leave empty `catch` blocks.

## Async and typing rules

- Prefer `async/await` over mixed promise chains.
- Type caught errors as `unknown` and narrow before use.
- Handle nullable database lookups explicitly instead of assuming records exist.

## UI failure handling

- Show user-facing error states for failing async UI actions.
- Use error boundaries around feature roots or other unstable UI regions when the stack supports them.
- Reset loading state and error state deliberately in async form or action handlers.