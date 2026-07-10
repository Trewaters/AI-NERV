#!/usr/bin/env node
// PreToolUse hook (matcher: Bash).
// Blocks `git commit` / `git push` while the repo is on main or master.
// Exit 2 = block the tool call and show stderr to the model.
"use strict";
const { execSync } = require("child_process");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let command = "";
  try {
    command = (JSON.parse(input).tool_input || {}).command || "";
  } catch {
    process.exit(0); // unparseable input — don't block
  }

  // Only care about commands whose git SUBCOMMAND is commit or push, allowing
  // global option tokens in between (git -C dir push, git -c k=v commit,
  // git --no-pager push). Deliberately does not match e.g. `git stash push`,
  // where push is an argument to another subcommand.
  const gitVerb = command.match(
    /\bgit(?:\s+(?:-[Cc]\s+\S+|--?[\w-]+(?:=\S+)?))*\s+(commit|push)\b/
  );
  if (!gitVerb) process.exit(0);

  let branch = "";
  try {
    branch = execSync("git rev-parse --abbrev-ref HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    process.exit(0); // not a git repo — nothing to protect
  }

  if (branch === "main" || branch === "master") {
    console.error(
      `Blocked: refusing to run git ${gitVerb[1]} on '${branch}'. ` +
        "Create a feature branch first: git checkout -b <type>/<short-description>"
    );
    process.exit(2);
  }
  process.exit(0);
});
