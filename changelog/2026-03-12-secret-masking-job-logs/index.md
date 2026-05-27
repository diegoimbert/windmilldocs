---
slug: secret-masking-job-logs
title: Secret masking in job logs
tags: ['Security']
description: Windmill now masks secret values in job logs automatically, replacing all but the first 3 characters with stars and emitting a one-time notice. Masking happens in-memory so plaintext never lands in job_logs.
features:
  [
    'Plaintext values of secret variables and $encrypted: arguments are tracked per-job and masked in stdout/stderr before logs are persisted.',
    'First 3 characters are kept for debuggability; the rest is replaced by *****.',
    'Only values of 8 characters or more are masked, to avoid false positives like "true" or "1234".',
    'Masking happens in-memory before logs are written to the database, so plaintext never lands in job_logs.',
  ]
docs: /docs/core_concepts/variables_and_secrets#secret-masking-in-job-logs
---
