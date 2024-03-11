# Microsoft Azure Blob Integration

:::info Windmill for data pipelines

You can link a Windmill workspace to an Azure Blob storage account and use it as source and/or target of your processing steps seamlessly, without any boilerplate.

<br/>

See [Windmill for data pipelines](../core_concepts/27_data_pipelines/index.mdx) for more details.

:::

To integrate Microsoft Azure Blob Storage to Windmill, you need to save the following elements as a [resource](../core_concepts/3_resources_and_types/index.mdx).

| Property  | Type    | Description                  | Default | Required        | Where to Find                                      | Additional Details                                                                                                                                                                                |
| --------- | ------- | ---------------------------- | ------- | --------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accountName    | string  | Azure Account Name      |         | true            | Azure Portal > Storage account                     | Name of the Storage Account                                                                             |
| containerName  | string  | Name of the container holding the data |         | true            | Azure Portal > Storage account > Containers               | Each storage account can have multiple containers. Choose one to plug to use inside Windmill          |
| useSSL         | boolean | Use SSL for connections | true    | true            | Whether the endpoint is using HTTPS or HTTP | Unless you're hosting you own Blob storage, the ones hosted on Azure all uses HTTPS |
| endPoint       | string  | Azure Blob Storage endpoint  |         | false      | The endpoint of Azure's Blob storage | unless you're hosting your own Blob Storage or using proxies, this can be left empty |
| accessKey      | string  | Azure Blob Access Key   |         | false           | Azure Portal > Storage account > Access Keys       | Access Key to use to authenticate API calls |
