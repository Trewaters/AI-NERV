# Hugo Quality Gates and Release

What must pass before a Hugo change merges, and how the site/theme ships. Applies to every PR and to release/deploy work.

## Build gate rules

- The merge gate is a clean production build: `hugo --gc --minify --printPathWarnings --printUnusedTemplates` with **zero warnings**. Treat warnings as failures in CI (`hugo --panicOnWarning`); a warning someone learned to ignore is a bug someone will ship.
- Path warnings (two pages claiming one output path) and unused templates are defects to fix in the same PR that introduced them, not backlog items.
- If the theme carries an `exampleSite/`, it builds in CI with the same flags, against the theme via mount/module — a theme PR that only tested the author's site is half-tested.
- Verify locally with `hugo server` before pushing, and check the actual pages the change touches — Hugo's fast rebuilds make "I didn't look at it rendered" inexcusable.

## Link and output checks

- Run a link checker (htmltest or equivalent) over `public/` in CI; internal 404s block merge, external-link failures report as warnings.
- Prefer `ref`/`relref` (or the link render hook resolving page paths) for internal links in content so renames break the build instead of the reader.
- Spot-check emitted HTML for the pages a template change affects — templates fail by producing wrong markup silently, not by erroring.

## Theme release rules

- A publishable theme carries: `LICENSE`, `README.md` with install + config docs for every `params` key it reads, `theme.toml` metadata, `images/screenshot.png` (1500×1000) and `images/tn.png` (900×600), and a `hugoVersion.min` pin that is actually tested.
- Version the theme with git tags (semver). Breaking a `params` key name, a template block name, or a shortcode signature is a major bump and gets a migration note in the changelog.
- Never edit generated output in `public/` — it is disposable and must be gitignored.

## Deployment rules

- Deploys build in CI from a pinned Hugo version (extended), never from a locally built `public/` pushed by hand.
- Production builds set `--environment production` (or run with `HUGO_ENVIRONMENT=production`) so environment config, `noindex` staging behavior, and analytics gating work as designed.
- `baseURL` per environment comes from environment config or the `--baseURL` flag in the deploy workflow — never edited back and forth in `hugo.toml`.
- After deploy, verify the live site once: homepage renders, CSS/JS fingerprinted assets load (no 404s from a stale cache config), and the sitemap URL responds.
