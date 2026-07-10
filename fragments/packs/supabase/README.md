# Supabase Pack

Reusable fragment pack for projects backed by Supabase (Postgres, migrations, and the Supabase CLI). It is independent of any frontend stack — pair it with any stack pack.

What it assumes:

- Supabase is the database/backend platform
- Schema changes are managed as SQL migration files in version control (the `supabase/migrations/` workflow)
- The Supabase CLI is available (`npx supabase ...`)

How to use it in a new repo:

1. Copy the files you want from this folder into `ai/fragments/` in the consuming repo.
2. Keep the numeric prefixes so ordering stays stable; the `67-` fragment slots directly after `react-auth-data-app`'s `66-react-data-access.md` when both packs are used, extending its schema/migration discipline with Supabase-specific rules.
3. Delete any rules that are not true for that repo.
4. Add repo-specific fragments after these if needed.
5. Run `bash .harness-core/scripts/build-instructions.sh` from the consuming repo root.

These files are source material. They are not auto-emitted by this core repo because the build script only reads top-level `fragments/*.md`.

Included fragments:

- `67-supabase-migrations.md` — migration discipline: always add new timestamped migration files, never edit existing ones, use `ALTER TABLE` in a new migration for changes to existing tables

Pairs well with `fragments/packs/react-auth-data-app/` for the general (Supabase-agnostic) data-access and auth rules.
