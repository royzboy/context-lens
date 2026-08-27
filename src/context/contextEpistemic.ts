import {
    ContextEpistemicQuality,
    ContextSnapshot
} from './types';

import {
    aggregateFindingStatus
} from './statusAggregation';

export function evaluateContextEpistemicQuality(
    snapshot: ContextSnapshot
): ContextEpistemicQuality {
    const facts = snapshot.facts;

    if (facts.length === 0) {
        const findings = [
            {
                id: 'uncertain-context',
                label: 'Uncertain Context',
                status: 'healthy' as const,
                reason: 'No context facts with explicit epistemic uncertainty were detected.',
                source: 'Context Lens Context Model'
            }
        ];

        return {
            overallStatus: aggregateFindingStatus(findings),
            findings
        };
    }

    const hasUncertainFact = facts.some(
        fact =>
            fact.status === 'unknown' ||
            fact.confidence === 'low'
    );

    const findings = [
        {
            id: 'uncertain-context',
            label: 'Uncertain Context',
            status: hasUncertainFact ? 'warning' as const : 'healthy' as const,
            reason: hasUncertainFact
                ? 'One or more context facts have an unknown status or low confidence.'
                : 'No context facts with explicit epistemic uncertainty were detected.',
            source: 'Context Lens Context Model'
        }
    ];

    return {
        overallStatus: aggregateFindingStatus(findings),
        findings
    };
}