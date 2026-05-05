---
name: local-review
description: Run the same review locally that the GitHub Claude / Codex / Pi auto-reviewers run on PRs. The agent-agnostic review policy lives in `REVIEW.md` at the repo root - read it first and apply it to the current branch's diff.
---

# Local review

Run a review of the current branch's pending changes using the same policy the CI auto-reviewers apply on PRs. The canonical, tool-agnostic policy lives in `REVIEW.md` at the repo root.

## Steps

1. **Read `REVIEW.md`** for the full review policy (project rules to consult, severity triage, documentation-specific checks, verification section).
2. **Determine the diff scope**:
   - Default: `git diff main...HEAD` (everything on the current branch since it diverged from `main`).
   - If the user names a base ref or commit range, use that instead.
3. **Read the changed files** end-to-end where the diff alone is insufficient (links, anchors, frontmatter, sidebar registration, JSON-LD blocks).
4. **Apply the policy from `REVIEW.md`** to produce a list of findings. Tag each with P0 / P1 / P2 per the severity triage in that file.
5. **End with a Verification section** as described in `REVIEW.md` — note whether `npm run build` would succeed, what manual verification is still useful for non-doc changes, or "no in-app surface" when applicable.

## Output format

Print a single markdown report to the user. Group findings by severity (P0 first), then the Verification section. Quote the exact rule from `AGENTS.md` or `writing_style_guide.md` when flagging a violation.

Do not modify any files during the review.
