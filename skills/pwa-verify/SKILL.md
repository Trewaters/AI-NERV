---
name: pwa-verify
description: Verify a Vite + vite-plugin-pwa app's installability and offline correctness before release — production build, manifest completeness, icon set, service-worker registration and update strategy, and caching-config safety. Use before merging changes that touch vite.config.ts PWA options, the manifest, icons, the service-worker update flow, or caching strategies — or when the user asks to "check the PWA", "verify offline", or "audit the manifest".
argument-hint: "Optional: 'config-only' to skip the build and audit configuration statically"
---

# PWA Verify

Release-check a Vite PWA the way a senior dev would: against the production
build, because service workers and install behavior do not exist in the dev
server. This skill verifies; it does not fix. Report findings and let the
user decide, unless they asked for fixes in the same request.

## What This Skill Produces

A pass/fail checklist across four areas — manifest, icons, service worker,
caching safety — with a file:line reference and a one-line consequence for
every failure.

## When to Use

Use this skill when:

- A change touches `VitePWA(...)` options, the manifest, icons, or
  service-worker registration/update code.
- The user asks to verify PWA behavior, installability, or offline support.
- A template or new app is being stood up and needs its PWA baseline
  confirmed.

Do not use this skill when:

- The repo has no `vite-plugin-pwa` (nothing to verify — say so).
- The question is about PWA *strategy* rather than correctness of what is
  configured; answer that directly.

## Inputs

- Optional flag: `config-only` — skip the build/preview steps (1–2) and run
  only the static checks (3–6). Use when the environment cannot run a build.

## Procedure

1. **Build for production.** Run the repo's build (`npm run build`). A PWA
   check against a failing or dev build is void. Confirm `dist/` contains
   `sw.js` (or the configured SW filename) and `manifest.webmanifest`.
2. **Serve and probe.** Run `npm run preview` in the background. Fetch the
   served `index.html` and confirm it links the manifest and registers the
   service worker; fetch `manifest.webmanifest` and the SW file and confirm
   both return 200 with sane content types. Stop the preview server when done.
3. **Audit the manifest** (from the plugin config, then the built output):
   `name`, `short_name`, `description`, `start_url`, `display`,
   `theme_color`, `background_color` all present; icons include 192×192,
   512×512, and a 512×512 `purpose: 'maskable'` entry. Confirm `theme_color`
   matches the app theme's primary surface color rather than a stale default.
4. **Audit the icons.** Every icon path in the manifest resolves to a real
   file in `public/` (or the built output), and each file's actual pixel
   dimensions match its declared `sizes`. Check `index.html` for an
   `apple-touch-icon` link.
5. **Audit the service-worker setup** in `vite.config.ts` and the
   registration code:
   - `registerType` is explicit. If `'prompt'`, an update UI is actually
     wired to `useRegisterSW`/`registerSW` — a prompt strategy with no
     prompt component means users never get updates.
   - `navigateFallback` exists for SPA routing, and
     `navigateFallbackDenylist` excludes API/auth paths.
   - No second service-worker registration anywhere in `src/`
     (`grep` for `serviceWorker.register`).
6. **Audit caching safety** in the `workbox` runtime-caching config:
   - Every `CacheFirst` entry has an expiration plugin (max entries + max
     age).
   - No pattern matches authenticated or per-user API endpoints; flag any
     `runtimeCaching` pattern that overlaps routes requiring auth.
   - No handler caches non-GET requests.
   - Nothing serves `index.html` cache-first.
7. **Report.** Emit the Output Template. Do not fix findings unless the user
   asked for verification *and* fixes.

## Decision Rules

1. If the build fails, stop and report the build failure — everything else
   is untestable.
2. If the repo uses `injectManifest` (custom SW source) instead of
   `generateSW`, run the same checks against the custom SW source and say
   the caching audit is best-effort.
3. If a check cannot be performed in this environment (e.g. no browser for a
   true offline reload), mark it `MANUAL` with one line on how the user can
   do it in DevTools — never mark it passed.
4. Severity order for the report: caching of private data > broken update
   path > install blockers (manifest/icons) > polish.

## Quality Checks

Before reporting:

- Every failure cites a file (and line where possible) and states the user
  impact in one sentence.
- No finding is speculative — each was observed in config, output, or a
  probe, not inferred from convention.
- The preview server started in step 2 has been stopped.

## Output Template

- `Build:` <pass/fail + SW and manifest present in dist>
- `Manifest:` <pass, or missing/wrong fields>
- `Icons:` <pass, or missing sizes / dimension mismatches>
- `Service worker:` <update strategy + registration findings>
- `Caching safety:` <pass, or each unsafe pattern with its risk>
- `Manual checks:` <anything only DevTools can confirm, with instructions>
- `Verdict:` <ship / fix first, one line>
