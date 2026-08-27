import * as assert from 'assert';

import {
    aggregateFindingStatus
} from '../context/statusAggregation';

suite('Status Aggregation Test Suite', () => {
    test('reports healthy when all findings are healthy', () => {
        const status = aggregateFindingStatus([
            {
                id: 'finding-1',
                label: 'Finding 1',
                status: 'healthy',
                reason: 'Everything is healthy.'
            },
            {
                id: 'finding-2',
                label: 'Finding 2',
                status: 'healthy',
                reason: 'Everything is healthy.'
            }
        ]);

        assert.strictEqual(
            status,
            'healthy'
        );
    });

    test('reports unknown when findings contain unknown but no warning or problem', () => {
        const status = aggregateFindingStatus([
            {
                id: 'finding-1',
                label: 'Finding 1',
                status: 'healthy',
                reason: 'Everything is healthy.'
            },
            {
                id: 'finding-2',
                label: 'Finding 2',
                status: 'unknown',
                reason: 'The required observation is unavailable.'
            }
        ]);

        assert.strictEqual(
            status,
            'unknown'
        );
    });

    test('reports warning when findings contain a warning', () => {
        const status = aggregateFindingStatus([
            {
                id: 'finding-1',
                label: 'Finding 1',
                status: 'healthy',
                reason: 'Everything is healthy.'
            },
            {
                id: 'finding-2',
                label: 'Finding 2',
                status: 'warning',
                reason: 'A potential issue was detected.'
            },
            {
                id: 'finding-3',
                label: 'Finding 3',
                status: 'unknown',
                reason: 'The observation is unavailable.'
            }
        ]);

        assert.strictEqual(
            status,
            'warning'
        );
    });

    test('reports problem when findings contain a problem', () => {
        const status = aggregateFindingStatus([
            {
                id: 'finding-1',
                label: 'Finding 1',
                status: 'healthy',
                reason: 'Everything is healthy.'
            },
            {
                id: 'finding-2',
                label: 'Finding 2',
                status: 'warning',
                reason: 'A potential issue was detected.'
            },
            {
                id: 'finding-3',
                label: 'Finding 3',
                status: 'problem',
                reason: 'A serious issue was detected.'
            }
        ]);

        assert.strictEqual(
            status,
            'problem'
        );
    });

    test('problem takes precedence over warning and unknown', () => {
        const status = aggregateFindingStatus([
            {
                id: 'finding-1',
                label: 'Finding 1',
                status: 'unknown',
                reason: 'The observation is unavailable.'
            },
            {
                id: 'finding-2',
                label: 'Finding 2',
                status: 'warning',
                reason: 'A potential issue was detected.'
            },
            {
                id: 'finding-3',
                label: 'Finding 3',
                status: 'problem',
                reason: 'A serious issue was detected.'
            }
        ]);

        assert.strictEqual(
            status,
            'problem'
        );
    });

    test('problem takes precedence regardless of finding order', () => {
        const status = aggregateFindingStatus([
            {
                id: 'finding-1',
                label: 'Finding 1',
                status: 'problem',
                reason: 'A serious issue was detected.'
            },
            {
                id: 'finding-2',
                label: 'Finding 2',
                status: 'healthy',
                reason: 'Everything is healthy.'
            },
            {
                id: 'finding-3',
                label: 'Finding 3',
                status: 'warning',
                reason: 'A potential issue was detected.'
            }
        ]);

        assert.strictEqual(
            status,
            'problem'
        );
    });

    test('reports healthy when there are no findings', () => {
        const status = aggregateFindingStatus([]);

        assert.strictEqual(
            status,
            'healthy'
        );
    });
});