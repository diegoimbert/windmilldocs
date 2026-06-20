# Windmill documentation (public mirror)

This is the public, contribution-only mirror of the Windmill documentation.
It contains the prose and assets that power <https://www.windmill.dev/docs> -
the `docs/`, `blog/`, and `changelog/` content - so that anyone can suggest
improvements without access to the full private site repository.

> This repo is **generated** from Windmill's private docs repository, which is
> the source of truth. It is regenerated periodically. To propose a change,
> open a pull request here; maintainers port merged-quality changes back into
> the source repo, preserving your authorship. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## What's here

| Path          | What it is                                            |
| ------------- | ----------------------------------------------------- |
| `docs/`       | Product documentation (`.mdx` + co-located images)    |
| `blog/`       | Blog posts and case studies                           |
| `changelog/`  | Changelog entries                                     |
| `writing_style_guide.md` | How we write docs - read before contributing |

## What's not here

The full website (Docusaurus config, React components, sidebars) lives in the
private repo, so you **can't build or preview the site from this mirror**. The
`.mdx` files import site components (e.g. `DocCard`, `Tabs`) that aren't present
here - that's expected. Focus your edits on the prose and images; maintainers
verify the full build when porting your change back.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the conventions to follow.
