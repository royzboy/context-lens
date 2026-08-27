import * as assert from 'assert';

import {
    ContextSnapshot
} from '../context/types';

import {
    evaluateContext
} from '../context/contextEvaluation';


suite('Context Evaluation Test Suite', () => {
    test('evaluates a workspace context across all evaluation dimensions', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/example/project',
            facts: [
                {
                    id: 'workspace',
                    label: 'Workspace',
                    value: 'context-lens-test',
                    status: 'observed',
                    source: 'VS Code Workspace API',
                    confidence: 'high'
                },
                {
                    id: 'active-file',
                    label: 'Active File',
                    value: '/example/project/test.ts',
                    status: 'observed',
                    source: 'VS Code Text Editor API',
                    confidence: 'high'
                }
            ],
            projectState: {
                openFiles: [
                    {
                        path: '/example/project/test.ts',
                        isActive: true,
                        isDirty: false
                    }
                ]
            },
            observedAt: Date.now()
        };

        const evaluation = evaluateContext(snapshot);

        assert.ok(evaluation.health);
        assert.ok(evaluation.hygiene);
        assert.ok(evaluation.epistemic.findings);

        assert.strictEqual(
            evaluation.health.overallStatus,
            'healthy'
        );

        assert.strictEqual(
            evaluation.hygiene.overallStatus,
            'healthy'
        );

        assert.strictEqual(
            evaluation.epistemic.findings.length,
            1
        );

        assert.strictEqual(
            evaluation.epistemic.findings[0].id,
            'uncertain-context'
        );

        assert.strictEqual(
            evaluation.epistemic.findings[0].status,
            'healthy'
        );
    });

    test('evaluates a conversation context without workspace or project state', () => {
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

        const evaluation = evaluateContext(snapshot);

        assert.strictEqual(
            evaluation.health.overallStatus,
            'unknown'
        );

        assert.strictEqual(
            evaluation.hygiene.overallStatus,
            'unknown'
        );

        assert.strictEqual(
            evaluation.epistemic.findings.length,
            1
        );

        assert.strictEqual(
            evaluation.epistemic.findings[0].id,
            'uncertain-context'
        );

        assert.strictEqual(
            evaluation.epistemic.findings[0].status,
            'healthy'
        );
    });
});