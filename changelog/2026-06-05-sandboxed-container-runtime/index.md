---
slug: sandboxed-container-runtime
version: v1.719.0
title: Sandboxed daemonless container runtime
tags: ['Scripts', 'Enterprise']
description: Bash scripts can now run any container image with the `# sandbox <image>` annotation. The image rootfs is pulled with crane and run chrooted inside the job's own nsjail, so it is daemonless, needs no Docker socket or dind sidecar, and is safe to run for untrusted multi-tenant code. Docker scripts are now allowed on Windmill Cloud.
features:
  [
    'Run any container image from a bash script with `# sandbox <image>` — the body runs inside the image, sandboxed.',
    'Daemonless: image rootfs is pulled with crane and run chrooted in the job nsjail, no Docker socket or dind sidecar.',
    'Inherits the job confinement: no host filesystem, the jail own /proc, unprivileged worker uid, the job network.',
    'Instance settings for pull policy, per-image and cache size caps, default registry, and private-registry auth.',
    'Now available on Windmill Cloud since containers run sandboxed.',
  ]
docs: /docs/advanced/docker
---
