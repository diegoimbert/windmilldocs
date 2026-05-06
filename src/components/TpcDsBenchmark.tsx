import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useColorMode } from '@docusaurus/theme-common';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// AWS on-demand pricing (us-east-1) as of April 2026
const AWS_PRICING: Record<string, number> = {
	'm6i.4xlarge': 0.768,
	'm6a.8xlarge': 1.3824,
	'm6a.16xlarge': 2.7648,
	'r6a.8xlarge': 1.8144
};

// Snowflake credits per hour by warehouse size
const SNOWFLAKE_CREDITS_PER_HOUR: Record<string, number> = {
	'X-Small': 1,
	'Small': 2,
	'Medium': 4,
	'Large': 8,
	'X-Large': 16,
	'2X-Large': 32
};

// Snowflake Standard tier price per credit
const SNOWFLAKE_CREDIT_PRICE = 2.0;

// Stage colors
const STAGE_COLORS: Record<string, string> = {
	ingest: 'rgba(59, 130, 246, 0.85)',      // blue
	validate: 'rgba(16, 185, 129, 0.85)',    // green
	denormalize: 'rgba(245, 158, 11, 0.85)', // amber
	aggregate: 'rgba(139, 92, 246, 0.85)',   // purple
	query: 'rgba(236, 72, 153, 0.85)',       // pink
	queries: 'rgba(236, 72, 153, 0.85)',     // pink (Snowflake uses 'queries')
	verify: 'rgba(107, 114, 128, 0.7)',      // gray
	unknown: 'rgba(107, 114, 128, 0.7)',     // gray
	overhead: 'rgba(156, 163, 175, 0.5)'     // light gray
};

const STAGE_LABELS: Record<string, string> = {
	ingest: 'Ingest',
	validate: 'Validate',
	denormalize: 'Denormalize',
	aggregate: 'Aggregate',
	query: 'Query',
	queries: 'Query',
	verify: 'Verify',
	unknown: 'Verify',
	overhead: 'Overhead'
};

// Stage order for consistent display
const STAGE_ORDER = ['ingest', 'validate', 'denormalize', 'aggregate', 'query', 'queries', 'verify', 'unknown', 'overhead'];

export interface StageTiming {
	stage: string;
	wallClockSeconds: number;
}

export interface BenchmarkConfig {
	label: string;
	platform: 'windmill' | 'snowflake' | 'local';
	// For Windmill: instance count and type
	instanceCount?: number;
	instanceType?: string;
	// For Snowflake: warehouse size
	warehouseSize?: string;
	// Total wall clock time in seconds
	totalTimeSeconds: number;
	// Stage breakdown (optional, for stacked chart)
	stages?: StageTiming[];
}

interface TpcDsBenchmarkProps {
	title?: string;
	description?: string;
	configs: BenchmarkConfig[];
	showCostTable?: boolean;
	datasetSize?: string;
}

function formatTime(seconds: number): string {
	if (seconds < 60) {
		return `${seconds.toFixed(1)}s`;
	} else if (seconds < 3600) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.round(seconds % 60);
		return `${mins}m ${secs}s`;
	} else {
		const hours = Math.floor(seconds / 3600);
		const mins = Math.round((seconds % 3600) / 60);
		return `${hours}h ${mins}m`;
	}
}

function calculateCost(config: BenchmarkConfig): number {
	const hours = config.totalTimeSeconds / 3600;

	if (config.platform === 'snowflake' && config.warehouseSize) {
		const credits = SNOWFLAKE_CREDITS_PER_HOUR[config.warehouseSize] || 0;
		return hours * credits * SNOWFLAKE_CREDIT_PRICE;
	} else if (config.platform === 'windmill' && config.instanceType && config.instanceCount) {
		const pricePerHour = AWS_PRICING[config.instanceType] || 0;
		return hours * pricePerHour * config.instanceCount;
	}
	return 0;
}

