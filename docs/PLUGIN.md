# Using ai-harness-core as an agent plugin

This repo is two things at once, and they do not conflict:

- **A git subtree source.** Templates vendor it at `.harness-core/` and run
  `scripts/build-instructions.sh` to generate `CLAUDE.md` / `AGENTS.md` /
  `.github/copilot-instructions.md`. This is unchanged — see the root
  [README.md](../README.md).
- **An agent plugin.** The same folder, installed directly into VS Code /
  GitHub Copilot, gives you the skills, agents, hooks, and MCP server without
  copying anything into the consuming repo.

Use the subtree path when a repo needs the *rules baked into its own generated
instruction files* (so every collaborator and every agent gets them). Use the
plugin path when *you* want the harness available across every repo you open,
without touching those repos.

## What the plugin contains

```
plugin.json                       Manifest — identity and what it contributes
mcp.json                          Declares the aiHarnessCore MCP server
skills/<name>/SKILL.md            7 skills, all user-invocable as slash commands
com.github.copilot/
  agents/*.agent.md               3 custom agents
  hooks/hooks.json                preRun / postRun lifecycle hooks
hooks/*.js                        Hook implementations (Node stdlib only)
scripts/harness-mcp.js            The MCP server
fragments/, references/           The rule content the MCP server serves
```

No build step and no dependencies: every script is Node standard library only,
so installing the plugin is copying the folder.

## Installing

**From a local clone** — clone anywhere and point VS Code at it:

```bash
git clone https://github.com/trewaters/ai-harness-core.git
```

Then enable plugin loading and add the folder in VS Code's settings:

```json
{
  "chat.plugins.enabled": true,
  "chat.plugins.locations": ["/absolute/path/to/ai-harness-core"]
}
```

Reload the window. The skills appear under **Configure Skills**, the agents in
the agent selector, and `aiHarnessCore` in the MCP server list.

**As a zip** — `git archive -o ai-harness-core.zip HEAD`, unzip on the target
machine, and point at the unzipped folder the same way.

## The slash commands

Every skill carries `user-invocable: true`, so each is reachable as a command:

| Command | What it does |
| --- | --- |
| `/staged-commit-workflow` | Commit message from the staged diff, version + changelog sync, docs gate |
| `/changelog-update` | Keep a Changelog entry for the current branch |
| `/pr-checklist` | Pre-PR pass: gates, diff review, PR description |
| `/frontend-ui-design` | Premium UI work inside the a11y and inclusion rules |
| `/electron-verify` | Electron security and packaging release check |
| `/pwa-verify` | Vite PWA installability and offline check |
| `/hugo-verify` | Hugo build, template, and publish-surface check |

Models can also invoke them on their own — that is what each skill's
`description` is for.

## The agents

| Agent | Use it for |
| --- | --- |
| `harness-reviewer` | Reviewing a diff against the security / a11y / inclusion rules, citing the fragment or `A11Y.md` section behind each finding |
| `harness-release` | Verify → changelog → commit, in that order, stopping before the push |
| `harness-maintainer` | Editing this repo: authoring fragments, packs, skills, and hooks |

Each agent reads the rules through the MCP server rather than recalling them,
so they stay correct as the fragments change.

## The MCP server

`aiHarnessCore` (`scripts/harness-mcp.js`) is a read-only, stdio JSON-RPC server
over this repo's content:

| Tool | Returns |
| --- | --- |
| `list_fragments` | Shared and pack fragments, in emit order |
| `read_fragment` | One fragment in full |
| `list_packs` | Stack packs with a one-line summary each |
| `list_skills` | Skills with the descriptions that decide when they apply |
| `read_skill` | One skill's full `SKILL.md` |
| `read_reference` | `A11Y.md` or `INCLUSION.md` |
| `build_instructions` | The combined instruction file for a pack, rendered but not written |

Every caller-supplied path is resolved inside the repo root and rejected if it
escapes, so a prompt-injected argument cannot turn it into a general file reader.
It writes nothing — `build_instructions` previews what
`scripts/build-instructions.sh` would emit, byte for byte, so you can see a
repo's rules before generating them.

Check it by hand:

```bash
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node scripts/harness-mcp.js
```

## The hooks

Two layers, because clients differ in what they support:

- **Lifecycle hooks** (`com.github.copilot/hooks/hooks.json`) run once per agent
  turn. `preRun` reports the branch and working-tree state; `postRun` formats and
  then credential-scans everything the turn touched.
- **Tool-call hooks** (`hooks/settings.snippets.json`) run per Write / Edit /
  Bash call in Claude Code, and catch a secret *before* it reaches disk.

They share their logic through `hooks/lib/`, so the two layers cannot drift.
Details and the install steps for each are in [hooks/README.md](../hooks/README.md).

## Keeping the plugin and the subtree in sync

They are the same files, so there is nothing to sync — but two invariants must
hold when you change things:

1. `build_instructions` in the MCP server must keep matching
   `scripts/build-instructions.sh`. Both emit the same header and the same
   fragment order; verify with a diff after changing either.
2. New hook logic goes in `hooks/lib/` and is used by both the tool-call hook
   and the lifecycle hook, not copied into one of them.

## Publishing

The plugin is a folder, so sharing it is sharing the repo:

- Point collaborators at the GitHub repo and the `chat.plugins.locations` setting.
- Or ship a zip: `git archive -o ai-harness-core.zip HEAD`.
- Bump `version` in `plugin.json` when the contents change meaningfully.
