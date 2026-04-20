/**
 * Constraint Solver Types
 *
 * Runtime state for active peg constraints.
 * Separate from PegConstraintDef (static data from object model).
 */
import type { DynamicsObject, PegConstraintType } from '../types';
export interface ActiveConstraint {
    id: string;
    type: PegConstraintType;
    bodyA: DynamicsObject;
    bodyB: DynamicsObject | null;
    anchorA: {
        x: number;
        y: number;
    };
    anchorB: {
        x: number;
        y: number;
    };
    worldAnchorX: number;
    worldAnchorY: number;
    restLength: number;
    restAngle: number;
    stiffness: number;
    damping: number;
    breakForce?: number;
    accumulatedForce: number;
    weldA?: boolean;
    weldB?: boolean;
    restAngleA?: number;
    restAngleB?: number;
    restConnectionAngle?: number;
    restNormalX?: number;
    restNormalY?: number;
}
export interface PathBindingContext {
    /** Check if body is path-bound and return its path info, or null if not path-bound. */
    getPathInfo(bodyId: string): {
        pathT: number;
        pathId: string;
        polyline: Array<{
            x: number;
            y: number;
        }>;
        pathClosed: boolean;
        pathLength: number;
    } | null;
    /** Apply a pathT delta to a body (updates pathT, re-derives x/y position). */
    applyPathTDelta(bodyId: string, body: DynamicsObject, delta: number): void;
}
export interface ConstraintCorrection {
    dxA: number;
    dyA: number;
    dxB: number;
    dyB: number;
    dRotA: number;
    dRotB: number;
    force: number;
}
