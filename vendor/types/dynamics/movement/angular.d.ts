/**
 * Angular Physics
 *
 * Rotational dynamics for objects with `rotatable: true`.
 * Handles angular velocity integration, collision torque, damping, and stability.
 *
 * This module is called from continuous.ts AFTER linear collision resolution.
 * It reads collision results as input and writes only to angular state fields.
 * Non-rotatable objects never enter this code path.
 */
import type { DynamicsObject, GridConfig } from '../types';
import type { RuntimeState } from './state';
import type { CollisionResult } from './collision';
/**
 * Process angular physics for a rotatable object.
 * Called once per frame from continuous.ts, after linear collision resolution.
 *
 * Returns the new rotation value (or undefined if unchanged).
 */
export declare function processAngularPhysics(obj: DynamicsObject, runtime: RuntimeState, collision: CollisionResult | null, grid: GridConfig | null, deltaTime: number, resolvedX?: number, resolvedY?: number, options?: {
    skipDamping?: boolean;
    skipTipping?: boolean;
}): number | undefined;
/**
 * Get the rotation delta between runtime and design-time rotation.
 * Returns 0 for non-rotatable objects (no shape rotation needed).
 */
export declare function getRotationDelta(objectId: string, currentRotation: number | undefined): number;
/**
 * Compute jump direction along surface normal instead of straight up.
 * Returns velocity components for the jump impulse.
 */
export declare function getInclineJumpDirection(contactNormalX: number, contactNormalY: number, jumpHeight: number): {
    vx: number;
    vy: number;
};
