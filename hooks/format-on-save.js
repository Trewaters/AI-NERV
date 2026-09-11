#!/usr/bin/env node
// PostToolUse hook (matcher: Write|Edit).
// Runs Prettier on the file that was just written, if the project has Prettier
// installed. Never blocks: always exits 0.
"use strict";
const { formatFiles } = require("./lib/format");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let filePath = "";
  try {
    filePath = (JSON.parse(input).tool_input || {}).file_path || "";
  } catch {
    process.exit(0);
  }
  if (filePath) formatFiles([filePath]);
  process.exit(0);
});
