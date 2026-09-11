// Credential patterns shared by the tool-scoped hook (secret-scan.js) and the
// plugin lifecycle hook (post-run.js). Standard library only.
"use strict";

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

// A file whose own name says it holds fake values.
const ALLOWED_FILE = /\.env\.example$/;

/**
 * Find credential matches in `content`, skipping obvious placeholders and any
 * match already present in `previous` (so a check reports only what the change
 * newly introduces, never pre-existing secrets it did not cause).
 *
 * @returns {{name: string, match: string}[]}
 */
function findSecrets(content, previous) {
  const prior = typeof previous === "string" ? previous : "";
  const found = [];
  for (const { name, re } of PATTERNS) {
    const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
    for (const match of content.matchAll(new RegExp(re.source, flags))) {
      if (PLACEHOLDER.test(match[0])) continue;
      if (prior.includes(match[0])) continue;
      found.push({ name, match: match[0] });
    }
  }
  return found;
}

module.exports = { PATTERNS, PLACEHOLDER, ALLOWED_FILE, findSecrets };