export default function TpcDsBenchmark({
	title = 'TPC-DS Benchmark Results',
	description,
	configs,
	showCostTable = true,
	datasetSize
}: TpcDsBenchmarkProps) {
	const { colorMode } = useColorMode();
	const textColor = colorMode === 'dark' ? '#e5e7eb' : '#374151';
	const gridColor = colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

	const labels = configs.map((c) => c.label);
	const hasStages = configs.some(c => c.stages && c.stages.length > 0);
	const maxTime = Math.max(...configs.map(c => c.totalTimeSeconds));

	// Build datasets - either stacked by stage or single bar
	let datasets: any[];

	if (hasStages) {
		// Get all unique stages across all configs
		const allStages = new Set<string>();
		configs.forEach(c => c.stages?.forEach(s => allStages.add(s.stage)));
		// Always include overhead bucket so totals match the wall-clock figure
		allStages.add('overhead');

		// Sort stages by predefined order
		const sortedStages = Array.from(allStages).sort((a, b) => {
			const aIdx = STAGE_ORDER.indexOf(a);
			const bIdx = STAGE_ORDER.indexOf(b);
			return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
		});

		datasets = sortedStages.map(stage => ({
			label: STAGE_LABELS[stage] || stage,
			data: configs.map(c => {
				if (stage === 'overhead') {
					const stageSum = (c.stages || []).reduce((acc, s) => acc + s.wallClockSeconds, 0);
					return Math.max(0, c.totalTimeSeconds - stageSum);
				}
				const stageTiming = c.stages?.find(s => s.stage === stage);
				return stageTiming?.wallClockSeconds || 0;
			}),
			backgroundColor: STAGE_COLORS[stage] || 'rgba(107, 114, 128, 0.5)',
			borderColor: 'rgba(0,0,0,0)',
			borderWidth: 0
		}));
	} else {
		// Fallback to single bar per config
		datasets = [{
			label: 'Total Time',
			data: configs.map(c => c.totalTimeSeconds),
			backgroundColor: configs.map(c => {
				if (c.platform === 'windmill') return 'rgba(59, 130, 246, 0.85)';
				if (c.platform === 'local') return 'rgba(239, 68, 68, 0.85)'; // red for local/Pandas
				return 'rgba(41, 182, 246, 0.85)'; // snowflake
			}),
			borderColor: 'rgba(0,0,0,0)',
			borderWidth: 0
		}];
	}

	const options = {
		indexAxis: 'y' as const,
		scales: {
			x: {
				stacked: hasStages,
				max: Math.ceil(maxTime * 1.1),
				title: {
					display: true,
					text: 'Duration (seconds)',
					color: textColor
				},
				ticks: { color: textColor },
				grid: { color: gridColor }
			},
			y: {
				stacked: hasStages,
				ticks: { color: textColor },
				grid: { color: gridColor }
			}
		},
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: hasStages,
				position: 'bottom' as const,
				labels: {
					color: textColor,
					usePointStyle: true,
					pointStyle: 'rect',
					padding: 15
				}
			},
			title: {
				display: false
			},
			tooltip: {
				callbacks: {
					label: (ctx: any) => {
						if (hasStages) {
							return `${ctx.dataset.label}: ${formatTime(ctx.raw)}`;
						}
						const config = configs[ctx.dataIndex];
						const cost = calculateCost(config);
						return [
							`Time: ${formatTime(ctx.raw)}`,
							`Cost: $${cost.toFixed(2)}`
						];
					}
				}
			}
		},
		animation: {
			duration: 0
		}
	};

	return (
		<div className="tpcds-benchmark">
			{title && <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>}
			{description && <p style={{ marginBottom: '1rem', color: textColor }}>{description}</p>}

			<div style={{ position: 'relative', height: `${Math.max(220, configs.length * 50 + 60)}px`, width: '100%', marginBottom: '1.5rem' }}>
				<Bar key={colorMode} options={options} data={{ labels, datasets }} />
			</div>

			{showCostTable && (
				<div style={{ overflowX: 'auto' }}>
					<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
						<thead>
							<tr style={{ borderBottom: `1px solid ${gridColor}` }}>
								<th style={{ textAlign: 'left', padding: '0.5rem', color: textColor }}>Configuration</th>
								<th style={{ textAlign: 'right', padding: '0.5rem', color: textColor }}>Time</th>
								<th style={{ textAlign: 'right', padding: '0.5rem', color: textColor }}>Cost</th>
								<th style={{ textAlign: 'right', padding: '0.5rem', color: textColor }}>$/hour</th>
							</tr>
						</thead>
						<tbody>
							{configs.map((config, idx) => {
								const cost = calculateCost(config);
								const hourlyRate = config.platform === 'snowflake'
									? (SNOWFLAKE_CREDITS_PER_HOUR[config.warehouseSize || ''] || 0) * SNOWFLAKE_CREDIT_PRICE
									: config.platform === 'local'
										? 0
										: (AWS_PRICING[config.instanceType || ''] || 0) * (config.instanceCount || 1);
								return (
									<tr key={idx} style={{ borderBottom: `1px solid ${gridColor}` }}>
										<td style={{ padding: '0.5rem', color: textColor }}>
											{config.label}
										</td>
										<td style={{ textAlign: 'right', padding: '0.5rem', color: textColor, fontFamily: 'monospace' }}>
											{formatTime(config.totalTimeSeconds)}
										</td>
										<td style={{ textAlign: 'right', padding: '0.5rem', color: textColor, fontFamily: 'monospace' }}>
											${cost.toFixed(2)}
										</td>
										<td style={{ textAlign: 'right', padding: '0.5rem', color: textColor, fontFamily: 'monospace' }}>
											${hourlyRate.toFixed(2)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

// Pre-configured benchmark data for different scale factors

export const SF10_CONFIGS: BenchmarkConfig[] = [
	{
		label: 'Airflow + Snowflake Small',
		platform: 'snowflake',
		warehouseSize: 'Small',
		totalTimeSeconds: 85.26,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 19.41 },
			{ stage: 'validate', wallClockSeconds: 5.91 },
			{ stage: 'denormalize', wallClockSeconds: 37.57 },
			{ stage: 'aggregate', wallClockSeconds: 7.74 },
			{ stage: 'queries', wallClockSeconds: 4.71 },
			{ stage: 'verify', wallClockSeconds: 2.32 }
		]
	},
	{
		label: 'Windmill 2× m6i.4xlarge',
		platform: 'windmill',
		instanceCount: 2,
		instanceType: 'm6i.4xlarge',
		totalTimeSeconds: 85.78,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 21.74 },
			{ stage: 'validate', wallClockSeconds: 10.24 },
			{ stage: 'denormalize', wallClockSeconds: 23.20 },
			{ stage: 'aggregate', wallClockSeconds: 12.44 },
			{ stage: 'query', wallClockSeconds: 17.77 }
		]
	},
	{
		label: 'Windmill 2× m6a.8xlarge',
		platform: 'windmill',
		instanceCount: 2,
		instanceType: 'm6a.8xlarge',
		totalTimeSeconds: 67.44,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 23.72 },
			{ stage: 'validate', wallClockSeconds: 6.04 },
			{ stage: 'denormalize', wallClockSeconds: 19.11 },
			{ stage: 'aggregate', wallClockSeconds: 6.84 },
			{ stage: 'query', wallClockSeconds: 10.87 }
		]
	}
];

export const SF100_CONFIGS: BenchmarkConfig[] = [
	{
		label: 'Airflow + Snowflake Small',
		platform: 'snowflake',
		warehouseSize: 'Small',
		totalTimeSeconds: 711.14,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 218.49 },
			{ stage: 'validate', wallClockSeconds: 7.43 },
			{ stage: 'denormalize', wallClockSeconds: 394.44 },
			{ stage: 'aggregate', wallClockSeconds: 69.38 },
			{ stage: 'queries', wallClockSeconds: 11.88 },
			{ stage: 'verify', wallClockSeconds: 3.46 }
		]
	},
	{
		label: 'Airflow + Snowflake Large',
		platform: 'snowflake',
		warehouseSize: 'Large',
		totalTimeSeconds: 194.05,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 39.71 },
			{ stage: 'validate', wallClockSeconds: 6.15 },
			{ stage: 'denormalize', wallClockSeconds: 107.65 },
			{ stage: 'aggregate', wallClockSeconds: 23.08 },
			{ stage: 'queries', wallClockSeconds: 6.99 },
			{ stage: 'verify', wallClockSeconds: 2.61 }
		]
	},
	{
		label: 'Windmill 1× m6a.8xlarge',
		platform: 'windmill',
		instanceCount: 1,
		instanceType: 'm6a.8xlarge',
		totalTimeSeconds: 651.98,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 141.64 },
			{ stage: 'validate', wallClockSeconds: 61.00 },
			{ stage: 'denormalize', wallClockSeconds: 159.21 },
			{ stage: 'aggregate', wallClockSeconds: 147.90 },
			{ stage: 'query', wallClockSeconds: 141.24 }
		]
	},
	{
		label: 'Windmill 1× m6a.16xlarge',
		platform: 'windmill',
		instanceCount: 1,
		instanceType: 'm6a.16xlarge',
		totalTimeSeconds: 391.33,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 96.15 },
			{ stage: 'validate', wallClockSeconds: 30.19 },
			{ stage: 'denormalize', wallClockSeconds: 114.33 },
			{ stage: 'aggregate', wallClockSeconds: 65.09 },
			{ stage: 'query', wallClockSeconds: 84.57 }
		]
	},
	{
		label: 'Windmill 3× m6a.8xlarge',
		platform: 'windmill',
		instanceCount: 3,
		instanceType: 'm6a.8xlarge',
		totalTimeSeconds: 261.27,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 50.82 },
			{ stage: 'validate', wallClockSeconds: 23.27 },
			{ stage: 'denormalize', wallClockSeconds: 79.45 },
			{ stage: 'aggregate', wallClockSeconds: 56.03 },
			{ stage: 'query', wallClockSeconds: 51.30 }
		]
	},
	{
		label: 'Windmill 3× m6a.16xlarge',
		platform: 'windmill',
		instanceCount: 3,
		instanceType: 'm6a.16xlarge',
		totalTimeSeconds: 157.11,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 32.03 },
			{ stage: 'validate', wallClockSeconds: 11.51 },
			{ stage: 'denormalize', wallClockSeconds: 53.60 },
			{ stage: 'aggregate', wallClockSeconds: 22.50 },
			{ stage: 'query', wallClockSeconds: 37.09 }
		]
	}
];

