#!/usr/bin/env node
// PostToolUse hook (matcher: Write|Edit).
// Runs Prettier on the file that was just written, if the project has Prettier
// installed. Never blocks: always exits 0.
"use strict";
const { execFileSync } = require("child_process");
const path = require("path");

const FORMATTABLE = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".json", ".css", ".scss", ".html", ".md", ".yml", ".yaml",
]);

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let filePath = "";
  try {
    filePath = (JSON.parse(input).tool_input || {}).file_path || "";
  } catch {
    process.exit(0);
  }
  if (!filePath || !FORMATTABLE.has(path.extname(filePath).toLowerCase())) {
    process.exit(0);
  }
  try {
    // --no-install: only format if the project already depends on prettier.
    execFileSync("npx", ["--no-install", "prettier", "--write", filePath], {
      stdio: "ignore",
      shell: process.platform === "win32",
      timeout: 15000,
    });
  } catch {
    // No prettier in this project, or it errored — either way, don't block.
  }
  process.exit(0);
});
