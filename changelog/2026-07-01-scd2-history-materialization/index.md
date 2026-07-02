---
slug: scd2-history-materialization
title: SCD2 history strategy for DuckLake materialization
version: v1.745.0
tags: ['Data pipelines']
description: New managed history strategy on `// materialize` keeps every version of every row (slowly changing dimension type 2). A change closes the prior version and opens a new one, with managed `valid_from`/`valid_to`/`is_current` columns, an auto-maintained `<table>_current` view, and support for effective-dated ASOF joins. Data tests and schema capture keep working, unlike hand-written `materialize manual` SQL.
features:
  [
    'Add `key=<col> history` to `// materialize ducklake://…` (or use the `scd2` keyword alias) to turn a keyed merge into a type-2 history',
    'The runtime manages `valid_from`, `valid_to` and `is_current`; your SELECT stays the current snapshot, one row per key',
    '`track=<c1,c2,…>` limits which column changes open a new version (default: all non-key columns)',
    '`deletes=close` closes the current version of keys that disappear from the snapshot; default is soft delete (absent keys stay current)',
    'A companion `<table>_current` view is maintained so the latest-version case needs no filter',
    'Idempotent by construction: an unchanged snapshot writes 0 rows and advances no DuckLake snapshot',
    'Built-in `// data_test` checks scope to current rows on SCD2 targets, so `unique(<key>)` keeps passing as history accumulates',
  ]
docs: /docs/core_concepts/pipelines#scd2-history-slowly-changing-dimensions
---
