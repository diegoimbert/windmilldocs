---
description: How do I query and manage data tables using the Windmill CLI?
---

# Datatables

The `wmill datatable` commands let you query and manage [data tables](../../core_concepts/11_persistent_storage/data_tables.mdx) from the CLI. You can list available datatables, run SQL queries, version their schema with [migrations](#managing-migrations), or start an interactive PostgreSQL session.

## Listing datatables

List all datatables in the current workspace.

```bash
wmill datatable list [options]
```

### Options

| Option   | Description                       |
| -------- | --------------------------------- |
| `--json` | Output as JSON (for piping to jq) |

### Example

```bash
wmill datatable list
```

Output:

```
+------------+---------------+---------------+
| Name       | Resource Type | Resource Path |
+------------+---------------+---------------+
| main       | postgresql    | f/db/main     |
| analytics  | postgresql    | f/db/stats    |
+------------+---------------+---------------+
```

## Running a query

Execute a SQL query against a datatable and display results.

```bash
wmill datatable run [options] <sql>
```

### Arguments

| Argument | Description                  |
| -------- | ---------------------------- |
| `sql`    | The SQL query to execute     |

### Options

| Option              | Parameters | Description                                           |
| ------------------- | ---------- | ----------------------------------------------------- |
| `-n, --name`        | `name`     | Datatable name to query (default: `main`)             |
| `-s, --silent`      |            | Output only the final result as JSON (for scripting)  |

### Examples

1. Basic query:

```bash
wmill datatable run "SELECT * FROM users LIMIT 10"
```

2. Query a specific datatable:

```bash
wmill datatable run -n analytics "SELECT COUNT(*) as count FROM events"
```

3. Silent mode for scripting:

```bash
wmill datatable run -s "SELECT version()" | jq '.version'
```

## Managing migrations

The `wmill datatable migrate` commands let you version the schema of a datatable with SQL migrations. Each migration is a pair of `.up.sql` / `.down.sql` files stored under `migrations/datatable/<datatable>/` and applied in timestamp order. Applied migrations are tracked in a `_wm_migrations` table inside each datatable, so a migration is never run twice.

Migrations are ordinary [workspace files](./sync.mdx): `wmill sync pull` writes them locally, and `wmill sync push` upserts (or deletes) them on the remote workspace. You can also manage the same migrations from the UI in `workspace settings` -> `Data Tables` -> `Migrations`. See the [data tables migrations](../../core_concepts/11_persistent_storage/data_tables.mdx#migrations) documentation for the overall workflow.

### Scaffolding a migration

Create an empty `.up.sql` / `.down.sql` migration pair. This is a purely local operation - no network call.

```bash
wmill datatable migrate new [options] <name>
```

The name may only contain letters, digits, `_` and `-`. The files are written to `migrations/datatable/<datatable>/<timestamp>_<name>.up.sql` (and `.down.sql`), where `<timestamp>` is the current UTC time as `YYYYMMDDHHMMSS`.

#### Arguments

| Argument | Description                            |
| -------- | -------------------------------------- |
| `name`   | Name of the migration (used in the filename and DB record) |

#### Options

| Option              | Parameters   | Description                                |
| ------------------- | ------------ | ------------------------------------------ |
| `-d, --datatable`   | `datatable`  | Target datatable (default: `main`)         |

#### Example

```bash
wmill datatable migrate new add_users_table
```

Then edit the generated files, for example:

```sql
-- migrations/datatable/main/20260617120000_add_users_table.up.sql
BEGIN;

CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL
);

END;
```

```sql
-- migrations/datatable/main/20260617120000_add_users_table.down.sql
BEGIN;

DROP TABLE users;

END;
```

The `.down.sql` file is optional: leave it empty (or delete it) for migrations you never intend to roll back.

### Applying migrations

Apply every pending migration, in timestamp order, to a datatable.

```bash
wmill datatable migrate up [options]
```

With no `--datatable` flag, `up` targets **all** datatables in the workspace. Any migration files created or edited locally are pushed to the workspace first, so `migrate up` works even before a `wmill sync push`.

#### Options

| Option              | Parameters   | Description                                                        |
| ------------------- | ------------ | ----------------------------------------------------------------- |
| `-d, --datatable`   | `datatable`  | Target a specific datatable (default: all datatables in the workspace) |

#### Examples

1. Apply pending migrations to every datatable:

```bash
wmill datatable migrate up
```

2. Apply pending migrations to a single datatable:

```bash
wmill datatable migrate up -d analytics
```

### Rolling back migrations

Roll back the most recently applied migration (one step), running its `.down.sql`.

```bash
wmill datatable migrate down [options]
```

With no `--datatable` flag, `down` rolls back the latest migration on **all** datatables in the workspace.

#### Options

| Option              | Parameters   | Description                                                        |
| ------------------- | ------------ | ----------------------------------------------------------------- |
| `-d, --datatable`   | `datatable`  | Target a specific datatable (default: all datatables in the workspace) |

#### Example

```bash
wmill datatable migrate down -d analytics
```

### Syncing migrations

Migrations sync like any other workspace item:

- `wmill sync pull` writes migration files under `migrations/datatable/<datatable>/`.
- `wmill sync push` upserts changed migrations and deletes those removed locally. When the push introduces new migrations, the CLI offers to run them.

Local migration sets are validated on push and rejected if two `.up` (or two `.down`) files share a timestamp, or if a `.down.sql` has no matching `.up.sql`.

## Starting a PostgreSQL proxy server

Start a PostgreSQL wire-protocol proxy that serves all datatables. This allows any Postgres-compatible client (psql, DBeaver, pgAdmin, etc.) to connect and query your datatables.

```bash
wmill datatable serve [options]
```

### Options

| Option       | Parameters | Description                                           |
| ------------ | ---------- | ----------------------------------------------------- |
| `--port`     | `port`     | Port to listen on (default: first available 5433-5500)|
| `--host`     | `host`     | Bind address (default: `127.0.0.1`)                   |
| `--password` | `password` | Connection password (default: randomly generated)     |

### Behavior

- Implements the PostgreSQL wire protocol (read-only queries only)
- Each datatable appears as a separate database in the connection
- Supports prepared statements and parameterized queries
- Emulates Postgres system tables (like `pg_database`) for tool compatibility

### Example

```bash
wmill datatable serve
```

Output:

```
Serving datatables on 127.0.0.1:5433 via Postgres wire protocol

Available datatables:
  psql 'postgresql://wmill:a1b2c3d4e5f6@127.0.0.1:5433/main'
  psql 'postgresql://wmill:a1b2c3d4e5f6@127.0.0.1:5433/analytics'

Press Ctrl+C to stop.
```

Connect with any Postgres client using the connection string shown.

## Interactive psql session

Start a proxy server and launch an interactive `psql` session connected to it.

```bash
wmill datatable psql [options]
```

### Options

| Option              | Parameters | Description                                           |
| ------------------- | ---------- | ----------------------------------------------------- |
| `-n, --name`        | `name`     | Datatable to connect to (default: `main`)             |
| `--port`            | `port`     | Port for the proxy (default: first available 5433-5500)|
| `--host`            | `host`     | Bind address for the proxy (default: `127.0.0.1`)     |
| `--password`        | `password` | Connection password (default: randomly generated)     |

### Prerequisites

The `psql` client must be installed:

- **Linux**: `apt install postgresql-client`
- **macOS**: `brew install libpq`

### Examples

1. Interactive session with the default datatable:

```bash
wmill datatable psql
```

2. Connect to a specific datatable:

```bash
wmill datatable psql -n analytics
```

## Summary

| Command          | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `list`           | List all datatables in the workspace           |
| `run`            | Execute a single SQL query                     |
| `migrate new`    | Scaffold a new `.up.sql` / `.down.sql` migration |
| `migrate up`     | Apply all pending migrations                    |
| `migrate down`   | Roll back the most recent migration             |
| `serve`          | Start a Postgres proxy for external clients    |
| `psql`           | Launch an interactive psql session             |
