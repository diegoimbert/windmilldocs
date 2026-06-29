// Dead-link checker scoped to the content that effectively changed in a PR.
//
// Docusaurus already fails the build on broken *internal* links
// (onBrokenLinks: 'throw' in docusaurus.config.js), so this check focuses on
// the gap: external links (and absolute self-links) that 404 or die.
//
// Strategy:
//   1. Diff against the base ref to find the .md/.mdx pages that changed.
//   2. Map each changed file to its built URL, validated against build/sitemap.xml.
//   3. Crawl ONLY those pages on the local preview (no recursion) and verify
//      every link they contain - internal and external.
//
// Internal root-relative links (/docs/...) resolve against the local preview,
// so a new page linking to a route that does not exist fails here. External
// links (including https://www.windmill.dev marketing pages not built from this
// repo) are checked against the live site.
//
// Usage: node scripts/check-dead-links.mjs
//   env PREVIEW_URL  base URL of the running preview (default http://localhost:3000)
//   env DIFF_BASE    git ref to diff against (default: origin/main, else HEAD~1)
//   env CHECK_ALL    set to "1" to check every page in the sitemap, not just the diff

import { LinkChecker } from 'linkinator';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const PREVIEW_URL = (process.env.PREVIEW_URL || 'http://localhost:3000').replace(/\/$/, '');
const SITEMAP = 'build/sitemap.xml';

// Content roots and the URL prefix Docusaurus serves them under
// (see routeBasePath entries in docusaurus.config.js).
const ROOTS = [
	{ dir: 'docs/', base: '/docs/' },
	{ dir: 'changelog/', base: '/changelog/' },
	{ dir: 'blog/', base: '/blog/' },
	{ dir: 'brand_guidelines/', base: '/brand-guidelines/' }
];

// Hosts that routinely block crawlers with 403/429/999 - a failure here is a
// false positive, not a dead link. Add project-specific exceptions to
// scripts/dead-links-skip.json (merged in below).
const DEFAULT_SKIP = [
	'^https?://(www\\.)?linkedin\\.com',
	'^https?://(www\\.)?x\\.com',
	'^https?://(www\\.)?twitter\\.com',
	'^https?://(www\\.)?reddit\\.com',
	'^https?://(www\\.)?facebook\\.com',
	// Unresolved template placeholders in example URLs, e.g. /{service}_triggers
	'[{}]'
];

function loadExtraSkips() {
	const path = 'scripts/dead-links-skip.json';
	if (!existsSync(path)) return [];
	try {
		const parsed = JSON.parse(readFileSync(path, 'utf8'));
		return Array.isArray(parsed.skip) ? parsed.skip : [];
	} catch (err) {
		console.warn(`Could not parse ${path}: ${err.message}`);
		return [];
	}
}

function stripNumericPrefix(segment) {
	// "20_jobs" -> "jobs", "0_scripts_quickstart" -> "scripts_quickstart"
	return segment.replace(/^\d+_/, '');
}

// Best-effort source-file -> URL path. Reconciled against the sitemap below,
// so an imperfect guess is fine as long as the real route exists there.
function deriveCandidate(file) {
	const root = ROOTS.find((r) => file.startsWith(r.dir));
	if (!root) return null;

	let rel = file.slice(root.dir.length).replace(/\.(mdx?|tsx?|jsx?)$/, '');
	const segments = rel.split('/').map(stripNumericPrefix);
	if (segments[segments.length - 1] === 'index') segments.pop();

	const path = (root.base + segments.join('/')).replace(/\/+$/, '');
	return path || root.base.replace(/\/$/, '');
}

function frontmatterSlug(file) {
	if (!existsSync(file)) return null;
	const text = readFileSync(file, 'utf8');
	const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!fm) return null;
	const slug = fm[1].match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
	return slug ? slug[1].trim() : null;
}

function readSitemap() {
	if (!existsSync(SITEMAP)) {
		console.error(`Missing ${SITEMAP} - run "npm run build" before this check.`);
		process.exit(1);
	}
	const xml = readFileSync(SITEMAP, 'utf8');
	const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]));
	const paths = new Set(locs.map((u) => u.pathname.replace(/\/$/, '')));
	// All locs share the production siteUrl origin (https://www.windmill.dev).
	const origin = locs.length ? locs[0].origin : null;
	return { paths, origin };
}

