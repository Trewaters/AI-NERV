# React / Next App Router Pack

Reusable fragment pack for new React projects that use a stack close to:

- Next.js App Router
- TypeScript in strict mode
- React
- MUI
- Prisma
- Vercel

How to use it in a new repo:

1. Copy the files you want from this folder into `ai/fragments/` in the consuming repo.
2. Keep the numeric prefixes so ordering stays stable.
3. Delete any rules that are not true for that repo.
4. Add repo-specific fragments after these if needed.
5. Run `bash .harness-core/scripts/build-instructions.sh` from the consuming repo root.

These files are source material. They are not auto-emitted by this core repo because the build script only reads top-level `fragments/*.md`.

Included fragments:

- `40-react-next-stack.md` — stack assumptions, TypeScript, component structure, and backend consistency
- `50-react-quality-and-testing.md` — testing and verification expectations
- `55-react-api-and-error-handling.md` — API route structure, validation, logging, and async error-handling norms
- `60-react-security-and-accessibility.md` — security and baseline accessibility rules
- `70-react-docs-and-review.md` — documentation and self-review guidance
- `80-react-performance-and-dependencies.md` — performance defaults and dependency hygiene
- `90-react-git-and-release.md` — git, changelog, branch, and release conventions

For authenticated apps with user-owned data, also copy the fragments from `fragments/packs/react-auth-data-app/` — auth, privacy, and data-access rules live there so they can be shared across stacks. Its files are numbered `65`–`66` and slot between this pack's `60` and `70` fragments.