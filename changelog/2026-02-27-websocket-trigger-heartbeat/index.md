---
slug: websocket-trigger-heartbeat
title: Application-level heartbeat for WebSocket triggers
tags: ['Triggers']
description: WebSocket triggers can now send periodic application-level keep-alive messages with optional state extraction from incoming messages, supporting protocols like Discord Gateway, STOMP, and custom APIs without spawning jobs.
features:
  [
    'Configurable heartbeat message and interval, sent at the Rust level with zero job overhead.',
    'Optional state field that captures a value from each inbound message and substitutes it into the heartbeat via {{state}}.',
    'Works for protocols that require app-level keep-alives (Discord Gateway, STOMP, custom APIs).',
  ]
docs: /docs/core_concepts/websocket_triggers#application-level-heartbeat
---
