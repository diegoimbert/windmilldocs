import React, { useRef } from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SiPowershell, SiMicrosoftsqlserver, SiDotnet, SiMicrosoftazure, SiMicrosoftteams } from 'react-icons/si';

const fadeIn = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true },
	transition: { duration: 0.5 },
};

function ScriptsIllustration() {
	return (
		<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="ucc_scripts_halo" cx="50%" cy="55%" r="55%">
					<stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
					<stop offset="55%" stopColor="#1E40AF" stopOpacity="0.2" />
					<stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
				</radialGradient>
			</defs>
			<rect width="400" height="225" fill="#0B1220" />
			<circle cx="200" cy="112" r="180" fill="url(#ucc_scripts_halo)" />

			<g transform="translate(40 30)">
				<rect width="320" height="166" rx="10" fill="#0F172A" stroke="#1E40AF" strokeWidth="1" />
				<rect width="320" height="22" rx="10" fill="#1E293B" />
				<rect y="12" width="320" height="10" fill="#1E293B" />
				<circle cx="14" cy="11" r="3.5" fill="#475569" />
				<circle cx="26" cy="11" r="3.5" fill="#475569" />
				<circle cx="38" cy="11" r="3.5" fill="#475569" />
				<text x="160" y="15" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fill="#94A3B8">
					get_failed_payments.py
				</text>

				<g fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="11" xmlSpace="preserve">
					<text x="16" y="50" fill="#94A3B8">
						<tspan fill="#60A5FA">def </tspan>
						<tspan fill="#DBEAFE">get_failed_payments</tspan>
						<tspan>(</tspan>
					</text>
					<text x="16" y="68" fill="#94A3B8">
						<tspan>{`    `}</tspan>
						<tspan fill="#FCD34D">since</tspan>
						<tspan>: </tspan>
						<tspan fill="#A78BFA">date</tspan>
						<tspan>,</tspan>
					</text>
					<text x="16" y="86" fill="#94A3B8">
						<tspan>{`    `}</tspan>
						<tspan fill="#FCD34D">limit</tspan>
						<tspan>: </tspan>
						<tspan fill="#A78BFA">int</tspan>
						<tspan> = </tspan>
						<tspan fill="#F472B6">100</tspan>
						<tspan>,</tspan>
					</text>
					<text x="16" y="104" fill="#94A3B8">):</text>
					<text x="16" y="126" fill="#94A3B8">
						<tspan>{`    `}</tspan>
						<tspan fill="#60A5FA">return </tspan>
						<tspan fill="#DBEAFE">db</tspan>
						<tspan>.</tspan>
						<tspan fill="#DBEAFE">query</tspan>
						<tspan>(...)</tspan>
					</text>
				</g>
			</g>
		</svg>
	);
}

