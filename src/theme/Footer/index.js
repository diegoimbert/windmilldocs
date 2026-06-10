import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useInkeepSettings from '../../utils/useInkeepSettings';

function Footer() {
	const [ChatButton, setChatButton] = useState(null);

	useEffect(() => {
		(async () => {
			const { InkeepChatButton } = await import('@inkeep/cxkit-react');
			setChatButton(() => InkeepChatButton);
		})();
	}, []);

	const { baseSettings, aiChatSettings, searchSettings } = useInkeepSettings();

	const chatButtonProps = {
		baseSettings,
		aiChatSettings,
		searchSettings,
		label: 'Ask AI',
		modalSettings: {
			// The search bar already owns the Cmd/Ctrl+K shortcut
			shortcutKey: null
		}
	};

	return (
		<BrowserOnly fallback={<div />}>
			{() => {
				return ChatButton ? <ChatButton {...chatButtonProps} /> : <div />;
			}}
		</BrowserOnly>
	);
}
export default React.memo(Footer);
