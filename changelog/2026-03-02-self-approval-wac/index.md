---
slug: self-approval-wac
title: selfApproval option for workflows as code
tags: ['Workflows as code', 'Enterprise']
description: Approval steps in workflows as code now expose a selfApproval flag (TypeScript) and self_approval (Python) to control whether the user who triggered the workflow can also approve it, matching the visual flow editor toggle.
features:
  [
    'New selfApproval / self_approval parameter on approval steps in workflows as code.',
    'Set to false to require a different approver, matching the visual flow editor toggle.',
    'Available in the TypeScript and Python WAC SDKs.',
  ]
docs: /docs/core_concepts/workflows_as_code
---
