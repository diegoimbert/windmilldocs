import React from 'react';
import CaseStudyLayout from '../../components/case-studies/CaseStudyLayout';
import WezooContent, { frontMatter } from './wezoo-content.mdx';
import { wezooCaseStudy } from '../../data/case-studies/wezoo';

export default function WezooCaseStudyPage() {
	return <CaseStudyLayout Content={WezooContent} frontMatter={frontMatter} caseStudyData={wezooCaseStudy} />;
}
