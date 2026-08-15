import {
    ContextSnapshot
} from '../context/types';

import {
    evaluateContextHealth
} from '../context/contextHealth';

import {
    evaluateContextHygiene
} from '../context/contextHygiene';

import * as assert from 'assert';

suite('Canonical Context Boundary Test Suite', () => {
    test('evaluates a platform-independent context snapshot', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'Example Project',
            workspacePath: '/example/project',
            facts: [
                {
                    id: 'workspace',
                    label: 'Workspace',
                    value: 'Example Project',
                    status: 'observed',
                    source: 'Test Context Source',
                    confidence: 'high'
                },
                {
                    id: 'active-file',
                    label: 'Active File',
                    value: '/example/project/README.md',
                    status: 'observed',
                    source: 'Test Context Source',
                    confidence: 'high'
                },
                {
                    id: 'document-dirty',
                    label: 'Unsaved Changes',
                    value: 'No',
                    status: 'observed',
                    source: 'Test Context Source',
                    confidence: 'high'
                }
            ],
            projectState: {
                openFiles: [
                    {
                        path: '/example/project/README.md',
                        isActive: true,
                        isDirty: false
                    }
                ]
            },
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);
        const hygiene = evaluateContextHygiene(snapshot);

        assert.strictEqual(
            health.overallStatus,
            'healthy'
        );

        assert.strictEqual(
            hygiene.overallStatus,
            'healthy'
        );
    });
});