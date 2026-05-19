---
slug: audit-logs-object-storage
title: Export audit logs to object storage
tags: ['Enterprise', 'Audit logs']
version: v1.704.0
description: Continuously export audit logs as newline-delimited JSON to a dedicated logs/audit/ folder in instance object storage, for SIEM forwarding and archival.
features:
  [
    'Opt-in export of audit logs to S3, Azure Blob or Google Cloud Storage',
    'Newline-delimited JSON written to a dedicated logs/audit/ folder, partitioned by day',
    'Incremental and runs in the background off the audit log hot path, with a single exporter under high availability',
    'Exported files are never deleted from object storage, so database retention can be set much lower',
    'Recommended setup to forward audit logs to a SIEM for long-term security analysis'
  ]
docs: /docs/core_concepts/audit_logs#exporting-audit-logs-to-object-storage
---

<!-- TODO image: changelog/2026-05-19-audit-logs-object-storage/audit_logs_object_storage.png
     Suggested screenshot: the instance settings "Object Storage" section showing the
     "Store audit logs in object storage" toggle enabled, ideally alongside a file
     browser/bucket view of the logs/audit/dt=YYYY-MM-DD/ NDJSON files. -->
