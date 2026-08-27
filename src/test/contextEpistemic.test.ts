import * as assert from 'assert';

import {
    ContextSnapshot
} from '../context/types';

import {
    evaluateContextEpistemicQuality
} from '../context/contextEpistemic';


suite('Context Epistemic Quality Test Suite', () => {
    test('reports healthy when context facts have strong epistemic metadata', () => {
        const snapshot: ContextSnapshot = {
            facts: [
                {
                    id: 'user-message',
                    label: 'User Message',
                    value: 'Explain this architecture.',
                    status: 'observed',
                    source: 'Conversation Context',
                    confidence: 'high'
                }
            ],
            observedAt: Date.now()
        };

        const evaluation = evaluateContextEpistemicQuality(snapshot);

        const finding = evaluation.findings.find(
            finding => finding.id === 'uncertain-context'
        );

        assert.strictEqual(
            finding?.status,
            'healthy'
        );
    });

    test('reports warning when a context fact has low confidence', () => {
        const snapshot: ContextSnapshot = {
            facts: [
                {
                    id: 'project-intent',
                    label: 'Project Intent',
                    value: 'Build a context observability tool',
                    status: 'inferred',
                    source: 'Context Lens',
                    confidence: 'low'
                }
            ],
            observedAt: Date.now()
        };

        const evaluation = evaluateContextEpistemicQuality(snapshot);

        const finding = evaluation.findings.find(
            finding => finding.id === 'uncertain-context'
        );

        assert.strictEqual(
            finding?.status,
            'warning'
        );
    });

    test('reports warning when a context fact has unknown status', () => {
        const snapshot: ContextSnapshot = {
            facts: [
                {
                    id: 'unknown-context',
                    label: 'Unknown Context',
                    value: 'Unverified information',
                    status: 'unknown',
                    source: 'Context Lens',
                    confidence: 'medium'
                }
            ],
            observedAt: Date.now()
        };


        const evaluation = evaluateContextEpistemicQuality(snapshot);

        const finding = evaluation.findings.find(
            finding => finding.id === 'uncertain-context'
        );

        assert.strictEqual(
            finding?.status,
            'warning'
        );
    });

    test('evaluates conversation context without workspace or project state', () => {
        const snapshot: ContextSnapshot = {
            facts: [
                {
                    id: 'system-instruction',
                    label: 'System Instruction',
                    value: 'You are a helpful assistant.',
                    status: 'observed',
                    source: 'Conversation Context',
                    confidence: 'high'
                },
                {
                    id: 'user-message',
                    label: 'User Message',
                    value: 'Explain this architecture.',
                    status: 'observed',
                    source: 'Conversation Context',
                    confidence: 'high'
                }
            ],
            observedAt: Date.now()
        };

        const evaluation = evaluateContextEpistemicQuality(snapshot);

        assert.strictEqual(
            evaluation.findings.length,
            1
        );

        assert.strictEqual(
            evaluation.findings[0].status,
            'healthy'
        );

        assert.strictEqual(
            evaluation.overallStatus,
            'healthy'
        );
    });
});