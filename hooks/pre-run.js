#!/usr/bin/env node
// Plugin lifecycle hook: preRun (com.github.copilot/hooks/hooks.json).
// Runs once before an agent turn starts, not per tool call.
//
// Advisory only — it reports the working state the agent is about to change
// and always exits 0. The blocking guard lives in block-main-branch.js, which
// fires at the moment a commit or push is actually attempted; refusing to
// start a turn on main would block reading and exploring too, which is a
// legitimate thing to do there.
"use strict";

const { currentBranch, isProtectedBranch, changedFiles } = require("./lib/git");

// Lifecycle hooks may be invoked with no stdin payload; nothing here needs one,
// so don't wait on a stream that may never close.
const branch = currentBranch();
const notes = [];

if (isProtectedBranch(branch)) {
  notes.push(
    `On '${branch}'. Commits and pushes from here are blocked — ` +
      "create a feature branch first: git checkout -b <type>/<short-description>"
  );
}

const changed = changedFiles();
if (changed.length > 0) {
  notes.push(
    `${changed.length} uncommitted file${changed.length === 1 ? "" : "s"} already in the working tree.`
  );
}

if (notes.length) {
  console.error("[ai-harness-core] " + notes.join(" "));
}
process.exit(0);
