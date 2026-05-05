# Pull request review — CI-specific addenda

The canonical, agent-agnostic review policy lives in `REVIEW.md` at the repo root. The CI workflows concatenate `REVIEW.md` with this file and the per-tool output-format file before invoking the model — so by the time you read this, you should already have the full policy. The sections below add CI-only behaviour that does not apply to a local review.

## Additional reviewer instructions

If the prompt or context includes an "Additional reviewer instructions" section, treat it as extra guidance from the human who triggered this review and follow it.

## Prior PR discussion

If the prompt or context includes a "Prior PR discussion" section, this PR has already received review activity. Look for your own previous comment, take it into account, focus on what changed in the latest commits, and do not repeat findings the human already pushed back on or addressed.
