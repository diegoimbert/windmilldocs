---
slug: k8s-scale-in-pod-deletion-cost
title: Kubernetes autoscaling scale-in prefers idle worker pods
tags: ['Autoscaling', 'Kubernetes', 'Enterprise']
description: The native Kubernetes autoscaling integration now annotates worker pods with pod-deletion-cost before scaling in, so the ReplicaSet controller deletes idle pods first instead of picking victims blindly. Busy pods are protected proportionally to the age of their oldest running job. The annotation pass is best-effort and requires optional list/patch RBAC on pods; without it, scaling proceeds as before with a warning.
features:
  [
    'Before a scale-in, worker pods are annotated with controller.kubernetes.io/pod-deletion-cost.',
    'Idle pods get cost 0 and are deleted first; busy pods get 10 + the age of their oldest running job in seconds (capped at 1 day).',
    'Best-effort: missing RBAC, API or DB errors never fail the scaling operation, it falls back to the previous behavior with a warning.',
    'Requires optional list and patch permissions on pods; the autoscaling health check now warns (non-fatally) if they are missing.',
    'Honored on Kubernetes 1.22+ where the PodDeletionCost feature gate is enabled by default.',
  ]
docs: /docs/core_concepts/autoscaling#scale-in-prefers-idle-workers
---
