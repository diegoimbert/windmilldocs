import { internalAppsUseCase } from './internal-apps';
import { workflowAutomationUseCase } from './workflows';
import { dataPipelinesUseCase } from './data-pipelines';
import { aiAgentsUseCase } from './ai-agents';
import { scheduledTasksUseCase } from './scheduled-tasks';
import { scriptsUseCase } from './scripts';
import { windowsAutomationUseCase } from './windows-automation';

export const useCases = [
	scriptsUseCase,
	internalAppsUseCase,
	workflowAutomationUseCase,
	dataPipelinesUseCase,
	aiAgentsUseCase,
	scheduledTasksUseCase,
	windowsAutomationUseCase,
];
