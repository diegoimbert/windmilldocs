const fs = require('fs');
const path = require('path');

const SITE = 'https://www.windmill.dev';
const REPO_ROOT = path.join(__dirname, '..');
const SITEMAP = path.join(REPO_ROOT, 'build', 'sitemap.xml');
const LLMS_TXT = path.join(REPO_ROOT, 'static', 'llms.txt');
const BUILD_DIR = path.join(REPO_ROOT, 'build');
const BUILD_DOCS_DIR = path.join(BUILD_DIR, 'docs');
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
		[...llms.matchAll(/https:\/\/[^\s)>]+/g)].map((m) => {
			let u = m[0].replace(/[.,)]+$/, '');
			if (u.endsWith('.md')) u = u.slice(0, -3);
			return u;
		})
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

// Append `.md` to a /docs/ URL so it points to the clean markdown variant
// generated alongside the HTML page. Per llmstxt.org: ".md appended" to the
// page URL is the canonical pattern for linking AI consumers to clean content.
function mdLinkUrl(url) {
	if (!url.startsWith(SITE + '/docs/')) return url;
	if (url.endsWith('.md')) return url;
	return url + '.md';
}

function formatEntry(label, url, file) {
	const desc = descriptionFromFile(file);
	const linkUrl = mdLinkUrl(url);
	return desc ? `- [${label}](${linkUrl}): ${desc}` : `- [${label}](${linkUrl})`;
}

