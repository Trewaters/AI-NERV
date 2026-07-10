# `gh repo create` — Flag Reference

Every flag accepted by `gh repo create`, the command used to stamp out new repos —
including new projects created from a template repo via `--template`.
Verified against `gh` version 2.96.0 (`gh repo create --help`).

Alias: `gh repo new`

```
gh repo create [<name>] [flags]
```

- Run with **no arguments** for interactive mode.
- Non-interactive mode requires the repo name and one of `--public`, `--private`, or `--internal`.
- If the `OWNER/` portion of `OWNER/REPO` is omitted, it defaults to the authenticating user.

## All flags

| Flag | Argument | What it does |
| --- | --- | --- |
| `--add-readme` | — | Add a README file to the new repository |
| `-c`, `--clone` | — | Clone the new repository to the current directory |
| `-d`, `--description` | string | Description of the repository |
| `--disable-issues` | — | Disable issues in the new repository |
| `--disable-wiki` | — | Disable wiki in the new repository |
| `-g`, `--gitignore` | string | Specify a gitignore template ([github/gitignore](https://github.com/github/gitignore)) |
| `-h`, `--homepage` | URL | Repository home page URL |
| `--include-all-branches` | — | Include all branches from the template repository (only with `--template`) |
| `--internal` | — | Make the new repository internal (organization accounts) |
| `-l`, `--license` | string | Specify an open source license (`gh repo license list` for keywords) |
| `--private` | — | Make the new repository private |
| `--public` | — | Make the new repository public |
| `--push` | — | Push local commits to the new repository (used with `--source`) |
| `-r`, `--remote` | string | Remote name for the new repository (used with `--source`) |
| `-s`, `--source` | string | Path to a local repository to use as source |
| `-t`, `--team` | name | Organization team to be granted access |
| `-p`, `--template` | repository | Base the new repository on a template repository |
| `--help` | — | Show help for the command |

## Notes for the `--template` workflow

- `--template` requires the source repo to be marked as a GitHub template repository
  (`gh repo edit OWNER/REPO --template` — step 9 of "Creating a new template repo" in
  [README.md](README.md)).
- `--template` copies the template's files as a fresh initial commit — no shared git history.
- Only the default branch is copied unless you pass `--include-all-branches`.
- `--template` cannot be combined with `--gitignore`, `--license`, or `--source` —
  the template already provides those files.
- Stack-specific creation recipes (scaffold commands, packages, fragments, skills) live in
  each pack's README — e.g.
  [fragments/packs/react-vite-mui-pwa/README.md](fragments/packs/react-vite-mui-pwa/README.md)
  for `template-react-vite-mui-pwa`,
  [fragments/packs/electron-react-mui/README.md](fragments/packs/electron-react-mui/README.md)
  for `template-electron-react-mui`, or
  [fragments/packs/hugo-theme/README.md](fragments/packs/hugo-theme/README.md)
  for `template-hugo-theme`.

## Common invocations

```bash
# New private project from one of my templates, cloned locally
gh repo create my-new-app --template [Github_user]/template-react-vite --private --clone

# Same, with a description
gh repo create my-new-app --template [Github_user]/template-react-vite --private --clone \
  -d "Client app for XYZ"

# New MUI PWA project from the react-vite-mui-pwa template
gh repo create my-pwa-app --template [Github_user]/template-react-vite-mui-pwa --private --clone \
  -d "Installable PWA built with React, Vite, and MUI"

# New Electron desktop app (React + MUI renderer) from the electron-react-mui template
gh repo create my-desktop-app --template [Github_user]/template-electron-react-mui --private --clone \
  -d "Desktop app built with Electron, React, and MUI"

# New Hugo theme website from the hugo-theme template
gh repo create my-hugo-site --template [Github_user]/template-hugo-theme --public --clone \
  -d "Static website built with Hugo and a custom Go-template theme"

# Client project with a homepage and issues/wiki trimmed for a lean repo
gh repo create client-app --template [Github_user]/template-react-vite-mui-pwa --private --clone \
  -h "https://app.example.com" --disable-wiki

# Blank public repo, cloned locally (starting a template repo itself)
gh repo create [Github_user]/template-<name> --public --clone

# Publish an existing local repo to GitHub and push its commits
gh repo create my-project --private --source=. --push
```
