import {
    HealthFinding,
    HealthStatus,
    HygieneFinding,
    HygieneStatus
} from './types';

type StatusFinding =
    | HealthFinding
    | HygieneFinding;

type FindingStatus =
    | HealthStatus
    | HygieneStatus;

export function aggregateFindingStatus(
    findings: StatusFinding[]
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