import {
    ContextFinding,
    FindingStatus
} from './types';

export function aggregateFindingStatus(
    findings: ContextFinding[]
): FindingStatus {
    if (findings.some(finding => finding.status === 'problem')) {
        return 'problem';
    }

    if (findings.some(finding => finding.status === 'warning')) {
        return 'warning';
    }

    if (findings.some(finding => finding.status === 'unknown')) {
        return 'unknown';
    }

    return 'healthy';
}