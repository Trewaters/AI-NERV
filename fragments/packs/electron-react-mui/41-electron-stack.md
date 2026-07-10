# Electron Stack And Process Model

Use this fragment for repositories that build a desktop app with Electron, a React renderer, and electron-vite as the build tool.

## Stack assumptions

- Node.js 22.x and the current stable Electron major; Electron is upgraded promptly when security releases land
- electron-vite for dev server, HMR, and production builds of all three bundles
- TypeScript in `strict` mode across main, preload, and renderer
- npm as the package manager; electron-builder for packaging (see the packaging fragment)
- Three-target source layout: `src/main/`, `src/preload/`, `src/renderer/`

If the target repo differs from these assumptions, trim this fragment before using it.

## Process-model rules

- Code belongs to exactly one process. Main owns app lifecycle, windows, menus, tray, dialogs, filesystem, and every other Node/OS capability. The renderer is browser code only. The preload script is only a bridge — no business logic.
- Never enable `nodeIntegration` or import Node built-ins in the renderer to make something work. Move the capability into the main process and expose a narrow function over IPC instead.
- One module in the renderer wraps the preload-exposed API (`window.api`); components call that module, never `window.api` directly. This is the desktop equivalent of the SPA rule to centralize backend access in an API client layer.
- The main process is the trusted side. Where the SPA baseline says "the backend enforces authorization and validation", read "the main process's IPC handlers" — every check the renderer does is UX only.
- Shared request/response types live in one shared module (commonly `src/shared/`) imported by main, preload, and renderer, so the IPC contract cannot drift between processes.

## Main-process structure rules

- Keep `src/main/index.ts` thin: app lifecycle and wiring only. Window creation, IPC handler registration, menu definitions, and updater logic each live in their own module.
- Register every IPC handler exactly once, at startup — never inside event callbacks or per-window code, where re-registration throws or duplicates work.
- Do blocking work (`fs` sync calls, heavy computation) off the main process's critical path; a blocked main process freezes every window's input handling.

## Configuration and environment rules

- Renderer code reads env values through `import.meta.env` with the `RENDERER_VITE_` prefix; main and preload use `MAIN_VITE_` / `PRELOAD_VITE_` prefixes. Anything with a renderer prefix ships in the app bundle and is public.
- Secrets never appear in renderer or preload code. If the app must hold a user credential or token, the main process stores it with `safeStorage` (OS keychain-backed), not in a plain file or env var.
- All persistent app data goes under `app.getPath('userData')`. Never write to the install directory — it is read-only on end-user machines.

## Dev/prod parity rules

- Dev mode and the packaged app differ (file URLs, asar archives, working directory, DevTools). Resolve file paths from `app.getAppPath()` / `__dirname`-relative logic that works in both, never from `process.cwd()`.
- Gate dev-only behavior (DevTools auto-open, dev server URL loading) on `app.isPackaged` or the electron-vite `is.dev` helper, not on custom env flags.