function WorkflowsIllustration() {
	const NW = 110;
	const NH = 20;
	const FS = 8;
	const CHAR_W = 4.1;
	const ICON = 11;
	const GAP = 4;
	const nodes = [
		{ x: 200, y: 24, label: 'Trigger', kind: 'trigger' },
		{ x: 200, y: 58, label: 'Input', kind: 'io' },
		{ x: 200, y: 92, label: 'Provision AWS', kind: 'ts' },
		{ x: 130, y: 126, label: 'Permissions', kind: 'py' },
		{ x: 270, y: 126, label: 'Configure DB', kind: 'py' },
		{ x: 200, y: 160, label: 'Collect results', kind: 'merge' },
		{ x: 200, y: 194, label: 'Result', kind: 'result' },
	];
	const edges = [[0,1],[1,2],[2,3],[2,4],[3,5],[4,5],[5,6]];

	const path = (a, b) => {
		const sy = a.y + NH / 2;
		const dy = b.y - NH / 2;
		if (a.x === b.x) return `M${a.x},${sy} L${b.x},${dy}`;
		const midY = (sy + dy) / 2;
		return `M${a.x},${sy} C${a.x},${midY} ${b.x},${midY} ${b.x},${dy}`;
	};

	return (
		<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="ucc_wf_halo" cx="50%" cy="55%" r="55%">
					<stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
					<stop offset="55%" stopColor="#1E40AF" stopOpacity="0.2" />
					<stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="ucc_wf_pyA" x1="12.96%" y1="12.07%" x2="79.64%" y2="78.8%">
					<stop offset="0%" stopColor="#387EB8" />
					<stop offset="100%" stopColor="#366994" />
				</linearGradient>
				<linearGradient id="ucc_wf_pyB" x1="19.13%" y1="20.58%" x2="90.43%" y2="88.01%">
					<stop offset="0%" stopColor="#FFE052" />
					<stop offset="100%" stopColor="#FFC331" />
				</linearGradient>
				<symbol id="ucc_wf_python" viewBox="0 0 256 255">
					<path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072ZM92.802 19.66a11.12 11.12 0 1 1 0 22.24 11.12 11.12 0 0 1 0-22.24Z" fill="url(#ucc_wf_pyA)" />
					<path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897Zm34.114-19.586a11.12 11.12 0 1 1 0-22.24 11.12 11.12 0 0 1 0 22.24Z" fill="url(#ucc_wf_pyB)" />
				</symbol>
			</defs>
			<rect width="400" height="225" fill="#0B1220" />
			<circle cx="200" cy="112" r="180" fill="url(#ucc_wf_halo)" />

			<g fill="none" stroke="#3B82F6" strokeOpacity="0.45" strokeWidth="1.2">
				{edges.map(([i, j]) => (
					<path key={`${i}-${j}`} d={path(nodes[i], nodes[j])} />
				))}
			</g>

			{nodes.map((n, i) => {
				const isTrigger = n.kind === 'trigger';
				const isMerge = n.kind === 'merge';
				const isResult = n.kind === 'result';
				const isIO = n.kind === 'io';
				const isTs = n.kind === 'ts';
				const isPy = n.kind === 'py';
				const fill = isTrigger ? '#DBEAFE' : isMerge ? '#EDE9FE' : isResult ? '#F3F4F6' : isIO ? '#F9FAFB' : '#FFFFFF';
				const stroke = isTrigger ? '#93C5FD' : isMerge ? '#C4B5FD' : '#E5E7EB';
				const hasIcon = isTrigger || isTs || isPy;
				const labelW = n.label.length * CHAR_W;
				const groupW = hasIcon ? ICON + GAP + labelW : labelW;
				const groupX = (NW - groupW) / 2;
				const iconX = groupX;
				const textX = hasIcon ? groupX + ICON + GAP : NW / 2;
				const iconY = (NH - ICON) / 2;
				return (
					<g key={i} transform={`translate(${n.x - NW / 2} ${n.y - NH / 2})`}>
						<rect width={NW} height={NH} rx="6" fill={fill} stroke={stroke} strokeWidth="1" />
						{isTrigger && (
							<path transform={`translate(${iconX + 3} ${iconY})`} d="M6 0 L1 7 L5 7 L3 12 L9 5 L5 5 Z" fill="#3B82F6" />
						)}
						{isTs && (
							<g transform={`translate(${iconX} ${iconY})`}>
								<rect width={ICON} height={ICON} rx="2" fill="#3178C6" />
								<text x={ICON / 2} y={ICON - 3} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="6" fontWeight="800" fill="#FFFFFF">TS</text>
							</g>
						)}
						{isPy && <use href="#ucc_wf_python" x={iconX} y={iconY} width={ICON} height={ICON} />}
						<text
							x={textX}
							y={NH / 2 + FS / 3}
							textAnchor={hasIcon ? 'start' : 'middle'}
							fontFamily="ui-sans-serif, system-ui"
							fontSize={FS}
							fontWeight="600"
							fill="#1F2937"
						>
							{n.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
}

function InternalAppsIllustration() {
	return (
		<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="ucc_apps_halo" cx="50%" cy="55%" r="55%">
					<stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
					<stop offset="55%" stopColor="#1E40AF" stopOpacity="0.2" />
					<stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
				</radialGradient>
			</defs>
			<rect width="400" height="225" fill="#0B1220" />
			<circle cx="200" cy="112" r="180" fill="url(#ucc_apps_halo)" />

			<g transform="translate(40 22)">
				<rect width="320" height="186" rx="10" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
				<rect width="320" height="20" rx="10" fill="#F9FAFB" />
				<rect y="10" width="320" height="10" fill="#F9FAFB" />
				<line x1="0" y1="20" x2="320" y2="20" stroke="#E5E7EB" strokeWidth="1" />
				<circle cx="14" cy="10" r="3" fill="#E5E7EB" />
				<circle cx="26" cy="10" r="3" fill="#E5E7EB" />
				<circle cx="38" cy="10" r="3" fill="#E5E7EB" />
				<text x="160" y="13" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fill="#9CA3AF">app.windmill.dev/apps/billing</text>

				{[
					{ label: 'MRR',    value: '$24.8k' },
					{ label: 'Active', value: '1,284' },
					{ label: 'Churn',  value: '2.1 %' },
				].map((kpi, i) => (
					<g key={kpi.label} transform={`translate(${12 + i * 100} 30)`}>
						<rect width="96" height="38" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
						<text x="10" y="15" fontFamily="ui-sans-serif, system-ui" fontSize="7" fontWeight="500" fill="#6B7280">{kpi.label}</text>
						<text x="10" y="30" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="600" fill="#111827">{kpi.value}</text>
					</g>
				))}

				<g transform="translate(12 78)">
					<rect width="178" height="78" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
					<text x="10" y="14" fontFamily="ui-sans-serif, system-ui" fontSize="7" fontWeight="500" fill="#6B7280">Revenue · 30d</text>
					{[18, 30, 22, 40, 28, 46, 36, 52, 44, 60, 48, 64].map((h, i) => (
						<rect key={i} x={12 + i * 13} y={68 - h} width="9" height={h} rx="1.5" fill="#3B82F6" />
					))}
				</g>

				<g transform="translate(198 78)">
					<rect width="110" height="78" rx="6" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
					<text x="10" y="14" fontFamily="ui-sans-serif, system-ui" fontSize="7" fontWeight="500" fill="#6B7280">Latest invoices</text>
					{[0, 1, 2, 3].map((i) => (
						<g key={i} transform={`translate(10 ${22 + i * 13})`}>
							<rect width="44" height="6" rx="1" fill="#E5E7EB" />
							<rect x="56" width="20" height="6" rx="1" fill="#F3F4F6" />
							<circle cx="86" cy="3" r="3" fill={i === 0 ? '#F59E0B' : '#10B981'} />
						</g>
					))}
				</g>
			</g>
		</svg>
	);
}

const PATH_OPENAI = "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";
const PATH_ANTHROPIC = "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z";
const PATH_GEMINI = "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81";
const PATH_MISTRAL = "M17.143 3.429v3.428h-3.429v3.429h-3.428V6.857H6.857V3.43H3.43v13.714H0v3.428h10.286v-3.428H6.857v-3.429h3.429v3.429h3.429v-3.429h3.428v3.429h-3.428v3.428H24v-3.428h-3.43V3.429z";

function AiAgentsIllustration() {
	const providers = [
		{ key: 'openai',    path: PATH_OPENAI },
		{ key: 'anthropic', path: PATH_ANTHROPIC },
		{ key: 'gemini',    path: PATH_GEMINI },
		{ key: 'mistral',   path: PATH_MISTRAL },
	];
	const LOGO = 32;
	const GAP = 36;
	const totalW = providers.length * LOGO + (providers.length - 1) * GAP;
	const startX = (400 - totalW) / 2;
	const LOGO_Y = 64;
	return (
		<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="ucc_ai_halo" cx="50%" cy="55%" r="55%">
					<stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
					<stop offset="55%" stopColor="#1E40AF" stopOpacity="0.2" />
					<stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
				</radialGradient>
			</defs>
			<rect width="400" height="225" fill="#0B1220" />
			<circle cx="200" cy="112" r="180" fill="url(#ucc_ai_halo)" />

			{providers.map((p, i) => (
				<svg
					key={p.key}
					x={startX + i * (LOGO + GAP)}
					y={LOGO_Y}
					width={LOGO}
					height={LOGO}
					viewBox="0 0 24 24"
				>
					<path d={p.path} fill="#FFFFFF" />
				</svg>
			))}

			<text x="200" y="146" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="11" fontWeight="500" fill="#94A3B8">
				&amp;
			</text>
			<text x="200" y="170" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="18" fontWeight="700" fill="#FFFFFF">
				self-hosted
				<tspan fontWeight="500" fill="#CBD5E1"> models</tspan>
			</text>
		</svg>
	);
}

function ScheduledTasksIllustration() {
	const CX = 200;
	const CY = 112;
	const R = 70;
	return (
		<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="ucc_sc_halo" cx="50%" cy="55%" r="55%">
					<stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
					<stop offset="55%" stopColor="#1E40AF" stopOpacity="0.2" />
					<stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
				</radialGradient>
			</defs>
			<rect width="400" height="225" fill="#0B1220" />
			<circle cx={CX} cy={CY} r="180" fill="url(#ucc_sc_halo)" />

			<circle cx={CX} cy={CY} r={R} fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
			{Array.from({ length: 12 }).map((_, i) => {
				const a = (i * 30 - 90) * Math.PI / 180;
				const r1 = i % 3 === 0 ? R - 9 : R - 6;
				const w = i % 3 === 0 ? 1.6 : 1;
				return (
					<line
						key={i}
						x1={CX + r1 * Math.cos(a)}
						y1={CY + r1 * Math.sin(a)}
						x2={CX + R * Math.cos(a)}
						y2={CY + R * Math.sin(a)}
						stroke="#9CA3AF"
						strokeWidth={w}
						strokeLinecap="round"
					/>
				);
			})}
			<line
				x1={CX}
				y1={CY}
				x2={CX + (R - 28) * Math.cos((40 - 90) * Math.PI / 180)}
				y2={CY + (R - 28) * Math.sin((40 - 90) * Math.PI / 180)}
				stroke="#1F2937"
				strokeWidth="2.4"
				strokeLinecap="round"
			/>
			<line
				x1={CX}
				y1={CY}
				x2={CX + (R - 14) * Math.cos((130 - 90) * Math.PI / 180)}
				y2={CY + (R - 14) * Math.sin((130 - 90) * Math.PI / 180)}
				stroke="#3B82F6"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<circle cx={CX} cy={CY} r="3.5" fill="#3B82F6" />
		</svg>
	);
}

function WindowsAutomationIllustration() {
	// react-icons render as nested <svg> elements; use them directly with x/y/width/height
	const logos = [
		{ key: 'powershell', Icon: SiPowershell },
		{ key: 'mssql',      Icon: SiMicrosoftsqlserver },
		{ key: 'dotnet',     Icon: SiDotnet },
		{ key: 'azure',      Icon: SiMicrosoftazure },
		{ key: 'teams',      Icon: SiMicrosoftteams },
	];
	const LOGO = 30;
	const GAP = 26;
	const totalW = logos.length * LOGO + (logos.length - 1) * GAP;
	const startX = (400 - totalW) / 2;
	const LOGO_Y = 64;
	return (
		<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="ucc_win_halo" cx="50%" cy="55%" r="55%">
					<stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
					<stop offset="55%" stopColor="#1E40AF" stopOpacity="0.2" />
					<stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
				</radialGradient>
			</defs>
			<rect width="400" height="225" fill="#0B1220" />
			<circle cx="200" cy="112" r="180" fill="url(#ucc_win_halo)" />

			{logos.map((l, i) => {
				const x = startX + i * (LOGO + GAP);
				return (
					<svg key={l.key} x={x} y={LOGO_Y} width={LOGO} height={LOGO}>
						<l.Icon size={LOGO} color="#FFFFFF" />
					</svg>
				);
			})}

			<text x="200" y="146" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="11" fontWeight="500" fill="#94A3B8">
				native on
			</text>
			<text x="200" y="170" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="18" fontWeight="700" fill="#FFFFFF">
				Windows
				<tspan fontWeight="500" fill="#CBD5E1"> servers</tspan>
			</text>
		</svg>
	);
}

function DataPipelinesIllustration() {
	const tiles = [
		{ src: '/third_party_logos/duckdb.svg',   label: 'DuckDB',   logoSize: 44 },
		{ src: '/third_party_logos/ducklake.svg', label: 'DuckLake', logoSize: 44 },
		{ src: '/third_party_logos/s3.svg',       label: 'S3',       logoSize: 38 },
	];
	const TILE = 76;
	const GAP = 22;
	const TOTAL = tiles.length * TILE + (tiles.length - 1) * GAP;
	const startX = (400 - TOTAL) / 2;
	const TILE_Y = 70;

	return (
		<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="ucc_dp_halo" cx="50%" cy="55%" r="55%">
					<stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
					<stop offset="55%" stopColor="#1E40AF" stopOpacity="0.2" />
					<stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
				</radialGradient>
			</defs>
			<rect width="400" height="225" fill="#0B1220" />
			<circle cx="200" cy="112" r="180" fill="url(#ucc_dp_halo)" />

			<line
				x1={startX + TILE / 2}
				y1={TILE_Y + TILE / 2}
				x2={startX + TOTAL - TILE / 2}
				y2={TILE_Y + TILE / 2}
				stroke="#3B82F6"
				strokeOpacity="0.35"
				strokeWidth="1.5"
				strokeDasharray="3 3"
			/>

			{tiles.map((t, i) => {
				const x = startX + i * (TILE + GAP);
				const cx = x + TILE / 2;
				const cy = TILE_Y + TILE / 2;
				return (
					<g key={t.label}>
						<rect x={x} y={TILE_Y} width={TILE} height={TILE} rx="14" fill="#0F172A" stroke="#1E40AF" strokeWidth="1" />
						<image
							href={t.src}
							x={cx - t.logoSize / 2}
							y={cy - t.logoSize / 2}
							width={t.logoSize}
							height={t.logoSize}
						/>
						<text
							x={cx}
							y={TILE_Y + TILE + 18}
							textAnchor="middle"
							fontFamily="ui-sans-serif, system-ui"
							fontSize="11"
							fontWeight="600"
							fill="#E5E7EB"
						>
							{t.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
}

const allUseCases = [
	{ label: 'Scripts', subtitle: 'Write scripts in TypeScript, Python, Go, Bash, SQL and trigger them from webhooks, schedules, queues or the auto-generated UI.', to: '/use-cases/scripts', illustration: <ScriptsIllustration /> },
	{ label: 'Internal apps', subtitle: 'Build production-grade internal apps with backend scripts, data tables and React, Vue or Svelte frontends.', to: '/use-cases/internal-apps', illustration: <InternalAppsIllustration /> },
	{ label: 'Data pipelines', subtitle: 'Orchestrate ETL jobs with parallel branches, DuckDB queries and connections to any database or S3 bucket.', to: '/use-cases/data-pipelines', illustration: <DataPipelinesIllustration /> },
	{ label: 'AI agents', subtitle: 'Build AI agents with tool-calling, DAG orchestration, sandboxes and direct access to your scripts and resources.', to: '/use-cases/ai-agents', illustration: <AiAgentsIllustration /> },
	{ label: 'Workflows', subtitle: 'Chain scripts into flows with approval steps, parallel branches, loops and conditional logic.', to: '/use-cases/workflows', illustration: <WorkflowsIllustration /> },
	{ label: 'Scheduled tasks', subtitle: 'Run cron jobs with a visual builder, execution history, error handlers, recovery handlers and alerting.', to: '/use-cases/scheduled-tasks', illustration: <ScheduledTasksIllustration /> },
	{ label: 'Windows automation', subtitle: 'Run PowerShell, MSSQL with Kerberos and C# natively on domain-joined Windows servers, no Docker required.', to: '/use-cases/windows-automation', illustration: <WindowsAutomationIllustration /> },
];

export default function UseCaseCarousel({ current, title, subtitle }) {
	const carouselRef = useRef(null);
	const useCases = allUseCases.filter((uc) => uc.to !== `/use-cases/${current}`);

	const scroll = (dir) => {
		if (!carouselRef.current) return;
		const card = carouselRef.current.querySelector('a');
		const w = card ? card.offsetWidth + 16 : 300;
		carouselRef.current.scrollBy({ left: dir * w, behavior: 'smooth' });
	};

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
			<motion.div {...fadeIn} className="mb-8">
				<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
					{title || 'More you can build on Windmill'}
				</h2>
				{subtitle && (
					<p className="text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>
				)}
			</motion.div>

			<div className="relative">
				<button
					onClick={() => scroll(-1)}
					className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden sm:flex"
					aria-label="Previous"
				>
					<ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300 rotate-180" />
				</button>
				<button
					onClick={() => scroll(1)}
					className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden sm:flex"
					aria-label="Next"
				>
					<ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
				</button>

				<div
					ref={carouselRef}
					className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-4 px-4"
					style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
				>
					{useCases.map((item) => (
						<Link
							key={item.label}
							to={item.to}
							className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all !no-underline group overflow-hidden snap-start flex-shrink-0 w-[340px] sm:w-[380px]"
						>
							<div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
								{item.illustration ? (
									<div className="w-full h-full group-hover:scale-105 transition-transform duration-300">
										{item.illustration}
									</div>
								) : (
									<img src={item.cover} alt={item.label} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
								)}
							</div>
							<div className="flex items-center gap-2 px-5 pt-4 pb-1">
								<span className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.label}</span>
								<ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto flex-shrink-0 group-hover:text-blue-500 transition-colors" />
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 px-5 pb-4 leading-relaxed">{item.subtitle}</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
