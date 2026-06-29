---
slug: pipelines
title: Pipelines with asset lineage, partitions and joins
version: v1.702.0
tags: ['Data pipelines']
description: Connect scripts into a pipeline through the assets they read and write, with comment annotations for schedules, time and dynamic partitions, AND/OR joins, opt-in debounce, managed DuckLake materialization, column-level lineage and data tests. Pipelines are in alpha; the annotation syntax and behavior may still change.
features:
  [
    'Mark a script with `// pipeline` to place it in its folder pipeline graph; edges are inferred from asset reads (`// on <asset>`) and auto-detected writes',
    'Trigger steps from asset writes (the cascade) or a native trigger that targets the script via the marker `// on <kind>` (`schedule`/`webhook`/`email`/`kafka`/`mqtt`/`nats`/`postgres`/`sqs`/`gcp`/`data_upload`)',
    '`// freshness <duration>` is parsed and shown on the graph; watchdog runs are planned but not active yet',
    '`// partitioned daily|hourly|weekly|monthly|dynamic` with `tz`/`format`/`start` options; the `{partition}` token resolves once at run time and flows down the chain, with explicit-argument backfill',
    '`// trigger all` AND-join barrier: a step runs once per partition only when every partition-bearing input is present; unpartitioned reference inputs are not part of the barrier',
    'Opt-in `// debounce <duration>` (script-level) and per-input `// on <asset> debounce=<duration>`, keyed per subscriber and partition',
    'Per-step `// tag <name>` to pin a step to a worker tag, and `// retry <count> [<delay>]` for cascade-dispatched runs',
    'A pipeline graph view shows lineage, live run activity and per-node status, and lets you run a step or a step and everything downstream',
    'Selective execution: bound the cascade with "run downstream up to…" a chosen end node from the graph, or `wmill pipeline run <folder> --to <node>` from the CLI',
    'Managed DuckLake materialization with `// materialize`: write one slice and Windmill owns the idempotent, snapshotted write, with versioned schema capture surfaced on a Schema tab',
    'Column-level lineage for DuckLake pipelines, inferred automatically from the SQL and overridable with `// column <out> <- <asset>.<col>`',
    '`// data_test` (unique, not_null, accepted_values, relationships, custom scripts) runs against the freshly-materialized slice and fails the run on violation',
  ]
docs: /docs/core_concepts/pipelines
---
