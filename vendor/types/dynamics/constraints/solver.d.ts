/**
 * Constraint Solver
 *
 * Position-Based Dynamics (PBD) iterative constraint solver.
 * Runs after per-object physics, before carrying/impulses.
 *
 * Each iteration: for each constraint, compute correction and apply
 * mass-weighted position adjustments to both bodies.
 *
 * Revolute constraints (pin/rod/spring) use rigid body mechanics:
 * lever arm cross normal → angular correction alongside translation.
 *
 * Velocity is derived by the engine from position displacement (PBD standard),
 * not projected or stabilized here.
 */
import type { DynamicsObject } from '../types';
import type { ActiveConstraint } from './types';
/**
 * Convert a local anchor (0-1 relative to object bounds) to world coordinates.
 * Accounts for pivot offset and rotation.
 */
export declare function anchorToWorld(obj: DynamicsObject, anchor: {
    x: number;
    y: number;
}): {
    x: number;
    y: number;
};
/**
 * Solve all active constraints for one frame.
 * Returns IDs of broken constraints (force exceeded breakForce).
 *
 * Velocity derivation (v = Δpos / dt) is handled by the engine after this call,
 * so this function only modifies positions and rotations.
 */
export declare function solveConstraints(constraints: ActiveConstraint[], deltaTime: number, iterations?: number, draggedIds?: ReadonlySet<string>): string[];
