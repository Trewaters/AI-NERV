#!/usr/bin/env bash
# Concatenates instruction fragments into the files each AI tool actually reads:
#   CLAUDE.md, AGENTS.md, .github/copilot-instructions.md
#
# Sources, in order:
#   1. <core>/fragments/*.md           — shared fragments from ai-harness-core (sorted by filename,
#                                        hence the 00-/10-/20- prefixes)
#   2. <target>/ai/fragments/*.md      — optional repo-local fragments (stack specifics), if present
#
# Usage (from the root of a consuming repo that has the core vendored at .harness-core/):
#   bash .harness-core/scripts/build-instructions.sh
#
# On Windows, run it from Git Bash (or via `bash` on PATH).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$(dirname "$SCRIPT_DIR")"
FRAGMENTS_DIR="$CORE_DIR/fragments"

TARGET_DIR="$(pwd)"
LOCAL_FRAGMENTS_DIR="$TARGET_DIR/ai/fragments"

if [ ! -d "$FRAGMENTS_DIR" ]; then
  echo "error: no fragments directory at $FRAGMENTS_DIR" >&2
  exit 1
fi

# Refuse to generate output inside the core repo itself — the generated files
# belong in consuming repos. Override with --self for testing.
if [ "$TARGET_DIR" = "$CORE_DIR" ] && [ "${1:-}" != "--self" ]; then
  echo "error: run this from the root of a consuming repo, not from ai-harness-core itself." >&2
  echo "       (use --self to override for testing)" >&2
  exit 1
fi

HEADER='<!--
  GENERATED FILE - do not edit directly.
  Edit fragments in .harness-core/fragments/ (shared) or ai/fragments/ (this repo),
  then run: bash .harness-core/scripts/build-instructions.sh
-->'

emit_fragments() {
  local dir="$1"
  local f
  for f in "$dir"/*.md; do
    [ -e "$f" ] || continue
    cat "$f"
    printf '\n'
  done
}

build() {
  local out="$1"
  mkdir -p "$(dirname "$out")"
  {
    printf '%s\n\n' "$HEADER"
    emit_fragments "$FRAGMENTS_DIR"
    if [ -d "$LOCAL_FRAGMENTS_DIR" ]; then
      emit_fragments "$LOCAL_FRAGMENTS_DIR"
    fi
  } > "$out"
  echo "wrote ${out#"$TARGET_DIR"/}"
}

build "$TARGET_DIR/CLAUDE.md"
build "$TARGET_DIR/AGENTS.md"
build "$TARGET_DIR/.github/copilot-instructions.md"

echo "done."
