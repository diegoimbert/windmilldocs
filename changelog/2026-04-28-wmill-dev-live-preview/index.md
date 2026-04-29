---
slug: wmill-dev-live-preview
title: Local visual preview with wmill dev
version: v1.692.0
tags: ['wmill CLI', 'Local development']
description: The new `wmill dev` command runs a live-reload preview for flows, scripts, and raw apps from your local files, with round-trip editing back to disk and tighter Claude Code, Claude Desktop, and VS Code integrations.
features:
  [
    'New `wmill dev` command launches a workspace picker or jumps directly to a flow, script, or raw app with live reload from your local files',
    'Round-trip parity with the VS Code extension — edits made in the dev page write back to `flow.yaml` and inline-script files, preserving `PathScript` references',
    'Auto-detects the wm path when invoked from inside a `*__flow/` folder; new `--path`, `--proxy-port`, and `--no-open` flags',
    "Reverse-proxy mode (`--proxy-port`) used by Claude Code's port-detection preview pane",
    'New `preview` skill drives the visual preview from Claude Code or Claude Desktop; `write-flow` and `raw-app` skills offer it as a one-sentence next step',
    '`wmill flow new` and `wmill app new` now accept non-interactive flags (`--summary`, `--path`, `--framework`, `--datatable`, `--schema`, `--overwrite`)',
  ]
docs: /docs/advanced/cli/dev-preview
---
