/**
 * Pin (Revolute) Constraint
 *
 * Keeps two anchor points coincident in world space.
 * Bodies can rotate freely around the pin.
 *
 * Correction: worldA should equal worldB.
 */
import type { ConstraintCorrection } from './types';
export declare function solvePin(worldA: {
    x: number;
    y: number;
}, worldB: {
    x: number;
    y: number;
}): ConstraintCorrection;
