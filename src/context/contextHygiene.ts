import {
    ContextHygiene,
    ContextSnapshot,
    HygieneFinding
} from './types';
import { aggregateFindingStatus } from './statusAggregation';

export function evaluateContextHygiene(
    snapshot: ContextSnapshot
): ContextHygiene {
    const findings: HygieneFinding[] = [];

    const openFiles = snapshot.projectState.openFiles;

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

    const facts = snapshot.facts;

    if (facts.length === 0) {
        findings.push({
            id: 'uncertain-context',
            label: 'Uncertain Context',
            status: 'healthy',
            reason: 'No context facts with explicit epistemic uncertainty were detected.',
            source: 'Context Lens Context Model'
        });
    } else {
        const hasUncertainFact = facts.some(
            fact =>
                fact.status === 'unknown' ||
                fact.confidence === 'low'
        );

        findings.push({
            id: 'uncertain-context',
            label: 'Uncertain Context',
            status: hasUncertainFact ? 'warning' : 'healthy',
            reason: hasUncertainFact
                ? 'One or more context facts have an unknown status or low confidence.'
                : 'No context facts with explicit epistemic uncertainty were detected.',
            source: 'Context Lens Context Model'
        });
    }

    return {
        overallStatus: aggregateFindingStatus(findings),
        findings
    };
}