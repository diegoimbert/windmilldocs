---
slug: otel-inbound-distributed-trace
title: Jobs join the caller's inbound distributed trace
tags: ['Self-hosted', 'Enterprise']
description: When OTEL tracing is enabled, a job run through a webhook or REST endpoint with a W3C traceparent header is connected to the caller's distributed trace. The job span and its flow step and script spans are relocated under the caller's span so the whole execution appears as one end-to-end trace, instead of as a separate one.
version: v1.719.0
features:
  [
    'A traceparent header on the run endpoints connects the job to the inbound distributed trace.',
    'The job span, its flow steps and script subprocess relocate under the caller span in your tracing backend.',
    'The inbound traceparent is exposed as the TRACEPARENT env var and propagated to every flow step.',
    'Invalid traceparent headers are ignored, so the job_id / root_job trace lookup keeps working.',
  ]
docs: /docs/misc/guides/otel#connecting-jobs-to-an-inbound-distributed-trace
---
