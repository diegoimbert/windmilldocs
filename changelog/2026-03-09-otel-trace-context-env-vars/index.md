---
slug: otel-trace-context-env-vars
title: OTEL trace context exposed in jobs
tags: ['Self-hosted']
description: When OTEL tracing is enabled, Windmill now exposes the W3C trace context of each job as TRACEPARENT and related env vars in the runtime, so user scripts can propagate context to downstream services across all supported languages.
features:
  [
    'TRACEPARENT environment variable set on every job runtime when OTEL is enabled.',
    'Format follows the W3C Trace Context spec: 00-{trace_id}-{span_id}-01.',
    'Available across all supported languages: Python, Bash, Bun, Deno, Go, TypeScript, Rust, C#, Ruby, Nu, Java, PHP.',
  ]
docs: /docs/misc/guides/otel#otel-trace-context-in-jobs
---
