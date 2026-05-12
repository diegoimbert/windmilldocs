const fs = require('fs');
const path = require('path');

const SITE = 'https://www.windmill.dev';
const REPO_ROOT = path.join(__dirname, '..');
const SITEMAP = path.join(REPO_ROOT, 'build', 'sitemap.xml');
const LLMS_TXT = path.join(REPO_ROOT, 'static', 'llms.txt');
const FALLBACK_SECTION = 'Recently added';

// URL path prefixes (relative to /docs/) to never auto-add: dense reference material
// or editor sub-features that roll up under a headline page already in llms.txt.
// Add to this list when noise appears in llms.txt.
const DENYLIST_PREFIXES = [
	'integrations/',
	'apps/',
	'flows/',
	'script_editor/',
	'code_editor/',
	'full_code_apps/',
	'react_vue_svelte_apps/',
	'misc/benchmarks/competitors/'
];

// Exact doc IDs (relative to /docs/) to never auto-add: section index pages
// already represented by the section heading in llms.txt.
const DENYLIST_EXACT = new Set([
	'intro',
	'core_concepts',
	'openflow',
	'full_code_apps',
	'react_vue_svelte_apps'
]);

const ENTERPRISE_PATHS = new Set([
	'misc/plans_details',
	'misc/saml_and_scim',
	'misc/white_labelling',
	'core_concepts/audit_logs',
	'core_concepts/autoscaling',
	'core_concepts/concurrency_limits',
	'core_concepts/oidc',
	'core_concepts/dedicated_workers',
	'core_concepts/agent_workers',
	'core_concepts/multiplayer',
	'core_concepts/content_search',
	'core_concepts/protection_rulesets'
]);

const SECTION_RULES = [
	{ section: 'Script languages', test: (id) => /^getting_started\/scripts_quickstart\//.test(id) },
	{ section: 'Getting started', test: (id) => id.startsWith('getting_started/') },
	{
		section: 'Triggers',
		test: (id) =>
			(id.startsWith('core_concepts/') &&
				/trigger|webhook|scheduling|mcp|http_routing/.test(id)) ||
			id === 'advanced/email_triggers'
	},
	{
		section: 'Editors',
		test: (id) =>
			id === 'script_editor' ||
			id === 'code_editor' ||
			id.startsWith('flows/flow_editor') ||
			id.startsWith('apps/app_editor')
	},
	{
		section: 'Hosting and deployment',
		test: (id) =>
			/^advanced\/(self_host|cli|git_sync|version_control|deploy_to_prod|local_development|scaling)/.test(
				id
			) || id.startsWith('cli_local_dev')
	},
	{
		section: 'Comparisons and benchmarks',
		test: (id) => id.startsWith('compared_to/') || id === 'misc/benchmarks'
	},
	{
		section: 'Core concepts',
		test: (id) =>
			id.startsWith('core_concepts/') ||
			id === 'misc/architecture' ||
			id === 'advanced/imports' ||
			id.startsWith('advanced/') ||
			id.startsWith('misc/')
	}
];

function* walkDocFiles(dir) {
	for (const e of fs.readdirSync(dir)) {
		const full = path.join(dir, e);
		const stat = fs.statSync(full);
		if (stat.isDirectory()) yield* walkDocFiles(full);
		else if (/\.(mdx?|md)$/.test(e)) yield full;
	}
}

function buildUrlToFileMap() {
	const map = new Map();
	const docsRoot = path.join(REPO_ROOT, 'docs');
	for (const file of walkDocFiles(docsRoot)) {
		const slug = extractFrontmatterField(readFileHead(file), 'slug');
		let url;
		if (slug) {
			url = slug.startsWith('http')
				? slug
				: SITE + '/docs' + (slug.startsWith('/') ? slug : '/' + slug);
		} else {
			const rel = path.relative(docsRoot, file);
			const docId = rel
				.replace(/\.(mdx?|md)$/, '')
				.replace(/\/index$/, '')
				.split('/')
				.map((s) => s.replace(/^\d+[_-]/, ''))
				.join('/');
			url = SITE + '/docs/' + docId;
		}
		map.set(url, file);
	}
	return map;
}

function urlToDocId(url) {
	return url.replace(SITE + '/docs/', '');
}

function extractFrontmatterField(content, field) {
	const re = new RegExp(`^---[\\s\\S]*?\\n${field}:\\s*(.+?)\\s*$`, 'm');
	const m = content.match(re);
	if (!m) return null;
	let val = m[1].trim();
	if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
		val = val.slice(1, -1);
	}
	return val;
}

function readFileHead(file, bytes = 2000) {
	try {
		return fs.readFileSync(file, 'utf-8').slice(0, bytes);
	} catch {
		return '';
	}
}

function isEnterprise(docId, file) {
	if (ENTERPRISE_PATHS.has(docId)) return true;
	if (!file) return false;
	return extractFrontmatterField(readFileHead(file), 'enterprise') === 'true';
}

function classify(docId, file) {
	if (isEnterprise(docId, file)) return 'Enterprise features';
	for (const rule of SECTION_RULES) {
		if (rule.test(docId)) return rule.section;
	}
	return FALLBACK_SECTION;
}

function isDenied(docId) {
	if (DENYLIST_EXACT.has(docId)) return true;
	return DENYLIST_PREFIXES.some((p) => docId.startsWith(p));
}

function readSitemapUrls() {
	const xml = fs.readFileSync(SITEMAP, 'utf-8');
	return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
}

