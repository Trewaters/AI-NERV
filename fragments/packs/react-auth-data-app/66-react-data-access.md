# React Data Access

Use this fragment for React apps backed by a database or persistent data layer. It does not assume any particular ORM or database client.

## Data-layer structure

- Use one runtime database access pattern consistently; do not mix parallel clients in app code without a strong reason.
- Keep data access behind service or repository modules instead of inline queries in UI code or request handlers.
- Keep operational and migration scripts out of application runtime imports.

## Query rules

- Validate external input before it reaches the data layer.
- For user-scoped resources, scope every query by the authenticated user; never trust a client-supplied ID as proof of ownership.
- Select only the fields the feature needs.
- Paginate and order list queries instead of fetching unbounded collections.
- Avoid obvious N+1 query patterns when related data can be fetched together.
- Handle missing or nullable records explicitly instead of assuming they exist.

## Schema and migration rules

- Keep schema changes in version control alongside the code that depends on them.
- If the stack generates a typed client from the schema, regenerate it after schema changes before treating type errors as application bugs.
- When a new user-linked model is added, revisit account deletion, data export, and privacy flows in the same change.

## Failure handling

- Do not leak raw data-layer errors, query text, or internal identifiers in API responses or the UI.
- Map missing records, constraint violations, and unexpected failures to distinct, consistent error responses.
- Log data-layer failures with enough context to trace them, using the repo's structured logger when one exists.
