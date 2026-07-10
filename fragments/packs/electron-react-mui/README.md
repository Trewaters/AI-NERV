# Electron / React / MUI Desktop Pack

Reusable fragment pack for desktop apps built with:

- Electron (current stable) with electron-vite for dev server and builds
- A React + TypeScript (strict) renderer — the `react-vite-spa` pack's baseline
- MUI (Material UI) with Emotion as the only styling system — the MUI fragment from `react-vite-mui-pwa`
- electron-builder + electron-updater for packaging, signing, and auto-update

This pack is an **add-on**: it contains only the Electron rules. Pair it with:

1. `fragments/packs/react-vite-spa/` — the renderer baseline (stack, testing, docs, performance, git fragments)
2. `fragments/packs/react-vite-mui-pwa/45-mui-material-ui.md` — the MUI rules (copy only `45-`; the `46-` PWA/service-worker fragment does not apply to Electron)

Its fragments are numbered `41`–`42` and `47` to slot around the baseline's `40` stack fragment and before its `50` testing fragment.

What it assumes:

- Three-target layout (`src/main/`, `src/preload/`, `src/renderer/`) as scaffolded by `create-electron` (electron-vite)
- `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false` on every window — the pack treats these as non-negotiable
- electron-builder is the only packaging mechanism and distributed builds are code-signed

Trim these baseline rules after copying — they read differently on desktop:

- `40-react-vite-stack.md` "Backend boundary rules": keep the principle, but the trusted side is the **main process**, not a remote backend (the `41-` fragment restates this). If the app also talks to a remote API, keep both readings.
- `40-react-vite-stack.md` env-var rules: electron-vite uses `MAIN_VITE_` / `PRELOAD_VITE_` / `RENDERER_VITE_` prefixes instead of bare `VITE_` (covered in `41-`).
- `55-react-data-fetching-and-error-handling.md`: applies to the renderer's remote-API calls if any; IPC calls follow this pack's rules instead.
- `60-react-security-and-accessibility.md`: keep all of it; this pack's `42-` fragment adds the Electron-specific security surface on top.

How to use it in a new repo:

1. Copy the numbered fragments from `fragments/packs/react-vite-spa/` into the consuming repo's `ai/fragments/`.
2. Copy `fragments/packs/react-vite-mui-pwa/45-mui-material-ui.md` into the same `ai/fragments/`.
3. Copy this pack's numbered fragments into the same `ai/fragments/`.
4. Keep the numeric prefixes so ordering stays stable.
5. Apply the trim guidance above and delete any rules that are not true for that repo.
6. Run `bash .harness-core/scripts/build-instructions.sh` from the consuming repo root.

These files are source material. They are not auto-emitted by this core repo because the build script only reads top-level `fragments/*.md`.

Included fragments:

- `41-electron-stack.md` — process-model discipline (main/preload/renderer ownership), main-process structure, electron-vite env prefixes, `userData` storage, dev/prod parity
- `42-electron-security-ipc.md` — window `webPreferences` baseline, `contextBridge` API shape, IPC handler validation, navigation/external-content lockdown, CSP
- `47-electron-packaging-distribution.md` — electron-builder config, `appId` stability, asar, code signing, electron-updater flow, fuses, release smoke-testing

Skills that belong with this pack (copy into the consuming repo's `.claude/skills/`):

- `skills/electron-verify/` — release-check workflow that audits window security, the preload/IPC surface, navigation handlers, CSP, and packaging config
- `skills/frontend-ui-design/` — premium UI work within the a11y guardrails; its library guidance already fits MUI/React
- `skills/staged-commit-workflow/`, `skills/changelog-update/`, `skills/pr-checklist/` — the usual process skills

For apps with authenticated users and user-owned data, also add `fragments/packs/react-auth-data-app/` (`65-`, `66-`) — its rules apply to the renderer, and token storage must follow this pack's `safeStorage` rule rather than browser storage.

## Creating `template-electron-react-mui`

The generic template workflow lives in the root `README.md` ("Creating a new template repo"). These are the stack-specific values for this pack, run from Git Bash:

```bash
# 1. Create and clone
gh repo create Trewaters/template-electron-react-mui --public --clone
cd template-electron-react-mui

# 2. Scaffold electron-vite + React + TypeScript
#    (scaffolds src/main, src/preload, src/renderer, electron-builder config)
npm create @quick-start/electron@latest . -- --template react-ts

# 3. Add the UI stack
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @fontsource/roboto

# 4. Commit the scaffold FIRST (subtree needs a clean tree with a commit)
git add -A && git commit -m "Scaffold electron-vite react-ts with MUI"
git branch -M main

# 5. Wire in the harness core
git subtree add --prefix .harness-core https://github.com/Trewaters/ai-harness-core.git main --squash

# 6. Copy fragments: the SPA baseline, the MUI fragment, then this pack
mkdir -p ai/fragments
cp .harness-core/fragments/packs/react-vite-spa/[0-9]*.md ai/fragments/
cp .harness-core/fragments/packs/react-vite-mui-pwa/45-mui-material-ui.md ai/fragments/
cp .harness-core/fragments/packs/electron-react-mui/[0-9]*.md ai/fragments/
# ...then apply the trim guidance above to the copied baseline fragments

# 7. Copy skills
mkdir -p .claude/skills
cp -r .harness-core/skills/electron-verify .claude/skills/
cp -r .harness-core/skills/frontend-ui-design .claude/skills/
cp -r .harness-core/skills/staged-commit-workflow .claude/skills/
cp -r .harness-core/skills/changelog-update .claude/skills/
cp -r .harness-core/skills/pr-checklist .claude/skills/

# 8. Generate the instruction files
bash .harness-core/scripts/build-instructions.sh

# 9. Commit, push, mark as template
git add -A && git commit -m "Add harness core, Electron/MUI fragments, skills, generated instructions"
git push -u origin main
gh repo edit Trewaters/template-electron-react-mui --template
```

Then hand-finish the scaffold so the template actually demonstrates the rules (an agent working in the template repo can do this from the fragments):

- `src/renderer/src/theme.ts` — `createTheme` with `cssVariables: true` and light/dark `colorSchemes`; `ThemeProvider` + `CssBaseline` at the renderer root
- `src/main/` split into modules per the `41-` fragment: window creation, IPC registration, and menu each in their own file; `webPreferences` per the `42-` fragment on every window
- `src/preload/index.ts` — a typed `window.api` via `contextBridge` with at least one `invoke`-based call and one main→renderer event subscription, plus the shared types module all three targets import
- `will-navigate` denial, `setWindowOpenHandler` + `shell.openExternal` allowlisting, and the CSP meta tag in `src/renderer/index.html`
- `electron-builder.yml` — stable `appId`, per-OS icons, explicit `files` allowlist; an update-notification component wired to the updater's IPC events
- Vitest + Testing Library for the renderer per the `50-` fragment, since the scaffold does not add them
