# Hugo Theme Website Pack

Reusable fragment pack for static websites built with Hugo where the repo owns both the content and a custom Go-template theme:

- Hugo **extended**, v0.146.0+ (the flattened template lookup system), pinned via `module.hugoVersion`
- Go templates only; Goldmark Markdown with raw HTML disabled
- Hugo Pipes for Sass/JS/minify/fingerprint — no Node toolchain
- Content as Markdown page bundles; theme strings through `i18n`

Unlike the React packs, this pack is a **standalone baseline** — it does not layer on `react-vite-spa` or any other pack. The shared core fragments (`00-philosophy`, `10-commit-conventions`, `20-security`, `25-inclusion`, `30-freelance-context`) still come first via the build script; this pack's fragments are numbered `40`–`80` to read after them.

What it assumes:

- The repo is the site *and* the theme (theme developed in-repo, optionally published for reuse with an `exampleSite/`)
- `hugo.toml` (or split `config/_default/`) is the config; environment overrides live in `config/production/` etc.
- Deploys build in CI from a pinned Hugo version; `public/` is never committed

How to use it in a new repo:

1. Copy this pack's numbered fragments into the consuming repo's `ai/fragments/`.
2. Keep the numeric prefixes so ordering stays stable.
3. Delete any rules that are not true for that repo (e.g. drop the multilingual rules for a hard single-language site, or the theme-release rules if the theme will never be published separately).
4. Add repo-specific fragments after these if needed.
5. Run `bash .harness-core/scripts/build-instructions.sh` from the consuming repo root.

These files are source material. They are not auto-emitted by this core repo because the build script only reads top-level `fragments/*.md`.

Included fragments:

- `40-hugo-stack.md` — extended-edition + version pinning, config layout and param defaults, directory meaning (`assets/` vs `static/`), theme/site ownership boundary, no-Node asset policy
- `50-hugo-templates-and-content.md` — v0.146+ template lookup discipline, `baseof`/blocks, partial context and `partialCached` variant rules, shortcodes over raw HTML, page bundles, archetypes, front matter, taxonomies, menus, i18n keys
- `60-hugo-output-safety-and-seo.md` — Goldmark `unsafe = false`, `safeHTML` trust discipline, publish-surface hygiene (drafts, secrets, robots/noindex per environment), canonical/OG/JSON-LD/sitemap/RSS rules, theme a11y markup baseline
- `70-hugo-assets-and-performance.md` — Hugo Pipes entry points, minify + fingerprint + SRI, vendored (not CDN) libraries, image render hook with srcset/WebP/width/height, pagination, `partialCached` and `--templateMetrics` as the build-perf levers
- `80-hugo-quality-and-release.md` — the `--gc --minify --panicOnWarning --printPathWarnings --printUnusedTemplates` merge gate, exampleSite CI build, link checking, theme publishing requirements (LICENSE, screenshots, semver tags), CI-only deploys with per-environment `baseURL`

Skills that belong with this pack (copy into the consuming repo's `.claude/skills/`):

- `skills/hugo-verify/` — release-check workflow that builds with warnings-as-errors and audits templates, head/SEO output, asset pipeline, links, and publish hygiene
- `skills/frontend-ui-design/` — premium UI work within the a11y guardrails; ignore its React/MUI library specifics and apply its craft and a11y guidance to the theme's HTML/CSS
- `skills/staged-commit-workflow/`, `skills/changelog-update/`, `skills/pr-checklist/` — the usual process skills

## Creating `template-hugo-theme`

The generic template workflow lives in the root `README.md` ("Creating a new template repo"). These are the stack-specific values for this pack, run from Git Bash. Prerequisite: Hugo extended v0.146+ on PATH (`winget install Hugo.Hugo.Extended` or `brew install hugo`; confirm with `hugo version`).

```bash
# 1. Create and clone
gh repo create [Github_user]/template-hugo-theme --public --clone
cd template-hugo-theme

# 2. Scaffold the site and an in-repo theme
hugo new site . --force
hugo new theme mytheme          # scaffolds themes/mytheme with the v0.146+ layout + exampleSite
echo "theme = 'mytheme'" >> hugo.toml
printf 'public/\n.hugo_build.lock\nresources/_gen/\n' >> .gitignore

# 3. Commit the scaffold FIRST (subtree needs a clean tree with a commit)
git add -A && git commit -m "Scaffold Hugo site with in-repo theme"
git branch -M main

# 4. Wire in the harness core
git subtree add --prefix .harness-core https://github.com/[Github_user]/ai-harness-core.git main --squash

# 5. Copy this pack's fragments
mkdir -p ai/fragments
cp .harness-core/fragments/packs/hugo-theme/[0-9]*.md ai/fragments/

# 6. Copy skills
mkdir -p .claude/skills
cp -r .harness-core/skills/hugo-verify .claude/skills/
cp -r .harness-core/skills/frontend-ui-design .claude/skills/
cp -r .harness-core/skills/staged-commit-workflow .claude/skills/
cp -r .harness-core/skills/changelog-update .claude/skills/
cp -r .harness-core/skills/pr-checklist .claude/skills/

# 7. Generate the instruction files
bash .harness-core/scripts/build-instructions.sh

# 8. Commit, push, mark as template
git add -A && git commit -m "Add harness core, Hugo fragments, skills, generated instructions"
git push -u origin main
gh repo edit [Github_user]/template-hugo-theme --template
```

Then hand-finish the scaffold so the template actually demonstrates the rules (an agent working in the template repo can do this from the fragments):

- `hugo.toml` → split into `config/_default/` (`hugo.toml`, `params.toml`, `menus.toml`, `markup.toml`) with `module.hugoVersion.min`/`.extended` pinned, `markup.goldmark.renderer.unsafe = false` stated explicitly, and a `config/production/` override
- Theme `layouts/baseof.html` with a skip link, landmark structure, and a single head partial; `home.html`, `page.html`, `list.html`, `404.html` all defining `main`
- A head partial emitting title/description/canonical plus the internal OG/Twitter templates; an asset partial piping `assets/css/main.scss` and `assets/js/main.js` through `js.Build`/`css.Sass` → `minify | fingerprint` with `integrity`, branching on `hugo.IsProduction`
- `layouts/_markup/render-image.html` producing srcset + WebP variants with `width`/`height` and enforced alt text; one example figure shortcode with `errorf` argument validation
- Archetypes for `post` (leaf-bundle) content, an `i18n/en.toml` with every theme string, and `exampleSite/` content exercising every template and shortcode
- A GitHub Actions workflow that installs the pinned extended Hugo, runs the `80-` fragment's build gate plus htmltest, and deploys to GitHub Pages with `--environment production`
