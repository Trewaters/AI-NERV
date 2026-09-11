// Git helpers shared by the hooks. Every function fails open (returns null or
// an empty list) when there is no repo or git is unavailable, so a hook never
// blocks work because the check itself could not run.
"use strict";

const { execFileSync } = require("child_process");

const PROTECTED_BRANCHES = new Set(["main", "master"]);

function git(args) {
  return execFileSync("git", args, {
    stdio: ["ignore", "pipe", "ignore"],
    timeout: 10000,
  })
    .toString()
    .trim();
}

/** Current branch name, or null when that cannot be determined. */
function currentBranch() {
  try {
    return git(["rev-parse", "--abbrev-ref", "HEAD"]);
  } catch {
    return null;
  }
}

function isProtectedBranch(branch) {
  return branch !== null && PROTECTED_BRANCHES.has(branch);
}

/**
 * Paths of files added or modified in the working tree (staged or not),
 * relative to the repo root, as absolute paths. Deletions are excluded —
 * there is nothing left to scan or format.
 */
function changedFiles() {
  let root;
  let status;
  try {
    root = git(["rev-parse", "--show-toplevel"]);
    status = git(["status", "--porcelain"]);
  } catch {
    return [];
  }
  const path = require("path");
  const files = [];
  for (const line of status.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const code = line.slice(0, 2);
    if (code.includes("D")) continue;
    let name = line.slice(3).trim();
    // Renames read "old -> new"; only the new path exists.
    const arrow = name.indexOf(" -> ");
    if (arrow !== -1) name = name.slice(arrow + 4);
    // Porcelain quotes paths containing spaces or non-ASCII bytes.
    if (name.startsWith('"') && name.endsWith('"')) {
      try {
        name = JSON.parse(name);
      } catch {
        continue;
      }
    }
    files.push(path.resolve(root, name));
  }
  return files;
}

module.exports = { PROTECTED_BRANCHES, currentBranch, isProtectedBranch, changedFiles };
