/**
 * Weld Constraint
 *
 * Locks both position AND relative angle between two bodies.
 * Acts as a rigid connection — no relative movement or rotation.
 *
 * Position correction: same as pin (worldA == worldB).
 * Angular correction: relative angle should equal restAngle.
 */
import type { ConstraintCorrection } from './types';
export declare function solveWeld(worldA: {
    x: number;
    y: number;
}, worldB: {
    x: number;
    y: number;
}, restAngle: number, rotationA: number, rotationB: number, invInertiaA: number, invInertiaB: number): ConstraintCorrection;
