# ai-harness-core

Shared AI-assistant configuration: the single source of truth that my project templates
(`template-react-vite`, `template-electron`, ...) pull in as a git subtree at `.harness-core/`.

Edit here → resync in each template → regenerate. Never edit the generated files directly.

## Layout

```
fragments/    Instruction fragments, concatenated in filename order (00-, 10-, ...).
              These become CLAUDE.md / AGENTS.md / copilot-instructions.md downstream.
skills/       Claude Code skills shared across projects. Copy or symlink into a
              consuming repo's .claude/skills/.
hooks/        Cross-platform Node hook scripts + settings.snippets.json to paste
              into a consuming repo's .claude/settings.json. See hooks/README.md.
scripts/      build-instructions.sh — the generator.
references/   Full-length reference docs backing the distilled fragments:
              INCLUSION.md (inclusion guidance for AI-assisted generation) and
              A11Y.md (WCAG 2.2 AA reference with anti-patterns, severities,
              and fixes). Both distill into fragments/25-inclusion.md.
docs/         Prose documentation about this repo itself (guides, decisions).
              See docs/README.md.
```

`Table_Of_Contents.md` stays at the root alongside this README: it is the
`gh repo create` flag reference used by the template workflow below.

## Creating a new template repo

Template repos (`template-react-vite`, `template-electron`, ...) are GitHub *template
repositories*: starter scaffolds that carry a snapshot of this harness plus stack-specific
code and rules. New projects are stamped out from them with no shared git history.

One-time prerequisites on the machine doing the work:

```powershell
winget install GitHub.cli   # or: https://cli.github.com
gh auth login               # interactive; grants gh permission to create repos
```

Then, for each new template:

Run these from Git Bash (steps 4, 5, 6, and 8 use bash syntax):

```bash
# 1. Create the repo on GitHub and clone it
gh repo create Trewaters/template-<name> --public --clone
cd template-<name>

# 2. Scaffold the stack (example: Vite + React)
npm create vite@latest . -- --template react-ts

# 3. Commit the scaffold FIRST — git subtree refuses to run without an
#    existing commit and a clean working tree
git add -A && git commit -m "Scaffold react-ts with Vite"
git branch -M main   # ensure the branch is named main regardless of git defaults

# 4. Wire in the harness core (see "Wiring into a template repo" below)
git subtree add --prefix .harness-core https://github.com/Trewaters/ai-harness-core.git main --squash

# 5. Add stack-specific rules: copy the numbered fragments (not the README)
#    from the relevant pack into this repo's ai/fragments/, then delete any
#    copied rules that are not true for this template
mkdir -p ai/fragments
cp .harness-core/fragments/packs/react-vite-spa/[0-9]*.md ai/fragments/

# 6. Copy the skills this template should ship with into .claude/skills/
#    (one folder per skill; skip _scaffold)
mkdir -p .claude/skills
cp -r .harness-core/skills/frontend-ui-design .claude/skills/
cp -r .harness-core/skills/staged-commit-workflow .claude/skills/
# ...repeat for changelog-update, pr-checklist, etc. as needed

# 7. (Optional) Enable hooks: merge the entries you want from
#    .harness-core/hooks/settings.snippets.json into .claude/settings.json.
#    The exampleCombined key there is a complete hooks block you can copy
#    wholesale into a fresh settings.json. See hooks/README.md.

# 8. Generate CLAUDE.md / AGENTS.md / .github/copilot-instructions.md
bash .harness-core/scripts/build-instructions.sh

# 9. Commit, push, and mark it as a GitHub template repository
git add -A && git commit -m "Add harness core, stack fragments, skills, generated instructions"
git push -u origin main
gh repo edit Trewaters/template-<name> --template
```

Step 9's `--template` flag is what enables the "Use this template" button and:

```bash
gh repo create my-new-app --template Trewaters/template-<name> --private --clone
```

which is how every new project starts — a fresh repo, no shared history, harness included.
Consuming repos can still pick up newer harness rules later via `git subtree pull`
(see "Resyncing a template after changing the core").

## Wiring into a template repo

One-time, from the template repo's root (the repo must already have at least one
commit and a clean working tree — commit any pending changes first):

```bash
git subtree add --prefix .harness-core https://github.com/Trewaters/ai-harness-core.git main --squash
```

Then generate the instruction files (rerun any time fragments change):

```bash
bash .harness-core/scripts/build-instructions.sh
```

This writes three files at the template root, all with identical content:

- `CLAUDE.md` — read by Claude Code
- `AGENTS.md` — read by Copilot CLI and other AGENTS.md-aware agents
- `.github/copilot-instructions.md` — read by GitHub Copilot

Stack-specific instructions live in the *consuming* repo at `ai/fragments/*.md`; the build
script appends them after the shared fragments. Name them with numeric prefixes
(`40-react-vite.md`) to control order.

## Adding the harness to an existing repo

