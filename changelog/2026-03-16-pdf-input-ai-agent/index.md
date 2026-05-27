---
slug: pdf-input-ai-agent
title: PDF input for AI agents
tags: ['AI']
description: AI agent steps can now accept PDF documents as input alongside images, with provider-specific encoding for Anthropic, OpenAI, and Google AI handled automatically. Requires a workspace-level S3 object storage.
features:
  [
    'PDF documents can be passed as attachments to AI agent steps.',
    'Provider-specific encoding handled automatically: Anthropic document blocks, OpenAI input_file blocks, Google AI inline data.',
    'MIME type detected from the file extension; requires workspace-level S3 object storage.',
  ]
docs: /docs/core_concepts/ai_agents
---
