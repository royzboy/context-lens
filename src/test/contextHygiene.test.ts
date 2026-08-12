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
    test('reports healthy when context facts have strong epistemic metadata', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [
                {
                    id: 'active-file',
                    label: 'Active File',
                    value: 'test2.md',
                    status: 'observed',
                    source: 'VS Code Text Editor API',
                    confidence: 'high'
                }
            ],
            projectState: {
                openFiles: [
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

        const finding = hygiene.findings.find(
            finding => finding.id === 'uncertain-context'
        );

        assert.strictEqual(
            finding?.status,
            'healthy'
        );
    });
    test('reports warning when a context fact has low confidence', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
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
            projectState: {
                openFiles: [
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

        const finding = hygiene.findings.find(
            finding => finding.id === 'uncertain-context'
        );

        assert.strictEqual(
            finding?.status,
            'warning'
        );
    });
    test('reports warning when a context fact has unknown status', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
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
            projectState: {
                openFiles: [
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

        const finding = hygiene.findings.find(
            finding => finding.id === 'uncertain-context'
        );

        assert.strictEqual(
            finding?.status,
            'warning'
        );
    });
});