# React / Vite / MUI PWA Pack

Reusable fragment pack for React apps built as installable Progressive Web Apps with:

- Vite + TypeScript (strict) — the `react-vite-spa` pack's baseline
- MUI (Material UI) with Emotion as the only styling system
- `vite-plugin-pwa` + Workbox for the manifest and service worker

This pack is an **add-on**: it contains only the MUI and PWA rules. Always pair it with `fragments/packs/react-vite-spa/`, which carries the stack baseline, testing, data-fetching, security/a11y, docs, performance, and git fragments. Its fragments are numbered `45`–`46` to slot between that pack's `40` stack fragment and `50` testing fragment.

What it assumes:

- MUI v6+ with `@emotion/react`/`@emotion/styled`, one theme module, CSS-variable color schemes
- `vite-plugin-pwa` in `generateSW` mode is the only service-worker mechanism
- HTTPS in all deployed environments

How to use it in a new repo:

1. Copy the numbered fragments from `fragments/packs/react-vite-spa/` into the consuming repo's `ai/fragments/`.
2. Copy this pack's numbered fragments into the same `ai/fragments/`.
3. Keep the numeric prefixes so ordering stays stable.
4. Delete any rules that are not true for that repo (e.g. drop the offline-writes rules if the app is read-only).
5. Add repo-specific fragments after these if needed.
6. Run `bash .harness-core/scripts/build-instructions.sh` from the consuming repo root.

These files are source material. They are not auto-emitted by this core repo because the build script only reads top-level `fragments/*.md`.

Included fragments:

- `45-mui-material-ui.md` — theme-token discipline, `sx`/`styled` rules, component and form conventions, icon-import hygiene
- `46-pwa-service-worker.md` — service-worker update strategy, precache/runtime-cache rules, manifest completeness, offline UX, and production-build verification

Skills that belong with this pack (copy into the consuming repo's `.claude/skills/`):

- `skills/pwa-verify/` — release-check workflow that builds the app and verifies manifest, service-worker, icon, and caching-config correctness
- `skills/frontend-ui-design/` — premium UI work within the a11y guardrails; its library guidance already fits MUI/React
- `skills/staged-commit-workflow/`, `skills/changelog-update/`, `skills/pr-checklist/` — the usual process skills

For authenticated apps with user-owned data, also add `fragments/packs/react-auth-data-app/` (`65-`, `66-`) — and note that its privacy rules interact with `46-pwa-service-worker.md`'s ban on caching per-user endpoints.

## Creating `template-react-vite-mui-pwa`

The generic template workflow lives in the root `README.md` ("Creating a new template repo"). These are the stack-specific values for this pack, run from Git Bash:

```bash
# 1. Create and clone
gh repo create [Github_user]/template-react-vite-mui-pwa --public --clone
cd template-react-vite-mui-pwa

# 2. Scaffold Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# 3. Add the stack
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @fontsource/roboto
npm install -D vite-plugin-pwa

# 4. Commit the scaffold FIRST (subtree needs a clean tree with a commit)
git add -A && git commit -m "Scaffold react-ts with Vite, MUI, vite-plugin-pwa"
git branch -M main

# 5. Wire in the harness core
git subtree add --prefix .harness-core https://github.com/[Github_user]/ai-harness-core.git main --squash

# 6. Copy fragments: the SPA baseline pack plus this pack
mkdir -p ai/fragments
cp .harness-core/fragments/packs/react-vite-spa/[0-9]*.md ai/fragments/
cp .harness-core/fragments/packs/react-vite-mui-pwa/[0-9]*.md ai/fragments/

# 7. Copy skills
mkdir -p .claude/skills
cp -r .harness-core/skills/pwa-verify .claude/skills/
cp -r .harness-core/skills/frontend-ui-design .claude/skills/
cp -r .harness-core/skills/staged-commit-workflow .claude/skills/
cp -r .harness-core/skills/changelog-update .claude/skills/
cp -r .harness-core/skills/pr-checklist .claude/skills/

# 8. Generate the instruction files
bash .harness-core/scripts/build-instructions.sh

# 9. Commit, push, mark as template
git add -A && git commit -m "Add harness core, MUI/PWA fragments, skills, generated instructions"
git push -u origin main
gh repo edit [Github_user]/template-react-vite-mui-pwa --template
```

Then hand-finish the scaffold so the template actually demonstrates the rules (an agent working in the template repo can do this from the fragments):

- `src/theme.ts` — `createTheme` with `cssVariables: true` and light/dark `colorSchemes`; `ThemeProvider` + `CssBaseline` in `main.tsx`
- `vite.config.ts` — `VitePWA({ registerType: 'prompt', manifest: { ... } })` with real icons in `public/` (192, 512, 512-maskable)
- An update-prompt component wired to `virtual:pwa-register/react`'s `useRegisterSW`
- Vitest + Testing Library per the `50-` fragment, since `npm create vite` does not add them
