---
name: electron-verify
description: Verify an Electron app's security posture and packaging readiness before release — BrowserWindow webPreferences, preload/contextBridge surface, IPC handler validation, navigation and external-content lockdown, CSP, and electron-builder config. Use before merging changes that touch main-process code, the preload script, window creation, or packaging config — or when the user asks to "check Electron security", "audit the IPC surface", or "verify the build config".
argument-hint: "Optional: 'packaged' to also build with electron-builder and inspect the artifact"
---

# Electron Verify

Release-check an Electron app the way a senior dev would: the renderer is
untrusted, so every finding is judged by what a compromised renderer could do
with it. This skill verifies; it does not fix. Report findings and let the
user decide, unless they asked for fixes in the same request.

## What This Skill Produces

A pass/fail checklist across five areas — window security, preload/IPC
surface, navigation and external content, renderer hardening, packaging —
with a file:line reference and a one-line consequence for every failure.

## When to Use

Use this skill when:

- A change touches `BrowserWindow` creation, `webPreferences`, the preload
  script, `ipcMain` handlers, or electron-builder config.
- The user asks to verify Electron security, the IPC surface, or release
  readiness.
- A template or new app is being stood up and needs its Electron baseline
  confirmed.

Do not use this skill when:

- The repo does not depend on `electron` (nothing to verify — say so).
- The question is about Electron *architecture* rather than correctness of
  what is configured; answer that directly.

## Inputs

- Optional flag: `packaged` — additionally run the electron-builder build
  and inspect the produced artifact (slow; requires the target OS tooling).
  Without it, all checks are static.

## Procedure

1. **Map the surface.** Find every `new BrowserWindow` call, the preload
   entry file(s), every `ipcMain.handle`/`ipcMain.on` registration, and the
   packaging config (`electron-builder.yml` or the `build` key in
   `package.json`).
2. **Audit window security.** For each window: `contextIsolation: true`,
   `sandbox: true`, `nodeIntegration: false` (explicitly or by the Electron
   version's default — state which). Flag any `webSecurity: false`,
   `allowRunningInsecureContent: true`, or a remote URL loaded into a window
   that has a preload attached.
3. **Audit the preload surface.** Everything crossing `contextBridge` is
   enumerable: flag any exposure of `ipcRenderer` itself, Node built-ins, or
   a generic channel passthrough (`invoke(channel, ...)`). Confirm event
   subscriptions strip the `IpcRendererEvent` and return an unsubscribe
   function.
4. **Audit IPC handlers.** For each handler: arguments are validated in main
   (shape/type/range) before use; filesystem paths are resolved and checked
   against an allowed root; no renderer input reaches a shell command;
   sensitive handlers check `event.senderFrame`. Flag handlers that return
   raw `Error` objects to the renderer.
5. **Audit navigation lockdown.** Every window has a `will-navigate` handler
   that denies by default and a `setWindowOpenHandler` returning
   `{ action: 'deny' }`; external links go through `shell.openExternal`
   behind an `http(s)`-only check; a `setPermissionRequestHandler` exists
   and denies by default.
6. **Audit renderer hardening.** The renderer `index.html` has a CSP meta
   tag with `default-src 'self'` (flag `unsafe-inline`/`unsafe-eval` in
   `script-src`); no remote `<script>` sources; grep `src/renderer/` for
   Node built-in imports and `require(` — any hit is a boundary violation.
7. **Audit packaging config.** `appId` is a stable reverse-DNS id; `asar` is
   not disabled; the `files` list excludes sources/tests/dev config; icons
   exist for each configured target; fuses config (if present) disables
   `runAsNode`. Confirm `version` in `package.json` is the only version
   source.
8. **(`packaged` flag only) Build and inspect.** Run the electron-builder
   build, then list the artifact's asar contents and confirm no source/test
   files shipped and the app launches to its main window.
9. **Report.** Emit the Output Template. Do not fix findings unless the user
   asked for verification *and* fixes.

## Decision Rules

1. If `contextIsolation` is false or `nodeIntegration` is true anywhere,
   report that first as the headline finding — every other renderer check is
   moot until it is fixed.
2. If the repo pins an old Electron major with known advisories
   (`npm ls electron` vs. current stable), report it under packaging even
   though no config line is "wrong".
3. If a check cannot be performed in this environment (e.g. no OS tooling
   for a packaged build), mark it `MANUAL` with one line on how the user can
   do it — never mark it passed.
4. Severity order for the report: renderer→OS escalation paths (window
   flags, preload passthrough, unvalidated IPC) > navigation/external
   content > CSP > packaging/signing > polish.

## Quality Checks

Before reporting:

- Every failure cites a file (and line where possible) and states the
  attacker capability or user impact in one sentence.
- No finding is speculative — each was observed in code or config, not
  inferred from convention.
- Windows created indirectly (helper functions, `window.open` with
  overrides) were traced to their effective `webPreferences`, not skipped.

## Output Template

- `Window security:` <pass per window, or each unsafe flag>
- `Preload/IPC surface:` <pass, or each over-broad exposure / unvalidated handler>
- `Navigation:` <pass, or missing will-navigate / window-open / permission handlers>
- `Renderer hardening:` <CSP verdict + any Node leakage into renderer>
- `Packaging:` <appId/asar/files/icons/fuses findings>
- `Manual checks:` <anything needing a packaged run or target OS, with instructions>
- `Verdict:` <ship / fix first, one line>
