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

export interface ContextSnapshot {
    workspaceName: string;
    workspacePath: string;
    facts: ContextFact[];
    projectState: ProjectState;
    observedAt: number;
}

export type HealthStatus =
    | 'healthy'
    | 'warning'
    | 'problem'
    | 'unknown';


export interface HealthFinding {
    id: string;
    label: string;
    status: HealthStatus;
    reason: string;
    source?: string;
}


export interface ContextHealth {
    overallStatus: HealthStatus;
    findings: HealthFinding[];
}

export interface ProjectState {
    openFiles: string[];
}


export interface ContextState {
    workspaceName: string;
    workspacePath: string;
    activeFile?: string;
    projectState: ProjectState;
    facts: ContextFact[];
    health: ContextHealth;
}