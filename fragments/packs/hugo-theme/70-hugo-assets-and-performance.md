# Hugo Assets and Performance

Rules for CSS/JS/image handling through Hugo Pipes and for keeping both build time and page weight down. Applies to changes in `assets/`, asset-related partials, and image markup.

## CSS and JS pipeline rules

- All stylesheets and scripts live in `assets/` and flow through Hugo Pipes in a head/footer partial: Sass via `css.Sass` (dart-sass or the extended edition's libsass), JS via `js.Build` (esbuild).
- Production assets are minified and fingerprinted: `... | minify | fingerprint`, emitted with `integrity` set from `.Data.Integrity`. Development skips minification via `hugo.IsProduction` branching in the asset partial — nowhere else.
- One CSS entry point and one JS entry point per document shell; components add Sass partials / JS modules that the entry points import, not extra `<link>`/`<script>` tags.
- No CDN `<script>`/`<link>` tags for libraries; vendor the asset into `assets/` (or `hugo mod` mount it) so the site has no third-party runtime dependency and SRI stays possible.
- JS is progressive enhancement: core content and navigation must work with scripting disabled — this is a static site, keep it one.

## Image rules

- Content images live in the page's bundle (leaf-bundle resources) or `assets/`, not `static/`, so Hugo image processing can reach them.
- All content images render through the image render hook (`layouts/_markup/render-image.html`) or a figure shortcode that: resizes to a sensible width cap, generates a `srcset` (with a WebP variant via `.Process "webp"` where it wins), and always writes `width`/`height` attributes to prevent layout shift.
- Below-the-fold images get `loading="lazy"` and `decoding="async"`; the LCP/hero image must not be lazy-loaded.
- Never commit pre-generated size variants; commit one source image and let Hugo derive the rest. `resources/_gen/` may be committed to speed up CI builds — decide per repo and note it in the repo's README.

## Listing and pagination rules

- Any list that can grow unbounded paginates with `.Paginate`; call `.Paginate` exactly once per template (Hugo errors on conflicting calls — don't work around it, restructure).
- Set `pagination.pagerSize` in config rather than passing sizes at call sites.

## Build performance rules

- Expensive shared partials (nav trees, tag clouds, footers that walk collections) use `partialCached` with correct variant keys — this is the single biggest Hugo build-time lever.
- Don't rebuild collections inside a range: hoist `where`/`sort` results into a variable before the loop, and never nest full-site scans inside per-page templates.
- When builds feel slow, measure before optimizing: `hugo --templateMetrics --templateMetricsHints` names the offending templates; fix the top entries, not by guesswork.
- Image processing is cached in `resources/_gen/`; a CI setup that discards this cache pays full image-processing cost every build — persist it.
