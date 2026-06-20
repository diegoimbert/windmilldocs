# Contributing to the Windmill docs

Thanks for improving the docs! This mirror exists to make contributions easy.

## How it works

1. Fork this repo and create a branch.
2. Edit the prose / images under `docs/`, `blog/`, or `changelog/`.
3. Open a pull request describing the change.
4. A maintainer ports accepted changes into Windmill's private source repo
   (where the site is built and deployed), preserving you as a co-author. Once
   the next sync runs, your change appears here too and the PR is closed.

Because the change lands via the source repo, your PR here may be **closed
rather than merged** even when accepted - that's normal, not a rejection.

## What you can and can't do here

- You **can** fix typos, clarify wording, correct errors, improve examples, and
  update images.
- You **can't** build or preview the site from this mirror - the Docusaurus
  config and React components live in the private repo. The `import` lines at
  the top of `.mdx` files (e.g. `DocCard`, `Tabs`, `TabItem`) reference those
  components; leave them as-is.

## Conventions

Please skim [`writing_style_guide.md`](./writing_style_guide.md). Key points:

- Use sentence case for titles ("Like this", not "Like This").
- Keep it concise and technical; avoid marketing language.
- Don't add bold unless the surrounding text already uses it.
- Use `-` instead of the em dash.
- Every `.md` / `.mdx` page needs a `description` in its frontmatter.
- For internal links, use relative paths to other docs pages.

## Reporting issues

If you'd rather report a problem than fix it, open an issue describing the page
and what's wrong.