export const SF1000_CONFIGS: BenchmarkConfig[] = [
	{
		label: 'Airflow + Snowflake Large',
		platform: 'snowflake',
		warehouseSize: 'Large',
		totalTimeSeconds: 1670.66,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 326.74 },
			{ stage: 'validate', wallClockSeconds: 12.53 },
			{ stage: 'denormalize', wallClockSeconds: 1168.55 },
			{ stage: 'aggregate', wallClockSeconds: 134.66 },
			{ stage: 'queries', wallClockSeconds: 19.97 },
			{ stage: 'verify', wallClockSeconds: 2.86 }
		]
	},
	{
		label: 'Windmill 3× r6a.8xlarge',
		platform: 'windmill',
		instanceCount: 3,
		instanceType: 'r6a.8xlarge',
		totalTimeSeconds: 4198.39,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 395.66 },
			{ stage: 'validate', wallClockSeconds: 252.32 },
			{ stage: 'denormalize', wallClockSeconds: 1012.17 },
			{ stage: 'aggregate', wallClockSeconds: 874.26 },
			{ stage: 'query', wallClockSeconds: 1663.36 }
		]
	}
];

// Airflow + Pandas comparison configs (SF10 only - Pandas cannot scale beyond this)
export const AIRFLOW_PANDAS_SF10_CONFIGS: BenchmarkConfig[] = [
	{
		label: 'Airflow + Pandas (64 GB local)',
		platform: 'local',
		totalTimeSeconds: 2813.82,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 600 },
			{ stage: 'validate', wallClockSeconds: 168 },
			{ stage: 'denormalize', wallClockSeconds: 323 },
			{ stage: 'aggregate', wallClockSeconds: 433 },
			{ stage: 'query', wallClockSeconds: 824 },
			{ stage: 'verify', wallClockSeconds: 131 }
		]
	},
	{
		label: 'Windmill 2× m6a.8xlarge',
		platform: 'windmill',
		instanceCount: 2,
		instanceType: 'm6a.8xlarge',
		totalTimeSeconds: 67.44,
		stages: [
			{ stage: 'ingest', wallClockSeconds: 23.72 },
			{ stage: 'validate', wallClockSeconds: 6.04 },
			{ stage: 'denormalize', wallClockSeconds: 19.11 },
			{ stage: 'aggregate', wallClockSeconds: 6.84 },
			{ stage: 'query', wallClockSeconds: 10.87 }
		]
	}
];
