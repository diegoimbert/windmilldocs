#!/usr/bin/env bash
#
# Port a contribution PR from the public mirror back into this (private) repo.
#
# Because the mirror keeps identical relative paths, the PR's diff applies here
# directly. The contributor is preserved as a Co-authored-by trailer so credit
# survives the round-trip. The result is a local branch with one commit; review
# it, run `npm run build`, then open a PR in the private repo as usual.
#
# Usage:
#   scripts/public-mirror/port-pr.sh <PR_NUMBER> --repo <owner/mirror> [--branch NAME]
#
#   <PR_NUMBER>     The PR number on the public mirror.
#   --repo          The mirror repo, e.g. windmill-labs/windmilldocs-public (required).
#   --branch        Branch to create here. Default: contrib/pr-<N>.
#
# Example:
#   scripts/public-mirror/port-pr.sh 42 --repo windmill-labs/windmilldocs-public
#
set -euo pipefail

PR=""
REPO=""
BRANCH=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)   REPO="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) if [[ -z "$PR" ]]; then PR="$1"; shift; else echo "Unexpected: $1" >&2; exit 1; fi ;;
  esac
done

[[ -n "$PR"   ]] || { echo "error: PR number is required" >&2; exit 1; }
[[ -n "$REPO" ]] || { echo "error: --repo <owner/mirror> is required" >&2; exit 1; }
command -v gh >/dev/null || { echo "error: gh CLI is required" >&2; exit 1; }

BRANCH="${BRANCH:-contrib/pr-${PR}}"
SRC_ROOT="$(git rev-parse --show-toplevel)"
cd "$SRC_ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "error: working tree is dirty; commit or stash first." >&2
  exit 1
fi

# Pull author + metadata for attribution and the commit message.
AUTHOR_LOGIN="$(gh pr view "$PR" --repo "$REPO" --json author --jq '.author.login')"
PR_TITLE="$(gh pr view "$PR" --repo "$REPO" --json title --jq '.title')"
AUTHOR_NAME="$(gh api "users/${AUTHOR_LOGIN}" --jq '.name // .login')"
# Use GitHub's noreply address so the trailer is valid without leaking emails.
AUTHOR_ID="$(gh api "users/${AUTHOR_LOGIN}" --jq '.id')"
AUTHOR_EMAIL="${AUTHOR_ID}+${AUTHOR_LOGIN}@users.noreply.github.com"

PATCH="$(mktemp)"
trap 'rm -f "$PATCH"' EXIT
gh pr diff "$PR" --repo "$REPO" --patch > "$PATCH"

if [[ ! -s "$PATCH" ]]; then
  echo "error: empty diff for PR #$PR" >&2
  exit 1
fi

git switch -c "$BRANCH"

# Mirror commits use the same paths as here, so -p1 applies unchanged.
if ! git apply --index --whitespace=nowarn "$PATCH"; then
  echo "error: patch did not apply cleanly. Inspect $PATCH and apply manually." >&2
  echo "       (kept the new branch '$BRANCH' for you to fix up)" >&2
  trap - EXIT
  exit 1
fi

git commit -q -m "docs: port mirror contribution #${PR} (${PR_TITLE})

Ported from ${REPO}#${PR}.

Co-authored-by: ${AUTHOR_NAME} <${AUTHOR_EMAIL}>"

echo "Created branch '$BRANCH' with the contribution from ${REPO}#${PR}."
echo "Next: review the diff, run 'npm run build', then open a PR in the private repo."
