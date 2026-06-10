import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useInkeepSettings from '../utils/useInkeepSettings';

export default function SearchBarWrapper({ className }) {
	const [SearchBar, setSearchBar] = useState(null);

	useEffect(() => {
		(async () => {
			const { InkeepSearchBar } = await import('@inkeep/cxkit-react');
			setSearchBar(() => InkeepSearchBar);
		})();
	}, []);

	const { baseSettings, aiChatSettings, searchSettings } = useInkeepSettings();

	const searchBarProps = {
		baseSettings,
		aiChatSettings,
		searchSettings,
		modalSettings: {
			shortcutKey: 'k'
		}
	};

	return (
		<div className={`inkeep-search ${className || ''}`}>
			<BrowserOnly fallback={<div />}>
				{() => {
					return SearchBar ? <SearchBar {...searchBarProps} /> : <div />;
				}}
			</BrowserOnly>
		</div>
	);
}
