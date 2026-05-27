---
slug: customai-custom-headers
title: Custom headers on AI requests
tags: ['AI']
description: The customai resource accepts a headers object to attach arbitrary headers to every AI request, and a new AI_HTTP_HEADERS env var applies headers globally across all providers (OpenAI, Anthropic, Azure, Bedrock).
features:
  [
    'headers field on customai resources: map of header names to values, attached to every request made with that resource.',
    'AI_HTTP_HEADERS env var on the server and workers attaches headers to every outgoing AI request across all providers (OpenAI, Anthropic, Azure, Bedrock, etc.).',
    'Useful for upstream proxies, gateway authentication, and routing metadata.',
  ]
docs: /docs/core_concepts/ai_generation
---
