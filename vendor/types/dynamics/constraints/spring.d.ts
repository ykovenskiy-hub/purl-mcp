/**
 * Spring Constraint
 *
 * Soft distance constraint with stiffness and damping.
 * Works like a rod but corrects only a fraction of the error per iteration.
 *
 * stiffness: 0 = rigid rod (corrects 100% of error), higher = softer spring
 * damping: reduces correction to absorb oscillation energy
 */
import type { ConstraintCorrection } from './types';
export declare function solveSpring(worldA: {
    x: number;
    y: number;
}, worldB: {
    x: number;
    y: number;
}, restLength: number, stiffness: number, damping: number, _deltaTime: number, restNx?: number, restNy?: number): ConstraintCorrection;
