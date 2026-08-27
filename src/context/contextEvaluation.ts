import {
    ContextSnapshot,
    ContextHealth,
    ContextHygiene,
    ContextEpistemicQuality
} from './types';

import {
    evaluateContextHealth
} from './contextHealth';

import {
    evaluateContextHygiene
} from './contextHygiene';

import {
    evaluateContextEpistemicQuality
} from './contextEpistemic';


export interface ContextEvaluation {
    health: ContextHealth;
    hygiene: ContextHygiene;
    epistemic: ContextEpistemicQuality;
}


export function evaluateContext(
    snapshot: ContextSnapshot
): ContextEvaluation {
    return {
        health: evaluateContextHealth(snapshot),
        hygiene: evaluateContextHygiene(snapshot),
        epistemic: evaluateContextEpistemicQuality(snapshot)
    };
}