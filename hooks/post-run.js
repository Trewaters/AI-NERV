#!/usr/bin/env node
// Plugin lifecycle hook: postRun (com.github.copilot/hooks/hooks.json).
// Runs once after an agent turn finishes, over everything the turn left in the
// working tree — the safety net for clients that run lifecycle hooks but not
// the per-tool-call PreToolUse/PostToolUse hooks.
//
// Two passes over the changed files:
//   1. Prettier, if the project depends on it (never fails the run).
//   2. Credential scan. Exits 2 with the finding on stderr so the client
//      surfaces it; the turn is already over, so this reports rather than
//      prevents — but it reports before the code reaches a commit.
//
// Fails open everywhere: no git repo, no changed files, unreadable file, or a
// file too large to scan all exit 0.
"use strict";

const fs = require("fs");
const path = require("path");
const { changedFiles } = require("./lib/git");
const { ALLOWED_FILE, findSecrets } = require("./lib/secret-patterns");
const { formatFiles } = require("./lib/format");

const MAX_FILE_BYTES = 2 * 1024 * 1024;

// Binary and vendored trees are neither formattable nor worth scanning.
const SKIP_DIR = /(^|[\\/])(node_modules|\.git|dist|build|out|coverage|\.next)([\\/]|$)/;

const files = changedFiles().filter((f) => !SKIP_DIR.test(f));
if (files.length === 0) process.exit(0);

formatFiles(files);

const findings = [];
for (const file of files) {
  if (ALLOWED_FILE.test(file)) continue;
  let content;
  try {
    if (fs.statSync(file).size > MAX_FILE_BYTES) continue;
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue; // deleted between listing and reading, or not readable text
  }
  // No "previous" content to compare against at this point — the change is
  // already on disk — so every match in a touched file is reported.
  for (const found of findSecrets(content, "")) {
    findings.push(`${path.relative(process.cwd(), file)}: ${found.name} (${found.match.slice(0, 12)}...)`);
  }
}

if (findings.length) {
  console.error(
    "[ai-harness-core] Credential pattern(s) found in files this turn touched:\n  " +
      findings.join("\n  ") +
      "\nMove real values to .env (gitignored) and reference them via environment variables " +
      "before committing. If a value is a placeholder, make it obviously fake."
  );
  process.exit(2);
}
process.exit(0);
