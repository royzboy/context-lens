import {
    ContextHygiene,
    ContextSnapshot,
    ContextFinding
} from './types';
import { aggregateFindingStatus } from './statusAggregation';

export function evaluateContextHygiene(
    snapshot: ContextSnapshot
): ContextHygiene {
    const findings: ContextFinding[] = [];

    const openFiles =
        snapshot.projectState?.openFiles ?? [];

    if (openFiles.length === 0) {
        findings.push({
            id: 'duplicate-open-files',
            label: 'Duplicate Open Files',
            status: 'unknown',
            reason: 'No open project files are currently available to evaluate for duplication.',
            source: 'Context Lens Workspace Observer'
        });
    } else {
        const uniqueFilePaths = new Set(
            openFiles.map(file => file.path)
        );

        const hasDuplicates =
            uniqueFilePaths.size < openFiles.length;

        findings.push({
            id: 'duplicate-open-files',
            label: 'Duplicate Open Files',
            status: hasDuplicates ? 'warning' : 'healthy',
            reason: hasDuplicates
                ? 'One or more open files appear more than once in the observed project state.'
                : 'No duplicate open files were detected in the observed project state.',
            source: 'Context Lens Workspace Observer'
        });
    }

    return {
        overallStatus: aggregateFindingStatus(findings),
        findings
    };
}