For a repo that already exists (not stamped from a template) and needs the shared rules
plus a fragment pack — e.g. an existing Hugo theme repo picking up `fragments/packs/hugo-theme/`.
Both repos being private is fine: your normal git credentials cover the subtree commands,
and Option B never touches the network. The examples below use the hugo-theme pack;
substitute the pack and skills your stack needs (each pack's README lists its skills).

### Option A — git subtree (recommended)

Embeds this repo at `.harness-core/` inside the consuming repo, so later rule updates
are one `git subtree pull` away. This is how the repo is designed to be consumed.

Run from Git Bash inside the consuming repo; the working tree must be clean and have
at least one commit:

```bash
# 1. Wire in the harness core
git subtree add --prefix .harness-core https://github.com/Trewaters/ai-harness-core.git main --squash

# 2. Copy the pack's numbered fragments (not the README) into ai/fragments/
mkdir -p ai/fragments
cp .harness-core/fragments/packs/hugo-theme/[0-9]*.md ai/fragments/

# 3. Copy the skills the pack's README lists into .claude/skills/
mkdir -p .claude/skills
cp -r .harness-core/skills/hugo-verify .claude/skills/
cp -r .harness-core/skills/frontend-ui-design .claude/skills/
cp -r .harness-core/skills/staged-commit-workflow .claude/skills/
cp -r .harness-core/skills/changelog-update .claude/skills/
cp -r .harness-core/skills/pr-checklist .claude/skills/

# 4. Generate the instruction files (the shared core fragments 00–30 are included automatically)
bash .harness-core/scripts/build-instructions.sh

# 5. Commit
git add -A && git commit -m "Add ai-harness-core with pack fragments and skills"
```

To pull updated rules later, follow "Resyncing a template after changing the core"
below — the same commands apply to any consuming repo.

If the HTTPS URL prompts for credentials, run `gh auth setup-git` once, or use the
SSH URL instead.

### Option B — plain copy (simpler, no update path)

Copies the files directly from a local clone of this repo. Nothing links back to the
core, so future rule changes must be re-copied by hand.

Run from Git Bash inside the consuming repo, with `CORE` pointing at your local clone:

```bash
CORE=/c/Users/trewa/Documents/Github/ai-harness-core

mkdir -p ai/fragments .claude/skills
cp "$CORE"/fragments/[0-9]*.md ai/fragments/                     # shared core rules 00–30
cp "$CORE"/fragments/packs/hugo-theme/[0-9]*.md ai/fragments/    # pack rules
cp -r "$CORE"/skills/{hugo-verify,frontend-ui-design,staged-commit-workflow,changelog-update,pr-checklist} .claude/skills/
cp -r "$CORE"/scripts "$CORE"/references .   # optional: build script + full-length reference docs
```

Note: without `.harness-core/`, the build script's usual path doesn't exist. Either skip
generation and write `CLAUDE.md` by hand from the copied fragments, or copy `scripts/`
as above and adapt the paths.

With either option, keep the numeric prefixes on copied fragments so ordering stays
stable, and delete any copied rules that are not true for that repo (see the pack's
README for what its fragments assume).

## Resyncing a template after changing the core

From the template repo's root:

```bash
git subtree pull --prefix .harness-core https://github.com/Trewaters/ai-harness-core.git main --squash
bash .harness-core/scripts/build-instructions.sh
```

Note: the subtree pull only updates `.harness-core/`. Skills copied into `.claude/skills/`
and pack fragments copied into `ai/fragments/` are plain copies — if the core versions
changed, re-copy them (same `cp` commands as template-creation steps 5 and 6).

## Promoting rule changes from another repo back into the core

The resync command above flows one way: it pulls changes from `ai-harness-core` into a
consuming repo. It does not pull rule edits from a consuming repo back into this core
repo.

When a consuming repo grows a rule that should become reusable, promote it here first:

1. Decide where the rule belongs:
    - shared rule for every repo: `fragments/`
    - reusable stack rule: `fragments/packs/<pack-name>/`
    - repo-specific rule: keep it in that repo's `ai/fragments/`
    - reusable workflow: `skills/<skill-name>/SKILL.md`
2. Copy or adapt the rule into the right source file in this repo.
3. Check for overlap with existing fragments or skills and consolidate instead of
    duplicating guidance.
4. Commit and push the change in `ai-harness-core`.
5. In each consuming repo that should receive it, run the resync command above and then
    rerun `bash .harness-core/scripts/build-instructions.sh`.

If the consuming repo changed files inside its vendored `.harness-core/` directory, a
`git subtree push` workflow can technically publish that subtree back upstream. Prefer
manual promotion unless you deliberately edited `.harness-core/` as source material and
have reviewed the exact diff being pushed. Most repo-local changes live outside the
subtree (`ai/fragments/`, `.claude/skills/`, generated instruction files), so they must
be copied into this repo intentionally.

## Adding a fragment

1. Create `fragments/NN-name.md` — pick `NN` to slot it where it belongs in the reading order.
2. Keep each fragment self-contained under a single `#` heading.
3. Resync + regenerate in each template (above).

## Adding instructions

For this repo, "instructions" are plain markdown fragments that get concatenated into all three agent entrypoints:

- `CLAUDE.md`
- `AGENTS.md`
- `.github/copilot-instructions.md`

That means a GitHub Copilot instruction usually translates directly to a fragment here.

Use shared core fragments when the instruction should apply across all consuming repos:

- Add the fragment under `fragments/`
- Choose a numeric prefix so it lands in the right reading order
- Rebuild downstream instruction files after resyncing the core

Use repo-local fragments when the instruction is specific to one consuming repo:

- Add the fragment under `ai/fragments/` in the consuming repo
- Re-run `bash .harness-core/scripts/build-instructions.sh`

Use a fragment pack when you want reusable source material for future projects without making it part of every generated instruction file:

- Store the pack in a subdirectory under `fragments/`
- Copy the numbered fragments you want (not the pack's README) into the new repo's `ai/fragments/`
- Keep numeric prefixes on copied files so ordering still works
- Delete any copied rules that are not true for that repo
- Add repo-specific fragments after the pack's if needed
- Re-run `bash .harness-core/scripts/build-instructions.sh` from the consuming repo root
- Subdirectories under `fragments/` are ignored by the current build script, so they are safe for reusable packs

Practical translation from Copilot-style instructions to this repo:

- Global coding behavior becomes a fragment in `fragments/`
- Stack-specific or app-specific guidance becomes a fragment in `ai/fragments/`
- Reusable multi-step workflows become skills in `skills/`, not fragments
- Hooks and enforcement logic belong in `hooks/` when you want settings or automation rather than agent guidance

If you keep temporary scratch files locally to hand source material to the agent, treat them as input only. They are not part of the generated-instructions workflow unless you deliberately promote that content into `fragments/`, `ai/fragments/`, or `skills/`.

Reusable stack packs live separately from that scratch flow:

- `fragments/packs/react-next-app-router/` — React with Next.js App Router
- `fragments/packs/react-vite-spa/` — client-rendered React SPAs built with Vite
- `fragments/packs/react-vite-mui-pwa/` — MUI (Material UI) and PWA/service-worker rules layered on top of `react-vite-spa`; its fragments (`45-`, `46-`) slot between that pack's `40` and `50` fragments, and its README carries the full `template-react-vite-mui-pwa` creation recipe
- `fragments/packs/react-auth-data-app/` — auth, privacy, and data-access rules for React apps with authenticated users, independent of any specific auth library or ORM; pair it with either stack pack — its fragments (`65-`, `66-`) are numbered to slot between a stack pack's `60` and `70` fragments
- `fragments/packs/electron-react-mui/` — Electron desktop apps with a React + MUI renderer built by electron-vite: process-model, IPC/security, and packaging/auto-update rules layered on top of `react-vite-spa` plus the MUI fragment from `react-vite-mui-pwa`; its fragments (`41-`, `42-`, `47-`) slot around that pack's `40` and `50` fragments, and its README carries the full `template-electron-react-mui` creation recipe
- `fragments/packs/supabase/` — Supabase-backed projects, independent of any frontend stack: migration discipline (new timestamped migration files only, never edit existing ones, `ALTER TABLE` in a new migration for existing tables); its fragment (`67-`) slots directly after `react-auth-data-app`'s `66-` fragment when both packs are used
- `fragments/packs/hugo-theme/` — static websites built with Hugo (extended, v0.146+) and a custom Go-template theme: a standalone baseline pack (not layered on any React pack) covering stack/config, templates and content structure, output safety/SEO, Hugo Pipes assets and performance, and build/release gates; its fragments (`40-`–`80-`) read directly after the shared core fragments, and its README carries the full `template-hugo-theme` creation recipe

Each pack has its own README with the assumptions it makes; read it before copying.

Questions to answer before adding an instruction fragment:

- Should this apply to every repo, or only one consuming repo?
- Is this guidance, or is it really a workflow that should become a skill?
- Where should it appear in reading order relative to existing fragments?
- Is it specific enough to change agent behavior, or too vague to be actionable?
- Does it conflict with an existing fragment and need consolidation instead of a new file?

If you want a starting scaffold, copy `fragments/_scaffold/NN-name.scaffold.md` into either `fragments/` or a consuming repo's `ai/fragments/`, then rename it to match the order you want.

## Adding a skill

1. Create `skills/<skill-name>/SKILL.md`.
2. If you want a starting scaffold, copy `skills/_scaffold/SKILL.scaffold.md` into the new folder as `SKILL.md`.
3. Start with frontmatter containing at least `name` and `description`.
4. Write the body so the agent can answer three things without guessing:
    - When the skill should be used
    - What inputs or flags it accepts
    - The exact procedure, checks, and output shape it should follow
5. Keep repo-specific paths, commands, and policies explicit inside the skill.
6. If the skill depends on another repo document, reference it with a relative path from `SKILL.md`.

Questions to answer before adding a new skill:

- What user trigger should cause the skill to be used?
- What should the skill produce at the end?
- What inputs are optional versus required?
- What repo files, commands, or branch conventions does it assume?
- What decisions must be made automatically, and what should require asking the user first?
- What validation must pass before the skill can report success?
- What should the final output include so the user can act on it immediately?
