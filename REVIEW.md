# Pull request review policy (windmilldocs)

This is the canonical, agent-agnostic review policy for the **windmilldocs** repository (the public Windmill documentation site, built with Docusaurus). It applies equally to CI-triggered PR reviews (Claude / Codex / Pi) and to local reviews run via the `local-review` skill.

## Read the project rules first

- Read `AGENTS.md` (repo root) and `writing_style_guide.md` before reviewing — they are the canonical contributor guide for documentation.
- Quote the exact rule from `AGENTS.md` or `writing_style_guide.md` when flagging a violation.

## Review policy

- Only report issues you are confident are real and introduced by the changes under review.
- Focus on factual mistakes, broken links/anchors, MDX/markdown issues, missing or invalid frontmatter, sidebar misregistration, and clear `AGENTS.md` / `writing_style_guide.md` violations.
- Do not report style nits, speculative concerns, pre-existing issues, or anything Docusaurus's own build (`npm run build`) would obviously catch (build errors are caught by the `check docs build` workflow).
- Self-validate each finding before posting: "is this definitely a real issue?" If uncertain, discard it.
- Read additional files only when the diff is not enough to validate a finding.
- Do not modify any files.

## Severity triage

Tag each finding with a severity. Always report P0 and P1. Report P2 only when the diff invites it (a new docs page, a new section in `sidebars.js`, a new landing page, a new component, or a meaningful restructure).

- **P0** — factually wrong claim about a Windmill feature that could mislead users (e.g. wrong CLI flag, wrong default value, wrong tier gating like "this is free" when it's Enterprise), broken link to a critical onboarding page, secrets/credentials accidentally committed, security misinformation.
- **P1** — broken internal link or anchor, missing/invalid frontmatter `description`, page not registered in `sidebars.js` when it should be, image referenced but missing from the directory, code example that won't run as written, Enterprise/Cloud/Pro feature not labeled as such on first mention, missing `[Enterprise Edition](/pricing)` link on first mention of EE on the page.
- **P2** — `AGENTS.md` / `writing_style_guide.md` violations (em dashes, bold misuse, title case in headings, marketing-style language, missing backlinks on first mention of a concept), JSON-LD missing on a non-doc page that needs it, `description` outside the recommended length (120-160 chars for docs/changelog, up to ~300 for blog/case studies), missing `textAnswer` field on FAQ entries, image only in PNG (no WebP) or vice versa, file/folder naming that doesn't follow the underscore + numeric prefix convention.

## Documentation-specific checks

For each new or significantly edited `.md` / `.mdx` page in the diff, verify:

- (a) Frontmatter has a `description` field, between 120-160 chars for docs/changelog, ideally question-based ("How do I ...?").
- (b) The first mention of "Enterprise Edition" / "EE" links to `/pricing`. Subsequent mentions on the same page do not need to be linked.
- (c) Internal links use **relative paths** (e.g. `../../8_triggers/index.mdx`) on first mention of a concept, and external links are absolute URLs.
- (d) If the page introduces a new feature, a backlink exists from related main pages (and ideally a `DocCard` component on the parent index).
- (e) If a new page is added under `docs/`, it appears in `sidebars.js`. If it's a major feature, it should also be considered for `docs/core_concepts/index.mdx` and `src/components/pricing/FeatureList.js` (when EE/Cloud/Team).
- (f) Code blocks specify a language (`ts`, `python`, `bash`, etc.).
- (g) No em dashes ('-') in prose - use sentences without them or '-' instead.
- (h) Headings use sentence case ('Like this'), not title case ('Like This'). No bold in headings or titles. No HTML colour styling on titles.
- (i) Images live in the same directory as the related MDX file, with both PNG and optimized WebP versions, and meaningful filenames.

For new non-doc pages (landing/marketing, case studies, product pages, FAQ sections), also verify the JSON-LD `<script type="application/ld+json">` block is present in `<Head>` per the patterns in `AGENTS.md` (`SoftwareApplication`, `FAQPage`, `ItemList`, etc.) and that any rich/JSX FAQ content has a plain-text counterpart (`textAnswer`).

## Verification section

End your review with a short "Verification" section:

- Note whether `npm run build` was likely to succeed (broken links / anchors, missing files referenced from `sidebars.js`, MDX validity). The CI `npm check` workflow runs this - call out any failure mode you spot in the diff that would block CI.
- For non-doc page changes (React components, schema, config), describe what manual verification is still useful (navigate to the page locally, click the new link, confirm the FAQ renders, etc.).
- If the diff has no in-app surface to exercise (purely text edits, image swaps), say that plainly.
