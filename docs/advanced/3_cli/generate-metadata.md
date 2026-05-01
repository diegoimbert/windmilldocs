---
description: How do I generate metadata and lockfiles for scripts, flows and apps using the Windmill CLI?
---

# Generate metadata

The `wmill generate-metadata` command generates metadata (locks, schemas) for all scripts, flows and apps. It replaces the previous separate commands (`wmill script generate-metadata`, `wmill flow generate-locks`, `wmill app generate-locks`).

## Usage

```bash
wmill generate-metadata [folder] [options]
```

## Options

| Option | Description |
| ------ | ----------- |
| `--yes` | Skip confirmation prompt |
| `--dry-run` | Show what would be updated without making changes |
| `--lock-only` | Regenerate only lock files |
| `--schema-only` | Regenerate only script schemas (skips flows and apps) |
| `--skip-scripts` | Skip processing scripts |
| `--skip-flows` | Skip processing flows |
| `--skip-apps` | Skip processing apps |
| `--strict-folder-boundaries` | Only update items inside the specified folder (requires folder argument) |
| `-i, --includes <patterns>` | Comma-separated patterns to specify which files to include |
| `-e, --excludes <patterns>` | Comma-separated patterns to specify which files to exclude |

The `rehash` subcommand (see [Rehash](#rehash) below) rewrites lockfile hashes from on-disk content without any backend round-trip.

## Arguments

| Argument | Description |
| -------- | ----------- |
| `folder` | Optional folder path to filter metadata generation |

## Examples

### Generate metadata for entire workspace

```bash
wmill generate-metadata
```

### Preview changes without applying

```bash
wmill generate-metadata --dry-run
```

### Auto-confirm all updates

```bash
wmill generate-metadata --yes
```

### Generate only for a specific folder

```bash
wmill generate-metadata f/my_folder
```

### Strict folder boundaries

```bash
wmill generate-metadata f/my_folder --strict-folder-boundaries
```

### Only update lockfiles

```bash
wmill generate-metadata --lock-only
```

### Only update schemas

```bash
wmill generate-metadata --schema-only
```

### Include specific patterns

```bash
wmill generate-metadata -i "f/production/*,f/shared/*"
```

### Exclude specific patterns

```bash
wmill generate-metadata -e "f/test/*,f/drafts/*"
```

## Rehash

`wmill generate-metadata rehash [folder]` rewrites `wmill-lock.yaml` hashes directly from on-disk content. It does not contact the backend, does not regenerate scripts/flows/apps, and does not rewrite YAML files — it only recomputes the staleness hashes.

Use it when:

- **`wmill generate-metadata` flags items as stale that you didn't change.** Common causes: an older CLI wrote the lockfile with a different YAML library or unsorted hash keys, leaving entries that no longer match what the current CLI computes. `rehash` rebuilds those entries from disk so they line up again.
- **Your `wmill-lock.yaml` has duplicate `./`-prefixed entries** (e.g. `./f/foo+__script_hash` next to `f/foo+__script_hash`). These come from past `wmill generate-metadata ./folder` invocations on older CLIs. `rehash` deduplicates them by writing canonical (non-prefixed) keys.
- **You bootstrapped a long-lived `wmill sync`-managed repo** and want to fill in lockfile entries for items that pre-date the lockfile, without redeploying everything.

### Options

| Option | Description |
| ------ | ----------- |
| `--skip-scripts` | Skip processing scripts |
| `--skip-flows` | Skip processing flows |
| `--skip-apps` | Skip processing apps |
| `-i, --includes <patterns>` | Comma-separated patterns to specify which files to include |
| `-e, --excludes <patterns>` | Comma-separated patterns to specify which files to exclude |

### Examples

```bash
# Rebuild every lockfile entry from disk
wmill generate-metadata rehash

# Scope to a single folder
wmill generate-metadata rehash f/billing

# Rehash scripts only
wmill generate-metadata rehash --skip-flows --skip-apps
```

`rehash` is non-destructive: it never touches your scripts, flows, apps, or YAML files. It only writes to `wmill-lock.yaml`.

:::caution Trust, don't verify
`rehash` accepts the on-disk content as canonical without checking it against the backend. Don't use it as a substitute for a regular `wmill generate-metadata` run when you actually want to validate that locks/schemas are up to date. Use it only when you've already confirmed the disk content is what you want and just need the lockfile to stop reporting it as stale.
:::

`wmill sync pull` runs an automatic, lighter version of this for items that exist on disk but have no lockfile entry — so for typical pull-then-push workflows you don't need to invoke `rehash` manually. The auto-fill is skipped under `--json` and `--dry-run` so non-interactive scripts and previews don't mutate `wmill-lock.yaml`.

## Migration from legacy commands

The following commands are now deprecated:

| Deprecated command | Replacement |
| ------------------ | ----------- |
| `wmill script generate-metadata` | `wmill generate-metadata --skip-flows --skip-apps` |
| `wmill flow generate-locks` | `wmill generate-metadata --skip-scripts --skip-apps` |
| `wmill app generate-locks` | `wmill generate-metadata --skip-scripts --skip-flows` |

The legacy commands will show deprecation warnings but continue to work.

For centralized dependency management, see [workspace dependencies](../../core_concepts/55_workspace_dependencies/index.mdx).
