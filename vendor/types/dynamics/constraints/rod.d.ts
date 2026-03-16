/**
 * Rod (Distance) Constraint
 *
 * Maintains a fixed distance between two anchor points.
 * Bodies can rotate freely — only distance is constrained.
 *
 * Correction: |worldA - worldB| should equal restLength.
 */
import type { ConstraintCorrection } from './types';
export declare function solveRod(worldA: {
    x: number;
    y: number;
}, worldB: {
    x: number;
    y: number;
}, restLength: number): ConstraintCorrection;
