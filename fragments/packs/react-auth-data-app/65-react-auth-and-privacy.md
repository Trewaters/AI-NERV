# React Auth And Privacy

Use this fragment for projects with authenticated users, user-owned data, or privacy-sensitive features. It does not assume any particular auth library.

## Auth rules

- Require server-side auth validation before reading or mutating user-owned data.
- Do not rely on client-side checks alone for authorization decisions.
- Keep authentication library details behind local helpers so the rest of the app depends on your session shape, not the library's.
- For user-scoped resources, verify both authentication and ownership.
- Let the auth layer own session transport: prefer HttpOnly, Secure, SameSite cookies over hand-managed tokens, and never set session data in browser storage manually.

## Privacy rules

- Collect and return only the fields needed for the feature.
- Treat personal data and profile data as privacy-sensitive by default.
- Use generic error messages that do not reveal personal data, internal IDs, or raw data-layer failures.
- If the application supports account deletion or data export, update those flows whenever a new user-linked data model is introduced.
- If the application supports public/private visibility modes, test both paths when adding profile or sharing features.

## Storage and caching rules

- Do not place secrets, session tokens, or sensitive user payloads in `localStorage`, `sessionStorage`, IndexedDB, or JS-accessible cookies.
- Reserve browser storage for non-sensitive UI state such as theme or language preferences.
- Do not store role or permission data client-side and trust it for access decisions; always verify server-side.
- Be careful with offline caches and service workers: do not cache authenticated responses that contain personal data.
- Clear user-specific cached data on sign-out when the stack uses local caches.

## Authorization modeling

- Keep roles and permissions in shared constants or helpers rather than inline string checks.
- Reuse shared helpers for permission checks and role display behavior.
- Prefer server-side permission checks even when the UI also hides restricted actions.
