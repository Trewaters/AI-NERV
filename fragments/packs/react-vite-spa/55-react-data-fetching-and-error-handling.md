# React SPA Data Fetching And Error Handling

Use this fragment for client-rendered React apps that consume a backend API rather than hosting their own request handlers.

## API client rules

- Route all backend access through a shared API client or service layer; do not scatter raw `fetch` calls through components.
- Validate or narrow API responses at the client boundary before business logic runs, preferably with schema validation when the repo already uses a library such as Zod.
- Handle non-2xx responses explicitly; do not assume `fetch` rejects on HTTP errors.
- Map validation failures, authentication failures, missing records, and unexpected server failures to distinct client-side error types or states.
- Do not surface raw backend error payloads, stack traces, or internal identifiers to users.

## Async state rules

- Give every async UI flow explicit loading, error, and empty states.
- Reset loading state and error state deliberately in async form or action handlers.
- Cancel or ignore stale requests when inputs change or the component unmounts, so late responses cannot clobber newer state.
- Prefer the repo's existing data-fetching library (React Query, SWR, or equivalent) over ad hoc `useEffect` fetching when one is present.

## Logging and failure handling

- Use the repo's structured logger or error-reporting client when one exists.
- Include feature or request context in reported errors so failures are traceable.
- Do not add new ad hoc `console.log`, `console.warn`, or `console.error` calls in application code when a logger exists.
- Never swallow promise rejections or leave empty `catch` blocks.

## Async and typing rules

- Prefer `async/await` over mixed promise chains.
- Type caught errors as `unknown` and narrow before use.
- Handle nullable or missing API data explicitly instead of assuming records exist.

## UI failure handling

- Show user-facing error states for failing async UI actions.
- Use error boundaries around feature roots or other unstable UI regions.
- Offer retry or recovery paths for transient network failures where the feature reasonably supports them.
