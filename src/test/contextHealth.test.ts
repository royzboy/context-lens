import * as assert from 'assert';

import {
    ContextSnapshot
} from '../context/types';

import {
    evaluateContextHealth
} from '../context/contextHealth';


suite('Context Health Test Suite', () => {
    test('reports healthy when the active file is present in project state', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [
                {
                    id: 'workspace',
                    label: 'Workspace',
                    value: 'context-lens-test',
                    status: 'observed'
                },
                {
                    id: 'active-file',
                    label: 'Active File',
                    value: '/Users/roysong/Projects/context-lens-test/test2.md',
                    status: 'observed'
                },
                {
                    id: 'document-dirty',
                    label: 'Unsaved Changes',
                    value: 'No',
                    status: 'observed'
                }
            ],
            projectState: {
                openFiles: [
                    '/Users/roysong/Projects/context-lens-test/README.md',
                    '/Users/roysong/Projects/context-lens-test/test2.md'
                ]
            },
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);

        assert.strictEqual(
            health.overallStatus,
            'healthy'
        );

        const finding = health.findings.find(
            finding => finding.id === 'active-file-coherence'
        );

        assert.strictEqual(
            finding?.status,
            'healthy'
        );
    });

    test('reports warning when the active file is not in project state', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [
                {
                    id: 'workspace',
                    label: 'Workspace',
                    value: 'context-lens-test',
                    status: 'observed'
                },
                {
                    id: 'active-file',
                    label: 'Active File',
                    value: '/Users/roysong/Projects/context-lens-test/test2.md',
                    status: 'observed'
                },
                {
                    id: 'document-dirty',
                    label: 'Unsaved Changes',
                    value: 'No',
                    status: 'observed'
                }
            ],
            projectState: {
                openFiles: [
                    '/Users/roysong/Projects/context-lens-test/README.md',
                ]
            },
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);

        assert.strictEqual(
            health.overallStatus,
            'warning'
        );

        const finding = health.findings.find(
            finding => finding.id === 'active-file-coherence'
        );

        assert.strictEqual(
            finding?.status,
            'warning'
        );
    });

    test('reports healthy when the active file is inside the workspace', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [
                {
                    id: 'workspace',
                    label: 'Workspace',
                    value: 'context-lens-test',
                    status: 'observed'
                },
                {
                    id: 'active-file',
                    label: 'Active File',
                    value: '/Users/roysong/Projects/context-lens-test/README.md',
                    status: 'observed'
                }
            ],
            projectState: {
                openFiles: [
                    '/Users/roysong/Projects/context-lens-test/README.md'
                ]
            },
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);

        const finding = health.findings.find(
            finding => finding.id === 'workspace-file-coherence'
        );

        assert.strictEqual(finding?.status, 'healthy');
    });

    test('reports warning when the active file is outside the workspace', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [
                {
                    id: 'workspace',
                    label: 'Workspace',
                    value: 'context-lens-test',
                    status: 'observed'
                },
                {
                    id: 'active-file',
                    label: 'Active File',
                    value: '/Users/roysong/Documents/random.md',
                    status: 'observed'
                }
            ],
            projectState: {
                openFiles: [
                    '/Users/roysong/Documents/random.md'
                ]
            },
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);

        const finding = health.findings.find(
            finding => finding.id === 'workspace-file-coherence'
        );

        assert.strictEqual(finding?.status, 'warning');
    });

    test('reports healthy when all open files are inside the workspace', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [
                {
                    id: 'workspace',
                    label: 'Workspace',
                    value: 'context-lens-test',
                    status: 'observed'
                }
            ],
            projectState: {
                openFiles: [
                    '/Users/roysong/Projects/context-lens-test/README.md',
                    '/Users/roysong/Projects/context-lens-test/test2.md'
                ]
            },
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);

        const finding = health.findings.find(
            finding => finding.id === 'open-file-coherence'
        );

        assert.strictEqual(
            finding?.status,
            'healthy'
        );
    });

    test('reports warning when an open file is outside the workspace', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'context-lens-test',
            workspacePath: '/Users/roysong/Projects/context-lens-test',
            facts: [
                {
                    id: 'workspace',
                    label: 'Workspace',
                    value: 'context-lens-test',
                    status: 'observed'
                }
            ],
            projectState: {
                openFiles: [
                    '/Users/roysong/Projects/context-lens-test/README.md',
                    '/Users/roysong/Documents/random.md'
                ]
            },
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);

        const finding = health.findings.find(
            finding => finding.id === 'open-file-coherence'
        );

        assert.strictEqual(
            finding?.status,
            'warning'
        );
    });

    test('reports unknown when no workspace is available', () => {
        const snapshot: ContextSnapshot = {
            workspaceName: 'No workspace',
            workspacePath: '',
            facts: [],
            projectState: {
                openFiles: []
            },
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);

        console.log('No-workspace health:', health);

        assert.strictEqual(
            health.overallStatus,
            'unknown'
        );

        const workspaceFinding = health.findings.find(
            finding => finding.id === 'workspace-state'
        );

        assert.strictEqual(
            workspaceFinding?.status,
            'unknown'
        );

        const projectFinding = health.findings.find(
            finding => finding.id === 'project-state'
        );

        assert.strictEqual(
            projectFinding?.status,
            'unknown'
        );

        const openFileFinding = health.findings.find(
            finding => finding.id === 'open-file-coherence'
        );

        assert.strictEqual(
            openFileFinding?.status,
            'unknown'
        );
    });
});