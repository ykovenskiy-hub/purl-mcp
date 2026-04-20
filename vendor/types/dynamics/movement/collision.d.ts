/**
 * Collision Detection
 *
 * Shape-based collision detection and resolution for continuous movement.
 * Uses SAT (Separating Axis Theorem) via collisionShapes library.
 * All dynamics objects must have a collisionShape — no AABB fallback.
 *
 * Supports spatial grid for efficient broad-phase and path-based queries
 * to prevent tunneling through thin obstacles.
 */
import type { DynamicsObject } from '../types';
import { type ContactPoint } from '../../utils/collisionShapes';
import type { SpatialGrid } from '../collision';
export interface CollisionResult {
    blocker: DynamicsObject;
    normalX: number;
    normalY: number;
    penetration: number;
    contactPoints?: ContactPoint[];
}
/**
 * Options for collision detection
 */
export interface DetectCollisionOptions {
    /** Spatial grid for efficient broad-phase queries */
    spatialGrid?: SpatialGrid;
    /** Previous position for path-based collision (tunneling prevention) */
    prevX?: number;
    prevY?: number;
    /** Extra rotation delta for compound body children (parent's incremental rotation).
     *  Added to getRotationDelta result so SAT tests the shape at the correct orientation. */
    extraRotDelta?: number;
}
/**
 * Detect collision between mover at new position and blocking objects.
 * Both mover and blockers must have collisionShape set.
 *
 * When spatialGrid and prevX/prevY are provided, uses path-based collision
 * detection to prevent tunneling through thin obstacles.
 */
/**
 * Detect ALL collisions between mover at new position and blocking objects.
 * Returns every overlapping blocker, not just the first.
 */
export declare function detectAllCollisions(mover: DynamicsObject, newX: number, newY: number, allObjects: DynamicsObject[], options?: DetectCollisionOptions): CollisionResult[];
/**
 * Detect first collision between mover at new position and blocking objects.
 * Wrapper around detectAllCollisions for backward compatibility.
 */
export declare function detectCollision(mover: DynamicsObject, newX: number, newY: number, allObjects: DynamicsObject[], options?: DetectCollisionOptions): CollisionResult | null;
/**
 * Detect ALL collisions for a compound body (shapeless parent mover).
 * Tests each child at the shifted + rotated position against all blockers.
 * Returns all collisions found, deduplicated by blocker (deepest per blocker).
 * Uses the parent's phase/tags for filtering.
 */
export declare function detectAllCompoundCollisions(parent: DynamicsObject, newX: number, newY: number, allObjects: DynamicsObject[], options?: DetectCollisionOptions): CollisionResult[];
/**
 * Detect deepest collision for a compound body.
 * Wrapper around detectAllCompoundCollisions for backward compatibility.
 */
export declare function detectCompoundCollision(parent: DynamicsObject, newX: number, newY: number, allObjects: DynamicsObject[], options?: DetectCollisionOptions): CollisionResult | null;
/**
 * Collision resolution result includes optional impulse for movable blockers.
 */
export interface ResolvedCollision {
    x: number;
    y: number;
    vx: number;
    vy: number;
    blockerImpulse?: {
        id: string;
        vx: number;
        vy: number;
        av?: number;
        dx?: number;
        dy?: number;
    };
}
/**
 * Resolve collision by pushing mover out along surface normal.
 * Velocity component into the surface is reflected by restitution (bounce).
 * Parallel velocity is dampened by friction.
 * When blocker is movable, computes momentum transfer impulse.
 */
export declare function resolveCollision(mover: DynamicsObject, newX: number, newY: number, velocityX: number, velocityY: number, collision: CollisionResult, deltaTime?: number, allObjects?: DynamicsObject[]): ResolvedCollision;
