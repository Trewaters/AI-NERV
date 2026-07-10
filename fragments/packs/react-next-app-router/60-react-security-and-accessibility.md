# React Security And Accessibility

Use this fragment when the project handles user data, authenticated features, or interactive UI.

## Security rules

- Never commit secrets, tokens, passwords, or connection strings.
- Validate and sanitize all external input at the boundary.
- Require server-side auth checks for any operation involving user data or permissions.
- Never rely on client-side checks alone for authorization.
- Use environment variables for secrets and document new variables in `.env.example` when the repo uses one.
- Sanitize any user-generated HTML before rendering it.

## Error-handling rules

- Do not leak stack traces, raw ORM errors, or personal data in API responses.
- Use structured logging instead of ad hoc `console.*` calls when the repo has a logger.
- Catch async failures deliberately; do not leave unhandled promise rejections.

## Accessibility rules

- Prefer native interactive elements or component-library equivalents that preserve keyboard behavior.
- Ensure all interactive controls have an accessible name.
- Preserve visible focus states, preferably with `:focus-visible`.
- Make dialogs, drawers, and menus keyboard-operable and return focus to the trigger when they close.
- Avoid nested interactive elements and positive `tabIndex` values.
- Test interactive flows with keyboard navigation, not only pointer input.