// Strip MDX/JSX components and HTML wrappers while preserving fenced code
// blocks (which may legitimately contain JSX/HTML/import syntax in examples).
//
// Two structural quirks to handle:
//  - Multi-line ES6 imports (`import {\n  X,\n  Y,\n} from '...';`) — line-
//    anchored stripping would leave orphan lines, so do a multi-line pass first.
//  - JSX wrappers around code fences (e.g. `<Tabs>` / `<TabItem>` wrapping
//    multiple ```code``` blocks). The fence-aware splitter separates the open
//    and close tags into different segments, so a per-segment JSX-with-content
//    regex misses them. Stripping standalone open/close tag lines as a final
//    pass cleans these up without damaging fence contents.
function cleanMarkdown(content) {
	// Pre-pass over the whole content (not split): strip multi-line imports.
	// Match across newlines until the closing `;` or `} from '...';`.
	let pre = content.replace(
		/^[ \t]*(?:import|export)\b[^;`]*?(?:;\s*$|}\s+from\s+['"][^'"]+['"]\s*;?\s*$)/gm,
		''
	);

	const segments = pre.split(/(^```[\s\S]*?^```)/m);
	const cleaned = segments
		.map((seg, i) => {
			if (i % 2 === 1) return seg; // code fence — leave verbatim
			let s = seg;
			s = s.replace(/^\s*(?:import|export)\s+[^\n;]*;?\s*$/gm, '');
			s = s.replace(/<[A-Z][a-zA-Z0-9]*(?:\s[^>]*?)?\s*\/>/gs, '');
			s = s.replace(/<([A-Z][a-zA-Z0-9]*)(?:\s[^>]*?)?>[\s\S]*?<\/\1>/g, '');
			s = s.replace(
				/<\/?(?:div|span|br|hr|img|video|source|iframe|details|summary|figure|figcaption|center|p)\b[^>]*>/gi,
				''
			);
			return s;
		})
		.join('');

	// Final pass on the reassembled content: drop lines that are JUST a JSX
	// opening or closing tag (catches Tabs/TabItem wrappers around code fences
	// whose open and close ended up in different segments).
	const lines = cleaned.replace(/\r\n/g, '\n').split('\n');
	const stripped = lines.filter(
		(l) =>
			!/^\s*<\/?[A-Z][a-zA-Z0-9]*(?:\s[^>]*)?\s*\/?>\s*$/.test(l)
	);

	return stripped
		.map((l) => l.replace(/[ \t]+$/, ''))
		.join('\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

function stripFrontmatter(raw) {
	return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function readPageBody(file) {
	try {
		const raw = fs.readFileSync(file, 'utf-8');
		return cleanMarkdown(stripFrontmatter(raw));
	} catch {
		return '';
	}
}

function urlToMdRelPath(url) {
	return url.replace(SITE + '/docs/', '') + '.md';
}

function composeMarkdownPage(title, description, body) {
	// If body already has any H1, don't prepend a second one — but inject the
	// description blockquote right after that H1 so reader/AI see Title → summary.
	const h1Re = /^#\s+.+$/m;
	const bodyHasH1 = h1Re.test(body);
	if (bodyHasH1) {
		if (!description) return body + '\n';
		return body.replace(h1Re, (h1) => `${h1}\n\n> ${description}`) + '\n';
	}
	const desc = description ? `> ${description}\n\n` : '';
	return `# ${title}\n\n${desc}${body}\n`;
}

// .md variants and llms-full.txt cover *every* doc, not just the curated set.
// The denylist (integrations/, apps/, flows/, ...) is only for the llms.txt
// index — keeping the .md files universal avoids 404s on canonical URLs and
// lets AI consumers fetch any page they discover via the HTML site.
function writeMarkdownVariants(urlToFile) {
	let written = 0;
	for (const [url, file] of urlToFile) {
		const docId = urlToDocId(url);
		const title = labelFromDocId(docId, file);
		const description = descriptionFromFile(file) || '';
		const body = readPageBody(file);
		const outPath = path.join(BUILD_DOCS_DIR, urlToMdRelPath(url));
		fs.mkdirSync(path.dirname(outPath), { recursive: true });
		fs.writeFileSync(outPath, composeMarkdownPage(title, description, body));
		written++;
	}
	return written;
}

function writeLLMsFullTxt(llms, urlToFile) {
	const headerEnd = llms.indexOf('## Documentation structure');
	// The llms.txt header advertises llms-full.txt; inside llms-full.txt itself,
	// replace that line with a back-pointer to the curated index.
	const header = (headerEnd === -1 ? llms : llms.slice(0, headerEnd))
		.split('\n')
		.map((line) =>
			line.includes('llms-full.txt')
				? 'This file contains the entire Windmill documentation as a single document. A curated per-page index with one-line descriptions is available at https://www.windmill.dev/llms.txt.'
				: line
		)
		.join('\n')
		.trim();

	const sections = [];
	const sortedEntries = [...urlToFile.entries()].sort((a, b) => a[0].localeCompare(b[0]));
	for (const [url, file] of sortedEntries) {
		const docId = urlToDocId(url);
		const title = labelFromDocId(docId, file);
		const body = readPageBody(file);
		sections.push(`## ${title}\n\nSource: ${url}\n\n${body}`);
	}
	const content = `${header}\n\n${sections.join('\n\n---\n\n')}\n`;
	const outPath = path.join(BUILD_DIR, 'llms-full.txt');
	fs.writeFileSync(outPath, content);
	return { path: outPath, sections: sections.length, bytes: content.length };
}

// Rewrite existing `- Label: URL` or `- [Label](URL)` lines under /docs/ into
// canonical `- [Label](URL.md): description` format. Preserves hand-curated
// labels, picks up descriptions from frontmatter, appends .md per spec.
function enrichExistingEntries(llms, urlToFile) {
	return llms
		.split('\n')
		.map((line) => {
			const legacy = line.match(/^- ([^:]+?):\s+(https:\/\/www\.windmill\.dev\/docs\/[^\s)]+)\s*$/);
			const canonical = line.match(
				/^- \[([^\]]+)\]\((https:\/\/www\.windmill\.dev\/docs\/[^)]+)\)(?:: .*)?\s*$/
			);
			const m = legacy || canonical;
			if (!m) return line;
			const label = m[1].trim();
			let url = m[2].replace(/[.,)]+$/, '');
			if (url.endsWith('.md')) url = url.slice(0, -3);
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
		const legacy = line.match(/^- [^:]+:\s+(https:\/\/www\.windmill\.dev\/docs\/[^\s)]+)/);
		const canonical = line.match(/^- \[[^\]]+\]\((https:\/\/www\.windmill\.dev\/docs\/[^)]+)\)/);
		const m = legacy || canonical;
		if (!m) return true;
		let url = m[1].replace(/[.,)]+$/, '');
		if (url.endsWith('.md')) url = url.slice(0, -3);
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

	const llmsTxtChanged =
		candidates.length > 0 || removed.length > 0 || enrichmentChanged;
	if (llmsTxtChanged) {
		fs.writeFileSync(LLMS_TXT, llms);
		console.log(`Updated ${LLMS_TXT}`);
	} else {
		console.log('llms.txt is up to date');
	}

	// Also write to build/ so deploys get the fresh file without waiting for
	// the CI auto-commit to round-trip through git.
	if (fs.existsSync(BUILD_DIR)) {
		fs.writeFileSync(path.join(BUILD_DIR, 'llms.txt'), llms);

		const mdCount = writeMarkdownVariants(urlToFile);
		console.log(`Wrote ${mdCount} markdown page variant(s) under ${BUILD_DOCS_DIR}/`);

		const full = writeLLMsFullTxt(llms, urlToFile);
		console.log(
			`Wrote ${full.path} (${full.sections} sections, ${(full.bytes / 1024).toFixed(0)} KB)`
		);
	}
}

main();
