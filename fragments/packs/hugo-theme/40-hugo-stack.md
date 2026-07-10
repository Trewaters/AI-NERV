# Hugo Theme Site Baseline

Use this fragment for static websites built with Hugo where the repo owns both the site content and the Go-template theme.

## Stack assumptions

- Hugo **extended** edition, v0.146.0 or newer (the flattened template lookup system) — pin the minimum in config with `module.hugoVersion.min` and `module.hugoVersion.extended = true`
- Go html/template + text/template ("Go templates") as the only templating system
- Goldmark for Markdown rendering with `markup.goldmark.renderer.unsafe = false`
- No Node/npm toolchain unless the repo has already added one; Hugo Pipes handles Sass, JS bundling, minification, and fingerprinting natively
- Content authored in Markdown with front matter; data in `data/` as TOML/YAML/JSON

If the target repo differs from these assumptions, trim this fragment before using it.

## Version and toolchain rules

- Never write templates that need a newer Hugo than `module.hugoVersion.min`; if a feature requires a newer version, raise the pin in the same change and say so in the commit.
- CI and deploy environments must install the exact pinned Hugo version, extended edition — a build that only works on someone's laptop Hugo is a broken build.
- Do not add npm, Gulp, or Webpack for asset processing; use Hugo Pipes (`css.Sass`, `js.Build`, `minify`, `fingerprint`). Only add external tooling for something Hugo genuinely cannot do, and justify it in the PR.

## Configuration rules

- The config file is `hugo.toml` (not the deprecated `config.toml` name).
- When config grows past one screen, split it into `config/_default/` (`hugo.toml`, `params.toml`, `menus.toml`, `markup.toml`) instead of one long file.
- Environment-specific overrides go in `config/production/` and `config/development/` — never branch on environment inside templates when a config override can do it.
- Every custom `params` key a template reads must have a default in config; templates must not assume a param exists (`site.Params.foo | default ...` or a config default, pick one and be consistent — prefer config defaults).
- `baseURL` is set in config and never hardcoded in content or templates; build URLs with `relURL`, `absURL`, `.RelPermalink`, or `.Permalink`.

## Directory layout rules

- Respect Hugo's meaning for each top-level directory: `archetypes/`, `assets/`, `content/`, `data/`, `i18n/`, `layouts/`, `static/`, `config/`.
- Anything that needs processing (Sass, JS, images to resize) lives in `assets/`; `static/` is only for files that must be copied through byte-for-byte at a stable URL (favicons, `robots.txt`, verification files).
- Site-specific overrides of theme templates go in the site's `layouts/` mirroring the theme's path — never edit a vendored theme in place.

## Theme boundary rules

- The theme owns presentation: `layouts/`, `assets/`, `i18n/`, theme-level `archetypes/`, and theme config defaults. The site owns `content/`, `data/`, site config, and site params.
- Do not hardcode site-specific strings (site name, social handles, analytics IDs) in theme templates; read them from `site.Title`, `site.Params`, or `data/`.
- When the theme is developed for reuse, it carries an `exampleSite/` that exercises every template and shortcode; a theme change that `exampleSite` cannot demonstrate is untested.
- Consume reusable themes as Hugo Modules (`hugo mod get`) or a git submodule — pick one mechanism per repo and never mix them.
