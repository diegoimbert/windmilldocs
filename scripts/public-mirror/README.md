# Public docs mirror — maintainer runbook

Tooling to maintain a **public, contribution-only mirror** of the docs content,
while this private repo stays the source of truth.

```
private repo (truth) ──sync.sh──▶ public mirror ◀── external PRs
        ▲                                                │
        └──────────────── port-pr.sh ◀───────────────────┘
```

The mirror contains only contributable content (`docs/`, `blog/`, `changelog/`
+ `writing_style_guide.md` + `LICENSE.txt`) with **identical relative paths**,
so contribution diffs apply back here without rewriting. The mirror can't build
the site (no Docusaurus config / components by design).

## One-time setup

1. Create an empty public repo, e.g. `windmill-labs/windmilldocs-public`.
2. Seed it from this repo:
   ```bash
   scripts/public-mirror/sync.sh \
     --remote git@github.com:windmill-labs/windmilldocs-public.git --push
   ```
   This clones the mirror to `../windmilldocs-public`, copies content, injects
   the contributor `README.md` / `CONTRIBUTING.md`, and pushes.
3. Optional: enable a light markdown/prettier lint in the mirror's CI. A full
   `npm run build` is not possible there.

## Keeping the mirror current

Run after merging docs changes here (manually, or from CI on push to `main`):

```bash
scripts/public-mirror/sync.sh --push
```

It commits a normal `chore: sync from private @ <sha>` commit (never force-push),
so open contribution PRs on the mirror stay rebaseable. `.source-sha` in the
mirror records the private commit it was generated from.

### Automated sync (CI)

`.github/workflows/sync-public-mirror.yml` runs the same command on every push
to `main` that touches mirrored content (and via manual `workflow_dispatch`).
Configure it once under **Settings → Secrets and variables → Actions**:

- secret `MIRROR_DEPLOY_KEY` — SSH private key of a deploy key that has **write**
  access to the mirror repo (add the public half as a deploy key on the mirror,
  with "Allow write access" checked).
- variable `MIRROR_REMOTE` — the mirror's SSH URL, e.g.
  `git@github.com:windmill-labs/windmilldocs-public.git`.

## Porting a contribution back

When a mirror PR is accepted:

```bash
scripts/public-mirror/port-pr.sh <PR_NUMBER> --repo windmill-labs/windmilldocs-public
```

This creates a `contrib/pr-<N>` branch here with one commit, preserving the
contributor via `Co-authored-by`. Then:

```bash
npm run build        # verify the full site still builds
# open a PR in this private repo
```

After it merges here and the next `sync.sh` runs, the change reappears in the
mirror; close the original mirror PR with a thank-you.

## Notes / gotchas

- `sync.sh` uses per-directory `rsync --delete`, so deletions here propagate to
  the mirror, but the mirror's own `README.md` / `CONTRIBUTING.md` are untouched.
- If `port-pr.sh` reports the patch didn't apply cleanly, the mirror and private
  trees have diverged for that path (usually the private side already changed it
  by hand). Apply manually from the saved patch path it prints.
- The mirror inherits this repo's `LICENSE.txt` (CC-BY-SA 4.0).
