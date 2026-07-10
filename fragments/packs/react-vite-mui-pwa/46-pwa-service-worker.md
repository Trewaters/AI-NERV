# PWA And Service Worker Rules

Use this fragment for Vite-built SPAs that ship as installable Progressive Web Apps with an offline-capable service worker.

## Stack assumptions

- `vite-plugin-pwa` generates the service worker and injects the manifest; it is the only service-worker mechanism in the repo
- Workbox (via the plugin's `generateSW` mode) handles caching strategies
- The app is served over HTTPS in every deployed environment (service workers require it)

If the target repo differs from these assumptions, trim this fragment before using it.

## Service worker rules

- All service-worker behavior is configured through the `VitePWA` plugin options in `vite.config.ts`. Never hand-edit generated service-worker output, and never register a second service worker.
- The repo picks one update strategy and documents it in the plugin config:
  - `registerType: 'prompt'` (default choice) — show an in-app "update available" affordance and reload on user confirmation. Required when the app has forms or long-lived editing sessions, so an update never destroys in-progress work.
  - `registerType: 'autoUpdate'` — acceptable only for read-mostly apps where a silent reload cannot lose user state.
- Precache only the built app shell (Workbox's default `globPatterns` over `dist`). Do not add API responses or user data to the precache manifest.
- Runtime caching is explicit per route pattern:
  - Immutable third-party assets (fonts, CDN images): `CacheFirst` with an expiration plugin (max entries and max age set — unbounded caches are a defect).
  - API data reads: `NetworkFirst` with a short timeout, only for endpoints that are safe to serve stale.
  - Never runtime-cache authenticated, per-user, or personal-data endpoints unless a fragment or ADR in the repo explicitly authorizes it; a shared cache of private responses is a data leak.
  - Never cache non-GET requests.
- `navigateFallback` points at `index.html` so client-side routes work offline, and `navigateFallbackDenylist` excludes API and auth paths so backend routes are never swallowed by the SPA fallback.
- `index.html` itself must never be served cache-first; stale HTML pinning old asset hashes is the classic "app broken until hard refresh" bug.

## Manifest and install rules

- The manifest (configured in the plugin, not a hand-maintained file) always includes: `name`, `short_name`, `description`, `start_url`, `display: 'standalone'`, `theme_color`, `background_color`, and icons at 192×192 and 512×512 plus a 512×512 `purpose: 'maskable'` icon.
- `theme_color` matches the MUI theme's primary surface color; when the theme changes, both change together.
- Icon source files live in the repo and generated sizes are committed; a missing icon size fails install audits silently, so verify them rather than assume.
- iOS does not honor most of the manifest: keep the `apple-touch-icon` link tag and test installed behavior on iOS separately. Do not promise install prompts there — Safari has none.

## Offline behavior rules

- Define what works offline; do not imply everything does. Detect offline state (`navigator.onLine` plus fetch failures) and show it in the UI instead of letting requests fail silently or spin forever.
- Never fake success offline: a write that could not reach the backend is reported to the user as not saved. Queued/background-sync writes are a deliberate feature with their own design, tests, and conflict story — never a default.
- Treat cached data as possibly stale in the UI when it matters (timestamps, refresh affordances), especially for anything the user acts on.

## Verification rules

- Service-worker and install behavior only exist in production builds. Verify PWA changes against `npm run build` + `npm run preview`, never the dev server. If the plugin's `devOptions.enabled` is on, treat dev behavior as approximate.
- After changing caching config, test the update path: build, load, rebuild with a visible change, reload, and confirm the new version arrives via the chosen update strategy without a hard refresh.
- Any change to plugin config, caching strategy, or the manifest gets called out explicitly in the PR description — cache bugs ship silently and persist on user devices, so reviewers must see them.
