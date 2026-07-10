# docs/

Prose documentation about this repo itself: how-to guides, workflow notes,
and design decisions that don't belong in the root README.

How this differs from the neighboring folders:

- `fragments/` — instruction fragments consumed by the build script; they
  become the generated `CLAUDE.md` / `AGENTS.md` / copilot instructions in
  consuming repos. Machine-facing, always loaded.
- `references/` — full-length reference documents (e.g. `A11Y.md`,
  `INCLUSION.md`) that back the distilled fragments. Consulted on demand by
  humans and agents, not concatenated into generated files.
- `docs/` (this folder) — documentation about `ai-harness-core` itself, for
  maintainers.

Root-level exceptions: `README.md` (repo overview and the template workflow)
and `Table_Of_Contents.md` (the `gh repo create` flag reference), which
intentionally live at the root together.
