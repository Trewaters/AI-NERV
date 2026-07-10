# React SPA Security And Accessibility

Use this fragment when the project handles user data, authenticated features, or interactive UI from a client-rendered app.

## Security rules

- Never commit secrets, tokens, passwords, or connection strings.
- Everything in the client bundle is public: never place secrets in client code or in `VITE_`-prefixed environment variables.
- Treat all authorization as the backend's responsibility; client-side checks only shape the UI and must never gate data access on their own.
- Validate and sanitize all external input at the boundary, including query params, URL fragments, and postMessage payloads.
- Sanitize any user-generated HTML before rendering it; avoid `dangerouslySetInnerHTML` without sanitization.
- Document new environment variables in `.env.example` when the repo uses one.

## Error-handling rules

- Do not surface raw backend errors, stack traces, or personal data in the UI.
- Use structured logging or error reporting instead of ad hoc `console.*` calls when the repo has a logger.
- Catch async failures deliberately; do not leave unhandled promise rejections.

## Accessibility rules

- Prefer native interactive elements or component-library equivalents that preserve keyboard behavior.
- Ensure all interactive controls have an accessible name.
- Preserve visible focus states, preferably with `:focus-visible`.
- Make dialogs, drawers, and menus keyboard-operable and return focus to the trigger when they close.
- Manage focus and announce page changes on client-side route transitions, since the browser will not do it for you.
- Avoid nested interactive elements and positive `tabIndex` values.
- Test interactive flows with keyboard navigation, not only pointer input.