function changedFiles() {
	const base = process.env.DIFF_BASE || 'origin/main';
	let range;
	try {
		execSync(`git rev-parse --verify --quiet ${base}`, { stdio: 'ignore' });
		range = `${base}...HEAD`;
	} catch {
		range = 'HEAD~1...HEAD';
	}
	const out = execSync(`git diff --name-only --diff-filter=ACMR ${range}`, { encoding: 'utf8' });
	return out
		.split('\n')
		.map((f) => f.trim())
		.filter(Boolean)
		.filter((f) => /\.mdx?$/.test(f))
		.filter((f) => ROOTS.some((r) => f.startsWith(r.dir)));
}

// Resolve each changed file to a real route present in the sitemap.
function resolveRoutes(files, sitemap) {
	const routes = new Set();
	const unmapped = [];

	for (const file of files) {
		const candidates = [];
		const slug = frontmatterSlug(file);
		if (slug && slug.startsWith('/')) candidates.push(slug.replace(/\/$/, ''));
		const derived = deriveCandidate(file);
		if (derived) {
			candidates.push(derived);
			if (slug && !slug.startsWith('/')) {
				// relative slug overrides the last path segment
				candidates.push(derived.replace(/\/[^/]*$/, `/${slug}`).replace(/\/$/, ''));
			}
		}

		let match = candidates.find((c) => sitemap.has(c));
		// Fall back to a unique tail match (handles dated changelog/blog slugs).
		if (!match && derived) {
			const tail = derived.split('/').pop();
			const tailMatches = [...sitemap].filter((p) => p.endsWith(`/${tail}`));
			if (tailMatches.length === 1) match = tailMatches[0];
		}

		if (match) routes.add(match);
		else unmapped.push(file);
	}

	return { routes: [...routes], unmapped };
}

async function main() {
	const { paths: sitemap, origin: siteOrigin } = readSitemap();

	let routes;
	if (process.env.CHECK_ALL === '1') {
		routes = [...sitemap];
		console.log(`Checking all ${routes.length} sitemap pages.`);
	} else {
		const files = changedFiles();
		if (files.length === 0) {
			console.log('No changed .md/.mdx content pages - nothing to check.');
			return;
		}
		const resolved = resolveRoutes(files, sitemap);
		routes = resolved.routes;
		if (resolved.unmapped.length) {
			console.warn('Could not map these changed files to a page (skipped):');
			for (const f of resolved.unmapped) console.warn(`  - ${f}`);
		}
		if (routes.length === 0) {
			console.log('No changed files mapped to a published page - nothing to check.');
			return;
		}
		console.log(`Checking links on ${routes.length} changed page(s):`);
		for (const r of routes) console.log(`  - ${r}`);
	}

	const urls = routes.map((r) => `${PREVIEW_URL}${r}/`);
	const skipRegexes = [...DEFAULT_SKIP, ...loadExtraSkips()].map((s) => new RegExp(s));

	// Docusaurus emits canonical / alternate <link> tags using the absolute
	// production siteUrl. For a page built in THIS repo those resolve to the
	// live site, where a not-yet-deployed new page 404s - a false positive. An
	// absolute self-link whose path is in the local sitemap is a real page (the
	// build already failed on broken internal links via onBrokenLinks: 'throw'),
	// so skip it. Self-links to paths absent from the sitemap still get checked.
	const linksToSkip = async (url) => {
		if (skipRegexes.some((re) => re.test(url))) return true;
		if (siteOrigin) {
			try {
				const u = new URL(url);
				if (u.origin === siteOrigin && sitemap.has(u.pathname.replace(/\/$/, ''))) return true;
			} catch {
				// not a parseable absolute URL; fall through
			}
		}
		return false;
	};

	const checker = new LinkChecker();
	const result = await checker.check({
		path: urls,
		recurse: false,
		concurrency: 25,
		timeout: 20000,
		retry: true,
		retryErrors: true,
		retryErrorsCount: 3,
		linksToSkip
	});

	const broken = result.links.filter((l) => l.state === 'BROKEN');
	const checked = result.links.filter((l) => l.state !== 'SKIPPED').length;
	console.log(`\nChecked ${checked} link(s) across ${routes.length} page(s).`);

	if (broken.length === 0) {
		console.log('No dead links found.');
		return;
	}

	console.error(`\n${broken.length} dead link(s) found:\n`);
	const byParent = new Map();
	for (const link of broken) {
		const parent = link.parent || '(unknown page)';
		if (!byParent.has(parent)) byParent.set(parent, []);
		byParent.get(parent).push(link);
	}
	for (const [parent, links] of byParent) {
		console.error(`On ${parent.replace(PREVIEW_URL, '')}:`);
		for (const link of links) console.error(`  [${link.status || 'ERR'}] ${link.url}`);
		console.error('');
	}
	process.exit(1);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
