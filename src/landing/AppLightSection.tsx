import React from 'react';
import LandingSection from './LandingSection';
import CardSection from './cards-v2/CardSection';
import { Code, Gauge, Hand, Palette, Puzzle, LucideIcon } from 'lucide-react';

const features = [
	{
		title: 'Drag and Drop Interface',
		description:
			'Easily assemble apps with a user-friendly drag and drop interface, streamlining app development without deep coding. Use over 50 built-in components for fast and efficient app development, covering a wide range of functionalities.',
		Icon: Hand,
		defaultImage: '/illustrations/components.png',
		url: '/docs/apps/app_configuration_settings/app_component_library'
	},

	/*
	{
		title: 'High-Performance Apps',
		description:
			'Experience responsive and efficient apps, thanks to a reactive engine that handles complex operations smoothly.',
		Icon: Gauge,
		vertical: true,
		defaultImage: '/illustrations/app_performance.png'
	},
	*/
	{
		title: 'Styling and Theming',
		description:
			'Style components and define global themes with CSS or Tailwind, ensuring cohesive and brand-aligned designs effortlessly.',
		Icon: Palette,
		defaultImage: '/illustrations/13.png',
		vertical: true,
		url: '/docs/apps/app_configuration_settings/app_styling'
	},
	{
		title: 'Developer Friendly',
		description:
			'Run scripts in Python, Go, Bash, SQL, and TypeScript directly within the app editor.',
		Icon: Code,
		defaultImage: '/illustrations/14.png',
		url: '/docs/apps/app-runnable-panel',
		vertical: true
	}
] as {
	title: string;
	description: string;
	images: string[];
	span: string;
	height: number;
	noAnimation?: boolean;
	lottieData?: unknown;
	Icon: LucideIcon;
	vertical?: boolean;
	defaultImage: string;
	url: string;
}[];

const colors = {
	titleColor: 'text-orange-900 dark:text-orange-300',
	textColor: 'text-gray-600 dark:text-gray-100',
	linkColor: 'text-orange-500 dark:text-orange-300'
};

export default function FlowsLightSections() {
	return (
		<LandingSection bgClass="">
			<CardSection
				colors={colors}
				title="Build fast apps using drag and drop"
				description="Create apps with a user-friendly drag-and-drop interface, streamlining app development without deep coding."
				features={features}
				defaultImage="/illustrations/fond-apps.png"
			/>
		</LandingSection>
	);
}
