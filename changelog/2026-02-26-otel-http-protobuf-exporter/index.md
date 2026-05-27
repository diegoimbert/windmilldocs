---
slug: otel-http-protobuf-exporter
title: HTTP and protobuf OTEL exporters
tags: ['Self-hosted']
description: Windmill can now export OpenTelemetry traces, metrics, and logs over HTTP/protobuf and HTTP/JSON in addition to gRPC, broadening the set of compatible OTLP collectors and managed observability backends.
features:
  [
    'New OTLP exporter protocol options: gRPC, HTTP/protobuf, and HTTP/JSON.',
    'Compatible with managed observability backends that only accept HTTP-based OTLP.',
    'Exporter protocol is configurable per signal alongside the existing endpoint setting.',
  ]
docs: /docs/misc/guides/otel
---
