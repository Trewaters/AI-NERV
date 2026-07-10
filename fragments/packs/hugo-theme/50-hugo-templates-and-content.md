# Hugo Templates and Content

Rules for Go-template layout work and content structure in Hugo repos. Applies whenever a change touches `layouts/`, `archetypes/`, `content/`, or shortcodes.

## Template layout rules (v0.146+ lookup system)

- Use the flattened layout: `layouts/baseof.html`, `layouts/home.html`, `layouts/page.html`, `layouts/list.html`, `layouts/section.html`, `layouts/taxonomy.html`, `layouts/term.html`, `layouts/404.html`. Do not create a `_default/` directory in new themes.
- Scope overrides by directory, not by inventing template names: a section-specific single template is `layouts/<section>/page.html`, its list is `layouts/<section>/list.html`.
- Every page template extends the base template: `{{ define "main" }}` inside a template that Hugo resolves against `baseof.html`. One `baseof.html` per theme unless a section genuinely needs a different document shell.
- Keep `<head>` markup in one partial (e.g. `partials/head.html`) invoked from `baseof.html`; never duplicate meta/asset tags across templates.
- Before adding a new template file, check the lookup order actually reaches it — a template Hugo never selects is dead code. `hugo --printUnusedTemplates` must come back clean.

## Partial and context rules

- Partials take an explicit context; pass exactly what they need (`{{ partial "card.html" . }}` or a dict), never rely on a partial reaching into globals it wasn't given — except the `site` and `page` global functions, which are always acceptable.
- Inside any partial that can be called from varied contexts, prefer `site.` and `page.` over `.Site` and `.Page` so the partial does not break when the dot changes.
- Use `partialCached` for partials whose output is identical across pages (header, footer, nav) and pass variant keys for anything that differs (`{{ partialCached "nav.html" . page.Section }}`). A `partialCached` with missing variant keys serves the wrong page's markup — when in doubt, use plain `partial`.
- A partial that computes and returns a value uses `return`; do not emit whitespace from logic-only partials.
- Iterate collections with the right base: `site.RegularPages` for content listings, never `site.Pages` (which includes sections, taxonomies, and terms). Filter with `where` and cap with `first` before ranging.
- Use `with` to guard optional values instead of chained `if isset` checks.

## Shortcode rules

- Raw HTML in Markdown content is a defect (Goldmark strips it under `unsafe = false` — correctly). Any repeated rich markup authors need becomes a shortcode in `layouts/_shortcodes/`.
- Shortcodes validate their arguments and `errorf` with the position (`{{ errorf "%s: missing 'src'" .Position }}`) instead of rendering silently broken output.
- Prefer Hugo's built-in shortcodes and render hooks (link, image, heading render hooks in `layouts/_markup/`) over reinventing them.

## Content structure rules

- Use page bundles: a page with its own images/resources is a leaf bundle (`content/post/my-post/index.md` + assets beside it); sections are branch bundles (`_index.md`). Never confuse `index.md` and `_index.md`.
- Every archetype in `archetypes/` produces valid front matter for its section; when adding a content type, add its archetype in the same change.
- Required front matter on every page: `title`, `date`, `description`. Drafts use `draft = true`, never a commented-out file or a name prefix convention.
- Declare taxonomies in config before using them in front matter; front-matter keys use the plural form (`tags`, `categories`).
- Define menus in config (`menus.toml`) or front matter — one mechanism per menu. Mark the active item with `.IsMenuCurrent`/`.HasMenuCurrent`, not URL string comparison.

## Multilingual rules

- All user-visible theme strings go through `i18n` keys (`{{ i18n "readMore" }}`) with at least the default language file in `i18n/` — even on single-language sites, so the theme stays translatable.
- Never concatenate translated fragments into sentences; make each full sentence its own key.
