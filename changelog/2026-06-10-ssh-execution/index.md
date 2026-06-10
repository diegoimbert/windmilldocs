---
slug: ssh-execution
version: v1.721.0
title: Run bash scripts on a remote SSH host
tags: ['Scripts', 'Enterprise']
description: Bash scripts starting with a `#ssh <resource_path>` directive now run on the remote host described by the referenced `ssh_target` resource, for jump/utility nodes where no worker can be placed. Full parity with local bash jobs - typed positional args, structured result, live streamed logs, cancellation and remote exit-code propagation. Enterprise feature, off by default (`ssh_execution_enabled` instance setting). Agent workers remain the recommended way to run code in isolated environments.
features:
  [
    'Add `#ssh <resource_path>` as the first comment line of a bash script to run it on the remote host of an `ssh_target` resource.',
    'Full parity with local bash jobs: typed args, result collection (result.json > result.out > last stdout line), live logs, cancellation, remote exit code fails the job.',
    'Dynamic target with `#ssh $<arg_name>`: the target resource path is supplied as a job argument at call time, resolved through the runner resource permissions.',
    'Host-key pinning enforced when the resource sets `host_pubkey`; trust-on-first-use only with explicit `accept_unknown_host`.',
    'Enterprise-gated and off by default: enable the `ssh_execution_enabled` instance setting as a superadmin.',
    'A userland wrapper (`ssh_exec.sh` / `ssh_exec.py`) with the same SSH mechanics is available without a license in examples/usecase/ssh-execution-wrapper.',
  ]
docs: /docs/advanced/ssh_execution
---
