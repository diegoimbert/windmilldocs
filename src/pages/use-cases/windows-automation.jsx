import React from 'react';
import UseCaseLayout from '../../components/use-cases/UseCaseLayout';
import Content, { frontMatter } from './windows-automation-content.mdx';
import { windowsAutomationUseCase } from '../../data/use-cases/windows-automation';

export default function WindowsAutomationPage() {
	return <UseCaseLayout Content={Content} frontMatter={frontMatter} useCaseData={windowsAutomationUseCase} />;
}
