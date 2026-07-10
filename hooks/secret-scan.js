#!/usr/bin/env node
// PreToolUse hook (matcher: Write|Edit).
// Simulates the pending write/edit and scans the RESULTING file content for
// credential patterns, blocking only matches the change would newly introduce.
// (Scanning just the edit fragment could be bypassed by assembling a secret
// across an edit boundary; blocking pre-existing matches would make the hook
// veto unrelated edits without protecting anything — the secret is already on
// disk.) Exit 2 = block the tool call and show stderr to the model.
"use strict";

const fs = require("fs");

const PATTERNS = [
  { name: "private key block", re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { name: "AWS access key id", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "GitHub token", re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/ },
  { name: "GitHub fine-grained PAT", re: /\bgithub_pat_[A-Za-z0-9_]{60,}\b/ },
  { name: "Anthropic API key", re: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/ },
  { name: "OpenAI API key", re: /\bsk-proj-[A-Za-z0-9_-]{20,}\b/ },
  { name: "Slack token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "Stripe live key", re: /\b(?:sk|rk)_live_[A-Za-z0-9]{20,}\b/ },
  {
    name: "hardcoded credential assignment",
    re: /(?:api[_-]?key|secret|password|token)["']?\s*[:=]\s*["'][A-Za-z0-9+/_-]{20,}["']/i,
  },
];

// Obvious placeholders are fine — that's what .env.example is for.
const PLACEHOLDER = /(?:your[_-]|example|placeholder|changeme|xxxx|<[^>]+>|\.\.\.)/i;

// Don't load huge files into memory; past this size we fall back to scanning
// only the edit fragment (same coverage the hook had before, still fail-open).
const MAX_FILE_BYTES = 2 * 1024 * 1024;

// Apply old_string -> new_string without String.replace, whose $-patterns in
// the replacement would corrupt the simulation.
function applyEdit(oldContent, oldString, newString, replaceAll) {
  if (!oldString || !oldContent.includes(oldString)) return null;
  if (replaceAll) return oldContent.split(oldString).join(newString);
  const i = oldContent.indexOf(oldString);
  return oldContent.slice(0, i) + newString + oldContent.slice(i + oldString.length);
}

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let data;
  try {
    data = JSON.parse(input);
  } catch {
    process.exit(0);
  }
  const toolInput = data.tool_input || {};
  const filePath = toolInput.file_path || "";
  if (/\.env\.example$/.test(filePath)) process.exit(0);

  let oldContent = "";
  try {
    if (filePath && fs.statSync(filePath).size <= MAX_FILE_BYTES) {
      oldContent = fs.readFileSync(filePath, "utf8");
    }
  } catch {
    // New file or unreadable — treat as empty.
  }

  let newContent = null;
  if (typeof toolInput.content === "string") {
    newContent = toolInput.content; // Write: payload is the whole file
  } else if (typeof toolInput.new_string === "string") {
    newContent = applyEdit(
      oldContent,
      toolInput.old_string,
      toolInput.new_string,
      !!toolInput.replace_all
    );
    // Couldn't simulate (old_string not found — the Edit will fail anyway, or
    // the file was too large to load): scan the fragment alone.
    if (newContent === null) newContent = toolInput.new_string;
  }
  if (!newContent) process.exit(0);

  for (const { name, re } of PATTERNS) {
    const globalRe = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    for (const match of newContent.matchAll(globalRe)) {
      if (PLACEHOLDER.test(match[0])) continue;
      if (oldContent.includes(match[0])) continue; // pre-existing, not introduced by this change
      console.error(
        `Blocked: this change to ${filePath || "this file"} would introduce a ${name} (${match[0].slice(0, 12)}...). ` +
          "Move the real value to .env (gitignored) and reference it via an environment variable. " +
          "If this is a placeholder, make it obviously fake (e.g. 'your-api-key-here')."
      );
      process.exit(2);
    }
  }
  process.exit(0);
});
