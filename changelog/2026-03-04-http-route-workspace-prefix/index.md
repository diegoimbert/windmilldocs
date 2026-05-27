---
slug: http-route-workspace-prefix
title: Enforce HTTP route workspace prefix instance-wide
tags: ['Triggers', 'Self-hosted']
description: Self-hosted superadmins can now require every HTTP route to be served under /api/r/{workspace_id}/{route} via a single instance setting, matching the Cloud behavior and locking the per-route toggle.
features:
  [
    'New "HTTP route workspace prefix" instance setting under superadmin settings.',
    'When enabled, all routes are served under /api/r/{workspace_id}/{route}, regardless of the per-route toggle.',
    'The per-route toggle is disabled and labeled as enforced by the instance setting.',
  ]
docs: /docs/core_concepts/http_routing#workspace-prefix
---
