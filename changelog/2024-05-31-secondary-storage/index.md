---
slug: secondary-storage
version: v1.340.0
title: Secondary Storage
tags: ['Persistent Storage']
image: ./secondary_storage.png
description: Read and write from a storage that is not your main storage by specifying it in the S3 object as "secondary_storage" with the name of it.
features:
  [
    'Add additional storages from S3, Azure Blob, AWS OIDC or Azure Workload Identity.',
    'From script, specify the secondary storage with an object with properties `s3` (path to the file) and `storage` (name of the secondary storage).'
  ]
docs: /docs/core_concepts/object_storage_in_windmill#secondary-s3-storage
---