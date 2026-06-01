import React from 'react';
import CaseStudyLayout from '../../components/case-studies/CaseStudyLayout';
import Onekomma5Content, { frontMatter } from './_1komma5-content.mdx';
import { onekomma5CaseStudy } from '../../data/case-studies/1komma5';

export default function Onekomma5CaseStudyPage() {
	return <CaseStudyLayout Content={Onekomma5Content} frontMatter={frontMatter} caseStudyData={onekomma5CaseStudy} />;
}
