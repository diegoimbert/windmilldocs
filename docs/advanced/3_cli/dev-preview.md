---
description: How do I preview and live-edit scripts, flows, and raw apps locally using the Windmill CLI?
---

# Dev & Preview

The CLI can run scripts and flows against a remote workspace without deploying them, and it can serve a live-reload dev page that mirrors your local files. This is useful for iterating on local files, validating codebase scripts, or testing flow / app changes with local inline script modifications.

## `wmill dev`

`wmill dev` starts a local live-reload server and opens a Windmill dev page that renders your local flow, script, or raw app. Edits on disk reload the page; edits in the page round-trip back to the local files (`flow.yaml`, inline scripts, `app.yaml`, etc.).

```bash
wmill dev [--path <wmill_path>] [--proxy-port <port>] [--no-open]
```

When invoked from inside a `*__flow/` folder, `wmill dev` auto-detects the wm path. When invoked from a workspace root with no `--path`, the dev page shows a workspace picker — flows, scripts, and raw apps grouped by folder / user, with search and a kind filter.

### Run modes

- **Direct** (default): a WebSocket server on a random port. The dev page lives on the remote workspace and connects back to localhost over WebSocket for live reload. This is the mode the [VS Code extension](../../cli_local_dev/1_vscode-extension/index.mdx) iframe and a regular browser tab use.
- **Proxy** (`--proxy-port <port>`): a reverse proxy at `http://localhost:<port>/` that 302-redirects `/` to the remote dev page with workspace, auth token, and `--path` baked in, and tunnels other HTTP / WebSocket traffic to the remote workspace. This is the mode [Claude Code](../../misc/9_guides/local_dev_with_ai/index.mdx)'s port-detection preview pane uses.

### Options

| Option                  | Description                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `--path <wmill_path>`   | Open a specific flow, script, or raw app instead of the workspace picker.                    |
| `--proxy-port <port>`   | Run in proxy mode on the given port; needed for Claude Code's preview pane.                  |
| `--no-open`             | Don't open the browser; print the URL so the caller (e.g. an AI agent) can hand it to you.   |

### Examples

```bash
# Workspace picker
wmill dev

# Jump straight into a flow
wmill dev --path f/my_flows/etl

# Auto-detected when run from inside a flow folder
cd f/my_flows/etl__flow && wmill dev

# Proxy mode for Claude Code's preview pane
wmill dev --proxy-port 4000 --path f/my_flows/etl
```

### Round-trip editing

Editing a flow or script from the dev page writes back to disk:

- `flow.yaml` is rewritten only when content actually differs.
- Inline scripts (`.py`, `.ts`, `.bun.ts`, `.go`, `.sh`, etc.) are kept in sync.
- `PathScript` references (modules with `type: 'script'` and a `path:`) survive the round-trip.
- Fixture files inside the flow folder (`README.md`, `data.json`, `.env`, etc.) are preserved.

When `--path` is set, edits to other files don't push to the page, so you can keep working on unrelated files in the same workspace folder.

## `wmill script preview`

Preview a local script file against the remote workspace. Supports both regular scripts and [codebase](../../core_concepts/33_codebases_and_bundles/index.mdx) scripts (which are bundled before running).

```bash
wmill script preview <path> [options]
```

### Options

| Option             | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `-d, --data <data>`| Inputs as a JSON string, `@filename`, or `@-` for stdin.          |
| `-s, --silent`     | Only output the final result (no logs, useful for scripting).     |

### Examples

```bash
# Regular script
wmill script preview u/admin/my_script.ts --data '{"x": 5}'

# Codebase script (bundled before preview)
wmill script preview f/codebase_test/my_script.ts --data '{"x": 7}'

# Silent mode for piping
wmill script preview f/scripts/hello.ts -d '{"n":3}' --silent | jq
```

## `wmill flow preview`

Preview a local flow against the remote workspace. The flow definition is read from the local `.flow` / `__flow` folder — any changes to inline scripts are picked up without deploying.

```bash
wmill flow preview <path> [options]
```

### Options

Same `-d, --data` and `-s, --silent` options as `script preview`.

### Example

```bash
wmill flow preview f/my_flows/etl__flow --data '{"date":"2026-01-01"}'
```

Use `wmill dev` when you want a live UI that round-trips edits back to disk; use `wmill flow preview` when you want a one-shot run with a specific payload.
