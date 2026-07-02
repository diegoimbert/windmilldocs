---
slug: duckdb-macro-libraries
title: Workspace DuckDB macro libraries
version: v1.746.0
tags: ['Data pipelines']
description: Share SQL logic across a workspace with macro libraries. A DuckDB script annotated `// macros` publishes engine-native CREATE MACRO definitions on deploy; any DuckDB script that calls a registered macro gets the definitions injected at run time, with no import or compile step. Includes editor autocomplete, a workspace macros explorer, and library nodes in the pipeline graph.
features:
  [
    'Annotate a DuckDB script with `// macros` to publish its CREATE MACRO statements (scalar or table) workspace-wide on deploy',
    'Calling a macro just works: definitions and the providing library setup are injected at job time, in dependency order',
    'Late-bound like dbt packages: redeploying a library applies to the next run of every consumer without redeploying them; a local macro of the same name always wins',
    '`// use <lib_path>` force-injects a whole library for calls hidden in dynamic SQL, honored transitively across libraries',
    'Deploy-time validation with precise errors: workspace-unique names, no shadowing of DuckDB built-ins, definition order checks',
    'Discovery: DuckDB editor autocomplete with signatures, a workspace macros explorer drawer on the pipeline page, and library nodes with consumer edges in the graph',
  ]
docs: /docs/core_concepts/pipelines#macro-libraries-duckdb
---
