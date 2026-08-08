export type KnowledgeStatus =
	| 'observed'
	| 'inferred'
	| 'declared'
	| 'unknown';

export type Confidence =
	| 'high'
	| 'medium'
	| 'low';

export interface ContextFact {
	id: string;
	label: string;
	value: string;
	status: KnowledgeStatus;
	source?: string;
	confidence?: Confidence;
}

export interface ContextState {
	workspaceName: string;
	workspacePath: string;
	activeFile?: string;
	facts: ContextFact[];
}