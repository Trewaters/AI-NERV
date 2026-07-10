# React / Vite SPA Pack

Reusable fragment pack for new React projects built as client-rendered single-page apps with a stack close to:

- Vite
- TypeScript in strict mode
- React with a client-side router (commonly React Router)
- Vitest + Testing Library
- A separate backend API the SPA consumes

This is the `react-next-app-router` pack with the Next.js-specific assumptions stripped: no App Router or Server Components, no framework API routes, no framework image component, and environment access through `import.meta.env` instead of `process.env`.

How to use it in a new repo:

1. Copy the files you want from this folder into `ai/fragments/` in the consuming repo.
2. Keep the numeric prefixes so ordering stays stable.
3. Delete any rules that are not true for that repo.
4. Add repo-specific fragments after these if needed.
5. Run `bash .harness-core/scripts/build-instructions.sh` from the consuming repo root.

These files are source material. They are not auto-emitted by this core repo because the build script only reads top-level `fragments/*.md`.

Included fragments:

- `40-react-vite-stack.md` — stack assumptions, TypeScript, component structure, Vite env/asset rules, and the backend boundary
- `50-react-quality-and-testing.md` — testing and verification expectations with Vitest and HTTP-boundary mocking
- `55-react-data-fetching-and-error-handling.md` — API client structure, async state, logging, and error-handling norms
- `60-react-security-and-accessibility.md` — client-bundle security and baseline accessibility rules
- `70-react-docs-and-review.md` — documentation and self-review guidance
- `80-react-performance-and-dependencies.md` — bundle-size defaults and dependency hygiene
- `90-react-git-and-release.md` — git, changelog, branch, and release conventions

For authenticated apps with user-owned data, add the fragments from `fragments/packs/react-auth-data-app/` — auth and data rules live there so they can be shared across stacks.
