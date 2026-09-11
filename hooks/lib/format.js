// Prettier invocation shared by format-on-save.js and post-run.js.
// Formats only when the project already depends on Prettier, and never throws.
"use strict";

const { execFileSync } = require("child_process");
const path = require("path");

const FORMATTABLE = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".json", ".css", ".scss", ".html", ".md", ".yml", ".yaml",
]);

function isFormattable(filePath) {
  return !!filePath && FORMATTABLE.has(path.extname(filePath).toLowerCase());
}

/**
 * Run Prettier over the given files. Returns the number formatted.
 * Silently does nothing when the project has no Prettier installed —
 * `--no-install` keeps npx from fetching it.
 */
function formatFiles(filePaths) {
  const targets = filePaths.filter(isFormattable);
  if (!targets.length) return 0;
  try {
    execFileSync("npx", ["--no-install", "prettier", "--write", ...targets], {
      stdio: "ignore",
      shell: process.platform === "win32",
      timeout: 30000,
    });
    return targets.length;
  } catch {
    // No prettier in this project, or it errored — either way, don't block.
    return 0;
  }
}

module.exports = { FORMATTABLE, isFormattable, formatFiles };
