---
slug: data-table-postgres-trigger
title: Data tables as Postgres trigger sources
tags: ['Data tables', 'Triggers']
description: Data tables backed by a Postgres resource can now be used anywhere a Postgres resource is expected, including as the source of a Postgres trigger, without exposing the underlying database connection string to users.
features:
  [
    'Data tables backed by the instance database or a workspace Postgres resource are now valid Postgres resources.',
    'Use a data table directly as the source of a Postgres trigger to react to INSERT/UPDATE/DELETE events.',
    'Works in the Database Studio app component without manual resource wiring.',
  ]
docs: /docs/core_concepts/persistent_storage/data_tables
---