function readExistingUrls(llms) {
	return new Set(
		[...llms.matchAll(/https:\/\/[^\s)>]+/g)].map((m) => m[0].replace(/[.,)]+$/, ''))
	);
}

function labelFromDocId(docId, file) {
	if (file) {
		const title = extractFrontmatterField(readFileHead(file), 'title');
		if (title) return title;
	}
	const slug = docId.split('/').filter(Boolean).pop() || '';
	const words = slug.replace(/[_-]/g, ' ');
	return words.charAt(0).toUpperCase() + words.slice(1);
}

function descriptionFromFile(file) {
	if (!file) return null;
	return extractFrontmatterField(readFileHead(file), 'description');
}

function formatEntry(label, url, file) {
	const desc = descriptionFromFile(file);
	return desc ? `- [${label}](${url}): ${desc}` : `- [${label}](${url})`;
}

// Rewrite existing `- Label: URL` lines under /docs/ into canonical
// `- [Label](URL): description` format. Preserves hand-curated labels.
function enrichExistingEntries(llms, urlToFile) {
	return llms
		.split('\n')
		.map((line) => {
			const m = line.match(/^- ([^:]+?):\s+(https:\/\/www\.windmill\.dev\/docs\/[^\s)]+)\s*$/);
			if (!m) return line;
			const label = m[1].trim();
			const url = m[2].replace(/[.,)]+$/, '');
			const file = urlToFile.get(url);
			return formatEntry(label, url, file);
		})
		.join('\n');
}

function insertEntries(llms, section, entries) {
	const heading = `### ${section}`;
	const lines = llms.split('\n');
	const headingIdx = lines.findIndex((l) => l === heading);

	if (headingIdx === -1) {
		if (section !== FALLBACK_SECTION) {
			console.warn(`  section "${section}" not found in llms.txt; falling back to "${FALLBACK_SECTION}"`);
			return insertEntries(llms, FALLBACK_SECTION, entries);
		}
		const block = `\n${heading}\n${entries.join('\n')}\n\n`;
		if (llms.includes('## Optional')) {
			return llms.replace('## Optional', block + '## Optional');
		}
		return llms.replace(/\n*$/, '\n') + block;
	}

	let endIdx = headingIdx + 1;
	while (endIdx < lines.length && lines[endIdx].startsWith('- ')) {
		endIdx++;
	}
	lines.splice(endIdx, 0, ...entries);
	return lines.join('\n');
}

function removeStaleDocsLines(llms, sitemap) {
	const lines = llms.split('\n');
	const removed = [];
	const kept = lines.filter((line) => {
		// Match either `- Label: URL` (legacy) or `- [Label](URL)` (canonical)
		const legacy = line.match(/^- [^:]+:\s+(https:\/\/www\.windmill\.dev\/docs\/[^\s)]+)/);
		const canonical = line.match(/^- \[[^\]]+\]\((https:\/\/www\.windmill\.dev\/docs\/[^)]+)\)/);
		const m = legacy || canonical;
		if (!m) return true;
		const url = m[1].replace(/[.,)]+$/, '');
		if (sitemap.has(url)) return true;
		removed.push(url);
		return false;
	});
	return { llms: kept.join('\n'), removed };
}

function main() {
	if (!fs.existsSync(SITEMAP)) {
		console.error(`sitemap.xml not found at ${SITEMAP} — run \`npm run build\` first.`);
		process.exit(1);
	}

	const sitemap = readSitemapUrls();
	const urlToFile = buildUrlToFileMap();
	let llms = fs.readFileSync(LLMS_TXT, 'utf-8');

	const { llms: cleaned, removed } = removeStaleDocsLines(llms, sitemap);
	llms = cleaned;
	if (removed.length) {
		console.log(`Removed ${removed.length} stale URL(s) no longer in sitemap:`);
		removed.forEach((u) => console.log(`  ${u}`));
	}

	const enriched = enrichExistingEntries(llms, urlToFile);
	const enrichmentChanged = enriched !== llms;
	llms = enriched;
	if (enrichmentChanged) {
		console.log('Rewrote existing docs entries into canonical format with descriptions');
	}

	const existing = readExistingUrls(llms);
	const docsUrls = [...sitemap].filter((u) => u.startsWith(SITE + '/docs/'));
	const candidates = docsUrls
		.filter((u) => !existing.has(u))
		.map((u) => ({ url: u, docId: urlToDocId(u), file: urlToFile.get(u) || null }))
		.filter(({ docId }) => !isDenied(docId));

	if (candidates.length === 0 && removed.length === 0 && !enrichmentChanged) {
		console.log('llms.txt is up to date');
		return;
	}

	const bySection = new Map();
	for (const { url, docId, file } of candidates) {
		const section = classify(docId, file);
		const entry = formatEntry(labelFromDocId(docId, file), url, file);
		if (!bySection.has(section)) bySection.set(section, []);
		bySection.get(section).push(entry);
	}

	if (candidates.length) {
		console.log(`Adding ${candidates.length} page(s):`);
		for (const [section, entries] of bySection) {
			console.log(`  ${section}: ${entries.length}`);
		}
	}

	for (const [section, entries] of bySection) {
		entries.sort();
		llms = insertEntries(llms, section, entries);
	}
	fs.writeFileSync(LLMS_TXT, llms);
	console.log(`Updated ${LLMS_TXT}`);
}

main();
