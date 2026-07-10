---
name: hugo-verify
description: Verify a Hugo site or theme builds clean and ships correct output before release — production build with warnings-as-errors, template lookup and unused-template audit, head/SEO surface, asset pipeline (fingerprint/SRI, image processing), internal links, and publish-surface hygiene (drafts, secrets, robots). Use before merging changes that touch layouts/, assets/, config, archetypes, or shortcodes — or when the user asks to "check the theme", "verify the build", or "audit the site".
argument-hint: "Optional: 'config-only' to skip the build and audit templates/config statically"
---

# Hugo Verify

Release-check a Hugo site the way a senior dev would: against a production
build with warnings treated as failures, because Hugo templates fail by
silently emitting wrong markup, not by crashing. This skill verifies; it does
not fix. Report findings and let the user decide, unless they asked for fixes
in the same request.

## What This Skill Produces

A pass/fail checklist across five areas — build health, template hygiene,
head/SEO surface, asset pipeline, publish safety — with a file:line reference
and a one-line consequence for every failure.

## When to Use

Use this skill when:

- A change touches `layouts/`, `assets/`, `config/`/`hugo.toml`,
  `archetypes/`, shortcodes, or render hooks.
- The user asks to verify the theme, the build, links, or SEO output.
- A theme or new site is being stood up and needs its baseline confirmed.

Do not use this skill when:

- The repo is not a Hugo site (no `hugo.toml`/`config/` with Hugo keys —
  nothing to verify; say so).
- The question is about site *strategy* (IA, content plan) rather than
  correctness of what is built; answer that directly.

## Inputs

- Optional flag: `config-only` — skip the build steps (1–2) and run only the
  static audits (3–6). Use when Hugo is not installed in the environment.

## Procedure

1. **Build for production.** Run
   `hugo --gc --minify --printPathWarnings --printUnusedTemplates --panicOnWarning`
   (add `--source exampleSite --themesDir ../..` variant when verifying a
   standalone theme). Any warning, path collision, or unused template is a
   finding, not noise. Confirm `hugo version` meets the repo's
   `module.hugoVersion.min` and is the extended edition if `css.Sass` or
   image processing to WebP is used.
2. **Probe the output.** In `public/`, confirm: no `draft`/future content
   leaked (spot-check against front matter), `sitemap.xml` and the RSS feed
   exist if enabled, `404.html` exists, and fingerprinted asset filenames
   referenced in `index.html` exist on disk.
3. **Audit templates** in `layouts/`:
   - Templates extend `baseof.html` via `{{ define "main" }}`; no duplicated
     `<head>` markup outside the head partial.
   - Every `partialCached` call passes variant keys for anything that varies
     per page/section; flag cached partials rendering active-nav state
     without a variant.
   - Collection loops use `site.RegularPages` (not `site.Pages`) for content
     listings; `where`/`sort` results are hoisted out of inner loops.
   - No `_default/` directory in a v0.146+ theme claiming the new lookup
     system.
4. **Audit the head/SEO surface** in the built `index.html` and one content
   page: exactly one `<title>` and one meta description, canonical link
   present, Open Graph/Twitter tags emitted once (not duplicated by both
   internal templates and a custom partial), JSON-LD (if any) is valid JSON.
5. **Audit escaping and asset safety**:
   - `markup.goldmark.renderer.unsafe` is `false`; grep `layouts/` for
     `safeHTML`, `safeJS`, `safeURL` and flag any application to front
     matter, `.Params`, or `data/` values.
   - Asset partials pipe through `minify | fingerprint` in production and
     emit `integrity`; no third-party CDN `<script>`/`<link>` tags.
   - Image render hook / figure shortcode writes `width`, `height`, and
     requires alt text.
6. **Audit publish hygiene**: grep config, `data/`, and `static/` for
   secrets/tokens/internal URLs; confirm CI deploy uses a pinned extended
   Hugo version, production environment, and does not pass `-D`/`-F`/`-E`;
   `public/` and `.hugo_build.lock` are gitignored.
7. **Check internal links.** If htmltest (or equivalent) is available, run it
   over `public/`; otherwise grep built HTML for `href` targets that don't
   exist in `public/` on a sample of pages and mark full coverage `MANUAL`.
8. **Report.** Emit the Output Template. Do not fix findings unless the user
   asked for verification *and* fixes.

## Decision Rules

1. If the build fails or `--panicOnWarning` trips, stop and report that
   first — everything downstream is untestable.
2. If Hugo is not installed and no `config-only` flag was given, fall back to
   the static audits and say the build gate was not exercised.
3. If a check cannot be performed here (e.g. rendering in a real browser,
   external-link liveness), mark it `MANUAL` with one line on how the user
   can do it — never mark it passed.
4. Severity order for the report: leaked drafts/secrets > escaping misuse >
   broken links/assets > SEO duplication > build-time inefficiency.

## Quality Checks

Before reporting:

- Every failure cites a file (and line where possible) and states the user
  impact in one sentence.
- No finding is speculative — each was observed in config, templates, or
  built output, not inferred from convention.
- Any server started for probing has been stopped.

## Output Template

- `Build:` <pass/fail + Hugo version vs pin, warnings, path/unused-template findings>
- `Output:` <pass, or leaked drafts / missing sitemap/feed/404 / dangling asset refs>
- `Templates:` <pass, or partialCached/context/lookup findings>
- `Head & SEO:` <pass, or duplicate/missing title, description, canonical, OG>
- `Safety:` <pass, or each safeHTML/secret/CDN finding with its risk>
- `Links:` <pass/fail + tool used, or MANUAL>
- `Manual checks:` <anything only a browser or live deploy can confirm, with instructions>
- `Verdict:` <ship / fix first, one line>
