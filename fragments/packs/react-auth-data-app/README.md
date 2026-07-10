# React Auth / Data App Pack

Reusable fragment pack for React apps with authenticated users and persistent user data, written to be independent of any specific auth library or ORM. Use it when the project uses React but not the Prisma + NextAuth stack the `react-next-app-router` pack leans toward — or alongside either stack pack, since nothing here contradicts them.

What it assumes:

- Authenticated users and user-owned data
- A server-side data layer of some kind (any ORM, query builder, or driver)
- Any auth mechanism that can be validated server-side (session cookies, OAuth, JWTs behind a helper)

How to use it in a new repo:

1. Copy the files you want from this folder into `ai/fragments/` in the consuming repo.
2. Keep the numeric prefixes so ordering stays stable; these slot between a stack pack's `60` and `70` fragments.
3. Delete any rules that are not true for that repo.
4. Add repo-specific fragments after these if needed.
5. Run `bash .harness-core/scripts/build-instructions.sh` from the consuming repo root.

These files are source material. They are not auto-emitted by this core repo because the build script only reads top-level `fragments/*.md`.

Included fragments:

- `65-react-auth-and-privacy.md` — server-side auth validation, privacy defaults, browser-storage rules, and authorization modeling
- `66-react-data-access.md` — data-layer structure, query scoping and ownership, schema/migration discipline, and data-layer failure handling

Pair with a stack pack: `fragments/packs/react-next-app-router/` for Next.js App Router projects, or `fragments/packs/react-vite-spa/` for client-rendered Vite apps.
