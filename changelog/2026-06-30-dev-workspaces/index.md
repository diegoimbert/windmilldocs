---
slug: dev-workspaces
title: Dev workspaces paired with a lockable prod workspace
tags: ['Workspace', 'Enterprise']
description: Pair a persistent dev workspace with a prod workspace that can be locked so changes only reach it through promotion. Edit safely in dev, mark resources and variables workspace-specific to keep separate values per environment, and promote manually from Compare & Deploy.
features:
  [
    'Persistent dev workspace with a plain, git-branch-safe workspace ID (no wm-fork- prefix)',
    'Lock the paired prod workspace against direct deploys and forking (reuses protection rulesets)',
    'On a locked prod, Edit redirects to the dev workspace with an "Edit in <dev>" affordance',
    'Attach or detach an existing workspace as dev from the Dev workspace settings tab',
    'Mark resources and variables workspace-specific from Compare & Deploy to keep separate values per environment',
    'Strictly create-only "Create in <other>" seeds a missing copy (including secrets) without overwriting',
    'AI chat session picker badges and steers toward the dev workspace on a locked prod',
  ]
docs: /docs/advanced/dev_workspaces
---
