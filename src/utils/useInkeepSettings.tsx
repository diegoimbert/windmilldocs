import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { ThemeConfig } from '@docusaurus/preset-classic';
import type { PrismTheme } from 'prism-react-renderer';

import type {
	InkeepAIChatSettings,
	InkeepSearchSettings,
	InkeepBaseSettings
} from '@inkeep/cxkit-react';

type InkeepIdentifierSettings = {
	apiKey: string;
};

type InkeepSharedSettings = {
	baseSettings: InkeepBaseSettings;
	aiChatSettings: InkeepAIChatSettings;
	searchSettings: InkeepSearchSettings;
};

const useInkeepSettings = (): InkeepSharedSettings => {
	const { siteConfig } = useDocusaurusContext();
	const inkeepBaseConfig = siteConfig.customFields.inkeepCredentials as InkeepIdentifierSettings;
	const themeConfig: ThemeConfig = siteConfig.themeConfig;
	const { theme, darkTheme } = themeConfig?.prism || {};

	const baseSettings: InkeepBaseSettings = {
		apiKey: inkeepBaseConfig.apiKey || '',
		organizationDisplayName: 'Windmill',
		primaryBrandColor: '#3b82f6',
		privacyPreferences: {
			optOutAnalyticalCookies: true
		},
		colorMode: {
			sync: {
				target: 'html',
				attributes: ['data-theme'],
				isDarkMode: (attributes) => attributes['data-theme'] === 'dark'
			}
		},
		theme: {
			syntaxHighlighter: {
				lightTheme: theme as PrismTheme,
				darkTheme: darkTheme as PrismTheme
			}
		},
		transformSource: (source) => {
			const url = source.url || '';
			if (url.includes('app.windmill.dev/openapi.html')) {
				return { ...source, tabs: ['API'] };
			}
			if (url.includes('windmill.dev/blog')) {
				return { ...source, tabs: ['Blog'] };
			}
			if (url.includes('windmill.dev/docs')) {
				return { ...source, tabs: ['Docs'] };
			}
			if (url.includes('windmill.dev')) {
				return { ...source, tabs: ['Home'] };
			}
			return source;
		}
	};

	const aiChatSettings: InkeepAIChatSettings = {
		aiAssistantName: 'Windmill',
		aiAssistantAvatar: '/img/windmill.svg',
		exampleQuestions: [
			'How do I automatically trigger a flow every 24 hours?',
			'Can I use an Azure auth provider for authenticating users?',
			'How do I run Windmill locally with Bun?'
		],
		getHelpOptions: [
			{
				name: 'Discord',
				icon: { builtIn: 'FaDiscord' },
				action: {
					type: 'open_link',
					url: 'https://discord.com/invite/V7PM2YHsPB'
				}
			},
			{
				name: 'GitHub',
				icon: { builtIn: 'FaGithub' },
				action: {
					type: 'open_link',
					url: 'https://github.com/windmill-labs/windmill/issues'
				}
			}
		]
	};

	const searchSettings: InkeepSearchSettings = {
		placeholder: 'Search...',
		tabs: ['Docs', 'Blog', 'API', 'Home', 'GitHub']
	};

	return { baseSettings, aiChatSettings, searchSettings };
};

export default useInkeepSettings;
