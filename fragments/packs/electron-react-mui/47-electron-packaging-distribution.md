# Electron Packaging, Updates, And Distribution

Use this fragment for Electron repos that ship installable builds to end users with electron-builder.

## Packaging rules

- electron-builder is the only packaging mechanism; its configuration lives in one place (`electron-builder.yml` or the `build` key in `package.json`), not split across both.
- `appId` is a stable reverse-DNS identifier chosen once before the first release and never changed afterward — changing it orphans users' data directories and breaks update continuity on macOS and Windows.
- `asar` stays enabled. Native modules or binaries that must exist as real files go in `asarUnpack`, not by disabling asar for the whole app.
- The `files` list is an explicit allowlist of build output; source files, tests, docs, and dev configs must not end up inside the shipped archive. When in doubt, list the packaged app's contents and check.
- Ship real icons for every target OS (`.ico`, `.icns`, and PNG for Linux); a default Electron icon in a release is a defect.
- `version` in `package.json` is the single source of truth for the app version; release tags match it.

## Code-signing rules

- Every distributed build is code-signed: Authenticode on Windows, Developer ID plus notarization on macOS. Unsigned output is a local dev artifact only and never handed to a user — modern OSes block or scare-screen it, and auto-update requires consistent signatures.
- Signing certificates and notarization credentials live in CI secrets, never in the repo or in electron-builder config committed to git.

## Auto-update rules

- electron-updater is the update mechanism; the update feed is HTTPS only.
- Check for updates after `app.whenReady()`, off the startup critical path. Update failures are logged and silent — never an error dialog on launch for a background check.
- Updates are prompt-based: notify the renderer when an update is downloaded and let the user choose "restart now" or "on next launch". Never force-restart the app while the user may have unsaved work.
- The update-ready notification travels over the same typed IPC event channel rules as everything else — no special cases.

## Hardening the packaged binary

- Flip Electron fuses off for capabilities the shipped app does not use — at minimum `runAsNode`, `enableNodeOptionsEnvironmentVariable`, and `enableNodeCliInspectArguments` (via `@electron/fuses` or electron-builder's fuse support). These stop the packaged binary from being repurposed as a generic Node executable.
- Production builds do not open DevTools and do not expose a debug port.

## User-data and migration rules

- Everything the app persists lives under `app.getPath('userData')` and is versioned: when the stored shape changes, ship a migration, because updated apps read data written by every prior version.
- Uninstalling must not require the app to have write access to its install directory at runtime; never store state next to the executable.

## Release verification rules

- Before any release, build the packaged app (`electron-builder`, not just `electron-vite build`) and smoke-run the installed artifact: launch, open the main window, exercise one IPC round-trip, and check the packaged paths. Dev mode differs from the packaged app in exactly the ways that break releases (asar, file URLs, CSP, working directory).
- Verify the packaged build on the OS being released for; cross-compiled artifacts still need a native smoke test before shipping.
