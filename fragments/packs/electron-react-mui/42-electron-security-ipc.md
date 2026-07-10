# Electron Security And IPC Rules

Use this fragment for every Electron repo. A renderer compromise in a misconfigured Electron app is remote code execution on the user's machine, so these rules are defects when violated, not style choices.

## Window security rules

- Every `BrowserWindow` sets `webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false }`. These are the app's security boundary; changing any of them is a security regression that needs explicit justification in the PR, not a workaround for a broken import.
- Never set `webSecurity: false`, `allowRunningInsecureContent: true`, or `experimentalFeatures: true` — not even "temporarily" in dev, because dev settings leak into releases.
- Privileged windows load only local, bundled content. Remote URLs, if the app needs them at all, get their own unprivileged window (or `shell.openExternal`) — never a window that has a preload API attached.

## Preload and contextBridge rules

- The preload script exposes one narrow, purpose-named API via `contextBridge.exposeInMainWorld` (`window.api.saveDocument(doc)`, `window.api.onUpdateReady(cb)`). Each function maps to one capability.
- Never expose `ipcRenderer`, `require`, Node built-ins, or a generic passthrough like `invoke(channel, ...args)` — a passthrough hands the whole IPC surface to any script that runs in the renderer.
- Declare the exposed API's type once (in the shared types module) and use it on both sides, so the renderer cannot call channels that do not exist and preload cannot drift from the contract.
- Wrap event subscriptions so the callback receives data only — never leak the raw `IpcRendererEvent` (it carries `sender`, a live IPC port) across the bridge. Subscription functions return an unsubscribe function so renderer components can clean up.

## IPC handler rules

- Use `ipcMain.handle` + `invoke` for request/response; reserve `send`/`on` for genuine one-way events (main pushing progress or update notifications to the renderer).
- Every handler treats its arguments as untrusted input: validate shape, type, and range in the main process before acting. The renderer having "already validated" does not count — a compromised renderer sends anything.
- Handlers that touch the filesystem resolve and normalize paths, then verify the result stays inside the directory the handler is allowed to serve (no `..` traversal). Handlers never interpolate renderer input into shell commands.
- For sensitive handlers, verify `event.senderFrame` is a frame the app created (check its URL) before acting — iframes and child windows share the IPC bus.
- Return failures as structured error results; never serialize raw `Error` objects with stack traces or internal paths back to the renderer.

## Navigation and external-content rules

- Deny navigation by default: handle `will-navigate` (and `will-attach-webview`) on every window and `event.preventDefault()` anything that is not the app's own content.
- Set `setWindowOpenHandler` on every window; return `{ action: 'deny' }` and route allowed links through `shell.openExternal`.
- `shell.openExternal` only receives URLs that parse as `http:`/`https:` — never raw user or remote input, which can launch arbitrary local programs via other protocols.
- Register a `setPermissionRequestHandler` that denies by default and allows only the specific permissions the app actually uses (e.g. media for a recorder feature).

## Renderer hardening rules

- The renderer's `index.html` carries a strict Content-Security-Policy meta tag — `default-src 'self'` as the baseline, widened only per directive with a comment saying why. No remote script sources, ever.
- Sanitize any user-generated or remote HTML before rendering, same as the SPA baseline — in Electron the blast radius of XSS is the IPC bridge, not just the page.
- Do not add dependencies that demand the sandbox be disabled or Node access in the renderer; find another library or move the work to main.
