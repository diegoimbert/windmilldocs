#!/usr/bin/env bash
#
# Regenerate the public, contribution-only docs mirror from this (private) repo.
#
# The private repo is the source of truth. This script copies the contributable
# content (prose + co-located assets) into a checkout of the public mirror,
# keeping identical relative paths so that contribution diffs apply cleanly back
# here via port-pr.sh. It commits a normal "sync" commit (never force-pushes) so
# that open contribution PRs on the mirror stay rebaseable.
#
# Usage:
#   scripts/public-mirror/sync.sh [--mirror-dir PATH] [--remote URL] [--push]
#
#   --mirror-dir PATH   Local checkout of the mirror. Default: ../windmilldocs-public
#   --remote URL        If the mirror dir doesn't exist, clone this remote into it.
#   --push              Push the sync commit to the mirror's origin after committing.
#
# Examples:
#   scripts/public-mirror/sync.sh --remote git@github.com:windmill-labs/windmilldocs-public.git --push
#   scripts/public-mirror/sync.sh --mirror-dir ../windmilldocs-public --push
#
set -euo pipefail

# Directories / files copied to the mirror. Keep these identical to their paths
# in the private repo so diffs round-trip with no path rewriting.
CONTENT_DIRS=(docs blog changelog)
CONTENT_FILES=(writing_style_guide.md LICENSE.txt)

MIRROR_DIR="../windmilldocs-public"
REMOTE=""
PUSH=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mirror-dir) MIRROR_DIR="$2"; shift 2 ;;
    --remote)     REMOTE="$2"; shift 2 ;;
    --push)       PUSH=1; shift ;;
    -h|--help)    sed -n '2,30p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

SRC_ROOT="$(git rev-parse --show-toplevel)"
SCRIPT_DIR="$SRC_ROOT/scripts/public-mirror"
cd "$SRC_ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "warning: private working tree has uncommitted changes; the mirror will" >&2
  echo "         reflect the working tree, not a committed state." >&2
fi

SRC_SHA="$(git rev-parse HEAD)"
SRC_SHORT="$(git rev-parse --short HEAD)"

# Resolve / create the mirror checkout.
if [[ ! -d "$MIRROR_DIR/.git" ]]; then
  if [[ -n "$REMOTE" ]]; then
    echo "Cloning mirror remote into $MIRROR_DIR ..."
    git clone "$REMOTE" "$MIRROR_DIR"
  else
    echo "error: $MIRROR_DIR is not a git checkout. Pass --remote URL to clone it," >&2
    echo "       or create the public repo first and clone it to that path." >&2
    exit 1
  fi
fi

MIRROR_DIR="$(cd "$MIRROR_DIR" && pwd)"
echo "Source : $SRC_ROOT @ $SRC_SHORT"
echo "Mirror : $MIRROR_DIR"

command -v rsync >/dev/null || { echo "error: rsync is required" >&2; exit 1; }

# Per-directory sync with --delete so removals in the private repo propagate,
# without touching the mirror's own top-level meta files (README/CONTRIBUTING).
for d in "${CONTENT_DIRS[@]}"; do
  echo "  syncing $d/"
  mkdir -p "$MIRROR_DIR/$d"
  rsync -a --delete \
    --exclude '.DS_Store' \
    "$SRC_ROOT/$d/" "$MIRROR_DIR/$d/"
done

for f in "${CONTENT_FILES[@]}"; do
  [[ -f "$SRC_ROOT/$f" ]] && cp "$SRC_ROOT/$f" "$MIRROR_DIR/$f"
done

# Inject contributor-facing meta files (these live only in the mirror).
cp "$SCRIPT_DIR/mirror-files/README.md"       "$MIRROR_DIR/README.md"
cp "$SCRIPT_DIR/mirror-files/CONTRIBUTING.md" "$MIRROR_DIR/CONTRIBUTING.md"

# Record provenance so the mirror always states which private commit it came from.
printf '%s\n' "$SRC_SHA" > "$MIRROR_DIR/.source-sha"

cd "$MIRROR_DIR"
git add -A
if git diff --cached --quiet; then
  echo "Mirror already up to date with $SRC_SHORT; nothing to commit."
  exit 0
fi

git commit -q -m "chore: sync from private @ ${SRC_SHORT}"
echo "Committed sync (private @ ${SRC_SHORT})."

if [[ "$PUSH" -eq 1 ]]; then
  git push origin HEAD
  echo "Pushed to mirror origin."
else
  echo "Not pushed (pass --push to push). Review with: git -C \"$MIRROR_DIR\" show"
fi
