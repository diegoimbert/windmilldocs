---
slug: otel-metrics
title: Windmill operational metrics over OTLP
tags: ['Self-hosted']
description: Windmill can now export its own operational metrics to any OTLP-compatible collector alongside traces and logs, complementing the existing Prometheus /metrics endpoint with a push-based option.
features:
  [
    'New "Metrics" toggle under Instance settings → OTEL/Prom.',
    'Operational metrics pushed to the same OTLP collector used for traces and logs.',
    'Complements the Prometheus /metrics scrape endpoint on port 8001 (push vs. pull).',
  ]
docs: /docs/misc/guides/otel#exporting-windmill-metrics-via-otlp
---
