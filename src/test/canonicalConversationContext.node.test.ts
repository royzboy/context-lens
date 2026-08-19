import * as assert from 'assert';
import { suite, test } from 'mocha';

import {
    ContextSnapshot
} from '../context/types';
import {
    evaluateContextHealth,
} from '../context/contextHealth';
import {
    evaluateContextHygiene
} from '../context/contextHygiene';

suite('Canonical Conversation Context Test Suite', () => {
    test('represents a context source without a workspace or files', () => {
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
                },
                {
                    id: 'uploaded-document',
                    label: 'Uploaded Document',
                    value: 'architecture.md',
                    status: 'observed',
                    source: 'Conversation Context',
                    confidence: 'high'
                }
            ],
            observedAt: Date.now()
        };

        assert.strictEqual(
            snapshot.facts.length,
            3
        );
    });
    test('evaluates a context source without a workspace', () => {
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
                },
                {
                    id: 'uploaded-document',
                    label: 'Uploaded Document',
                    value: 'architecture.md',
                    status: 'observed',
                    source: 'Conversation Context',
                    confidence: 'high'
                }
            ],
            observedAt: Date.now()
        };

        const health = evaluateContextHealth(snapshot);

        assert.strictEqual(
            health.overallStatus,
            'unknown'
        );
    });
    test('evaluates epistemic quality of a conversation context', () => {
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

        const hygiene = evaluateContextHygiene(snapshot);

        const epistemicFinding = hygiene.findings.find(
            finding => finding.id === 'uncertain-context'
        );

        assert.strictEqual(
            epistemicFinding?.status,
            'healthy'
        );
    });
});