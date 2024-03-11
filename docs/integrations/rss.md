# RSS Integration

To integrate [RSS](https://rss.com/) to Windmill, you need to save the following elements as a [resource](../core_concepts/3_resources_and_types/index.mdx).

![Add RSS Resource](../assets/integrations/add-rss.png.webp)

| Property | Type   | Description | Default | Required | Where to Find                           |
| -------- | ------ | ----------- | ------- | -------- | --------------------------------------- |
| url      | string | Feed URL    |         | true     | Provided by the RSS feed source website |

<br/><br/>

Your resource can be used [passed as parameters](../core_concepts/3_resources_and_types/index.mdx#passing-resources-as-parameters-to-scripts-preferred) or [directly fetched](../core_concepts/3_resources_and_types/index.mdx#fetching-them-from-within-a-script-by-using-the-wmill-client-in-the-respective-language) within [scripts](../script_editor/index.mdx), [flows](../flows/1_flow_editor.mdx) and [apps](../apps/0_app_editor/index.mdx).

<video
	className="border-2 rounded-xl object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/add_resources_variables.mp4"
/>

<br/>

:::tip

Find some pre-set interactions with RSS on the [Hub](https://hub.windmill.dev/integrations/RSS).

Feel free to create your own RSS scripts on [Windmill](../getting_started/00_how_to_use_windmill/index.mdx).

:::
