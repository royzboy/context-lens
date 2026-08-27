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
    workspaceName?: string;
    workspacePath?: string;
    facts: ContextFact[];
    projectState?: ProjectState;
    observedAt: number;
}

export interface OpenFile {
    path: string;
    isActive: boolean;
    isDirty: boolean;
}

export interface ProjectState {
    openFiles: OpenFile[];
}


export interface ContextState {
    workspaceName: string;
    workspacePath: string;
    activeFile?: string;
    projectState: ProjectState;
    facts: ContextFact[];
    health: ContextHealth;
}

export type FindingStatus =
    | 'healthy'
    | 'warning'
    | 'problem'
    | 'unknown';

export interface ContextFinding {
    id: string;
    label: string;
    status: FindingStatus;
    reason: string;
    source?: string;
}

export interface ContextHealth {
    overallStatus: FindingStatus;
    findings: ContextFinding[];
}

export interface ContextHygiene {
    overallStatus: FindingStatus;
    findings: ContextFinding[];
}

export interface ContextEpistemicQuality {
    overallStatus: FindingStatus;
    findings: ContextFinding[];
}