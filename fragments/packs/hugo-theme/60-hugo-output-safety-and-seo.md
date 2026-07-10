# Hugo Output Safety and SEO

Rules for what a Hugo build is allowed to emit: escaping discipline, secret hygiene, and the discoverability surface (meta tags, feeds, sitemap). Applies to changes in `layouts/`, config, and `data/`.

## Escaping and trust rules

- `markup.goldmark.renderer.unsafe` stays `false`. If content authors need markup Markdown can't express, the answer is a shortcode or render hook, not enabling raw HTML.
- Go templates auto-escape by context — that is the security model. `safeHTML`, `safeJS`, `safeURL`, and `safeCSS` are only for site-owned, repo-committed strings (e.g. a copyright line in config). Never apply them to front matter, `data/` files, or anything a content author or external source controls.
- Building JSON (e.g. JSON-LD) in templates goes through `jsonify`, never hand-concatenated strings.
- Inline `<script>` blocks in templates must not interpolate page or param values without `safeJS`-free JSON encoding (`{{ $value | jsonify }}`); prefer moving script logic to a bundled asset with data passed via `data-` attributes.

## Publish-surface hygiene

- Everything in config, `data/`, `content/`, and `static/` should be treated as public the moment the site builds — no API keys, tokens, draft-only client names, or internal URLs anywhere Hugo can read.
- Drafts, future-dated, and expired content must not leak: production builds run without `-D`/`-F`/`-E`, and CI must not set them.
- `robots.txt` is deliberate: either Hugo's `enableRobotsTXT` with a template, or a static file — not both. Staging/preview deploys must send `noindex` (via environment config), production must not.

## Head and SEO rules

- One `<title>` and one `meta description` per page, populated from `page.Title` / `.Description` with a site-level fallback — never a hardcoded string.
- Every page emits a canonical URL (`.Permalink`); paginated list pages beyond page one must not claim the canonical of page one.
- Emit Open Graph and Twitter card tags from Hugo's embedded templates (`_internal/opengraph.html`, `_internal/twitter_cards.html`) or a single owned partial — not both, or tags duplicate.
- Structured data (JSON-LD) lives in one partial per type, built with `dict` + `jsonify`.
- The sitemap and RSS feed stay enabled unless the site owner explicitly opts out; cap RSS with `services.rss.limit` rather than shipping the full archive.
- Set `disableKinds` for output the site genuinely doesn't need (e.g. taxonomies on a brochure site) instead of leaving empty stub pages indexed.

## Accessibility

- Theme markup follows the shared inclusion/a11y fragment: landmarks (`header`/`nav`/`main`/`footer`), a skip link in `baseof.html`, exactly one `h1` per page from `page.Title`, heading levels that never skip.
- The image render hook and any figure shortcode must require alt text (empty `alt=""` only for decorative images, as an explicit choice) — enforce it with `errorf`/`warnf`, don't silently emit `alt=""`.
