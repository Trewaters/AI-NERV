# Security baseline

## Secrets

- Never commit secrets: API keys, tokens, passwords, private keys, connection strings. Not in code, not in config, not in test fixtures, not in commit messages.
- Real values live in `.env` (gitignored). Every repo keeps a committed `.env.example` with the same keys and placeholder values so setup is self-documenting.
- Before adding any hardcoded string that looks like a credential, stop and move it to an environment variable instead.
- If a secret does land in a commit, treat it as compromised: rotate it — removing it from history is not enough.

## .env handling

- Confirm `.env`, `.env.local`, and `.env.*.local` are in `.gitignore` before creating them.
- Never print full `.env` contents into logs, terminal output, or error messages.
- When a new env var is introduced, add it to `.env.example` in the same change.

## General

- Don't disable security features (CSP, contextIsolation, TLS verification, auth checks) to make something work, even "temporarily". Flag the friction instead.
- Validate and sanitize anything that crosses a trust boundary: user input, IPC messages, URL params, file paths.
- Be conservative with new dependencies: prefer well-maintained packages, and check what a package actually does before installing it.
