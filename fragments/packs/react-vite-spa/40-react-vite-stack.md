# React / Vite SPA Baseline

Use this fragment for repositories built as client-rendered single-page apps with Vite, React, and TypeScript.

## Stack assumptions

- Node.js 22.x
- TypeScript in `strict` mode
- ES modules
- npm as the package manager
- Vite for dev server and production builds
- React with modern function components
- Client-side rendering only; no server components and no server-rendered routes

If the target repo differs from these assumptions, trim this fragment before using it.

## TypeScript rules

- No `any` unless a short comment justifies the exception.
- Prefer `unknown` when the type is genuinely uncertain.
- Give all non-trivial exported functions explicit return types.
- Prefer `interface` for object shapes and `type` for unions or computed types.
- Do not relax compiler strictness to make code compile.

## React rules

- All components are client components; do not port server-component patterns from other frameworks.
- Use the repo's existing router (commonly React Router) for navigation; do not hand-roll history handling.
- Keep one component per file.
- Define a props interface above the component instead of typing props inline.
- Destructure props in the function signature.
- Use direct imports from source files, not barrel `index.ts` re-exports.
- Prefer the repo's existing UI primitives before introducing custom markup patterns.

## Vite-specific rules

- Read environment values through `import.meta.env`, not `process.env`.
- Only `VITE_`-prefixed variables reach the client bundle, and everything that does is public. Never put secrets, API keys with write access, or tokens in client env vars.
- Use `import.meta.env.DEV` / `import.meta.env.PROD` for environment branching instead of custom flags.
- Import static assets through the module graph so Vite can fingerprint them; reserve `public/` for files that must keep a stable URL.
- Use dynamic `import()` (with `React.lazy` where appropriate) for route-level and heavy conditional code splitting.

## Project structure rules

- Keep feature code grouped by feature folder.
- Keep pure helpers in utility modules with no side effects.
- Keep operational scripts out of application runtime imports.
- Prefer path aliases for internal imports when the repo already defines them.

## Backend boundary rules

- The SPA has no trusted server code of its own; every authorization and validation decision must be enforced by the backend API it talks to.
- Treat client-side permission checks as UX affordances only, never as security.
- Centralize backend access in a shared API client layer instead of scattering `fetch` calls through components.

## Code hygiene

- No commented-out code in committed changes.
- No magic numbers when a named constant would make behavior clearer.
- No new dependency unless the standard library or existing dependencies cannot reasonably solve the problem.
- Match the surrounding repo style before introducing a new pattern.
