import * as assert from 'assert';

import {
    ContextSnapshot
} from '../context/types';

import {
    evaluateContextHygiene
} from '../context/contextHygiene';


suite('Context Hygiene Test Suite', () => {
    test('reports healthy when open files contain no duplicates', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [],
            projectState: {
                openFiles: [
                    {
                        path: '/Users/roysong/Projects/context-lens-test/README.md',
                        isActive: false,
                        isDirty: false
                    },
                    {
                        path: '/Users/roysong/Projects/context-lens-test/test2.md',
                        isActive: false,
                        isDirty: false
                    }
                ]
            },
            observedAt: Date.now()
        };

        const hygiene = evaluateContextHygiene(snapshot);

        assert.strictEqual(
            hygiene.overallStatus,
            'healthy'
        );

        const finding = hygiene.findings.find(
            finding => finding.id === 'duplicate-open-files'
        );

        assert.strictEqual(
            finding?.status,
            'healthy'
        );
    });

    test('reports warning when an open file appears more than once', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [],
            projectState: {
                openFiles: [
                    {
                        path: '/Users/roysong/Projects/context-lens-test/README.md',
                        isActive: false,
                        isDirty: false
                    },
                    {
                        path: '/Users/roysong/Projects/context-lens-test/test2.md',
                        isActive: false,
                        isDirty: false
                    },
                    {
                        path: '/Users/roysong/Projects/context-lens-test/README.md',
                        isActive: false,
                        isDirty: false
                    }
                ]
            },
            observedAt: Date.now()
        };

        const hygiene = evaluateContextHygiene(snapshot);

        assert.strictEqual(
            hygiene.overallStatus,
            'warning'
        );

        const finding = hygiene.findings.find(
            finding => finding.id === 'duplicate-open-files'
        );

        assert.strictEqual(
            finding?.status,
            'warning'
        );
    });

    test('reports unknown when project state is unavailable', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'No workspace',
            workspacePath: '',
            facts: [],
            projectState: {
                openFiles: []
            },
            observedAt: Date.now()
        };

        const hygiene = evaluateContextHygiene(snapshot);

        assert.strictEqual(
            hygiene.overallStatus,
            'unknown'
        );

        const finding = hygiene.findings.find(
            finding => finding.id === 'duplicate-open-files'
        );

        assert.strictEqual(
            finding?.status,
            'unknown'
        );
    });
});