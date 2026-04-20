/**
 * Free-Movement Pull System
 *
 * Phantom push model: when Shift is held near a pullable object,
 * a phantom "pusher" on the opposite side applies collision impulse
 * using the same formula as resolveCollision. The pullable accelerates
 * naturally with mass. No collision skip — mover collides normally.
 *
 * Entry points called from the engine tick:
 *   1. updatePullLinks()  — before object movement (engage/disengage)
 *   2. applyPhantomPush() — after mover moves: compute and apply impulse
 */
import type { DynamicsObject, GridConfig } from '../types';
import type { InputState } from '../inputState';
export interface PullLink {
    moverId: string;
    pullableId: string;
}
/**
 * Scan for Shift-held movers near pullable objects. Create or destroy pull links.
 * Called once per tick, before any object movement.
 */
export declare function updatePullLinks(allObjects: DynamicsObject[], input: InputState, grids?: Map<string, GridConfig>): void;
/**
 * Apply phantom push: compute impulse as if a phantom with the mover's
 * velocity and mass collided with the pullable from the opposite side.
 * Same formula as resolveCollision (non-stable, restitution=0).
 * Returns the ratio of phantom's post-collision speed to pre-collision speed,
 * so the caller can scale the mover to match.
 * Returns 1.0 when no scaling needed (no link, pullable already at speed).
 */
export declare function applyPhantomPush(moverId: string, dx: number, dy: number, deltaTime: number, allObjects: DynamicsObject[]): number;
/**
 * Check if an object is currently being pulled by any mover.
 */
export declare function isPulled(objectId: string): boolean;
/**
 * Get the active pull link for a mover (if any).
 */
export declare function getActivePull(moverId: string): PullLink | undefined;
/**
 * Get debug phantom position (for visual debug rendering).
 */
export declare function getDebugPhantom(): {
    phantomX: number;
    phantomY: number;
    pullableX: number;
    pullableY: number;
    moverX: number;
    moverY: number;
    dirX: number;
    dirY: number;
} | null;
/**
 * Clear all pull state. Called on reset/setObjects.
 */
export declare function resetPullState(): void;
