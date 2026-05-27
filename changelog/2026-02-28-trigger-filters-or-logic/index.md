---
slug: trigger-filters-or-logic
title: OR logic for WebSocket and Kafka trigger filters
tags: ['Triggers']
description: WebSocket and Kafka triggers now support combining multiple filters with OR in addition to the default AND, so a single trigger can match any one of several payload patterns instead of all of them.
features:
  [
    'Filter logic selector on WebSocket and Kafka triggers: AND (default) or OR.',
    'OR matches messages that satisfy any of the configured filters.',
    'Existing triggers default to AND; the selector only appears when at least one filter is configured.',
  ]
docs: /docs/core_concepts/websocket_triggers
---
