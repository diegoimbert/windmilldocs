---
slug: pipeline-local-dev
title: Local development for data pipelines
version: v1.745.0
tags: ['Data pipelines', 'CLI']
description: Edit, preview and run data pipelines from local files without deploying. `wmill pipeline show/run --local` builds the graph from your working tree with the same parser the UI uses, `wmill pipeline dev` live-previews the graph in the browser on every save, and `wmill pipeline docs` writes a PIPELINE.md for coding agents.
features:
  [
    '`wmill pipeline show <folder> --local` renders the pipeline graph from working-tree files, fully offline',
    '`wmill pipeline run <folder> --local` runs the whole pipeline in topological order via previews, with `--from`/`--to`/`--dry-run` bounds',
    '`wmill pipeline dev [folder]` watches the folder and live-reloads the browser graph view on every save, with run buttons, run forms and live activity',
    '`wmill pipeline docs <folder>` writes PIPELINE.md (plus AGENTS.md/CLAUDE.md pointers) describing the graph and datatable schemas for an editor or agent',
    '`--partition <value>` runs partitioned scripts on an explicit partition (time kinds default to the current UTC period locally) and doubles as a headless backfill',
    '`--arg <script>:<param>=<value>` (repeatable) and `--upload <script>=<file>` parameterize scripts in the cascade',
  ]
docs: /docs/core_concepts/pipelines#local-development
---
