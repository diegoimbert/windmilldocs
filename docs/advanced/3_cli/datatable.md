---
description: How do I query and manage data tables using the Windmill CLI?
---

# Datatables

The `wmill datatable` commands let you query and manage [data tables](../../core_concepts/11_persistent_storage/data_tables.mdx) from the CLI. You can list available datatables, run SQL queries, or start an interactive PostgreSQL session.

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

| Command | Purpose                                        |
| ------- | ---------------------------------------------- |
| `list`  | List all datatables in the workspace           |
| `run`   | Execute a single SQL query                     |
| `serve` | Start a Postgres proxy for external clients    |
| `psql`  | Launch an interactive psql session             |
