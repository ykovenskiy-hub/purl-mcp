/**
 * Movement Runtime State
 *
 * Single source of truth for all movement state.
 * Tracks velocity, cell position, animation, and contact state.
 */
import type { MovementState, GridConfig } from '../types';
export interface RuntimeState {
    velocityX: number;
    velocityY: number;
    cellX: number;
    cellY: number;
    moveCooldown: number;
    lastInputX: number;
    lastInputY: number;
    initialized: boolean;
    lastMoveTime: number;
    animating: boolean;
    animationStart: number;
    animationFromX: number;
    animationFromY: number;
    animationToX: number;
    animationToY: number;
    moving: boolean;
    direction: 'up' | 'down' | 'left' | 'right' | 'none';
    forwardDirection: 'forward' | 'backward' | 'none';
    opacity?: number;
    scale?: number;
    contactNormalX: number;
    contactNormalY: number;
    jumpsRemaining: number;
    grounded: boolean;
    groundedOnId?: string;
    jumpInputConsumed: boolean;
    lastDirection: 'up' | 'down' | 'left' | 'right' | 'none';
    lastForwardDirection: 'forward' | 'backward' | 'none';
    wasMoving: boolean;
    rotating: boolean;
    rotationDirection: 'cw' | 'ccw' | 'none';
    lastRotationDirection: 'cw' | 'ccw' | 'none';
    wasRotating: boolean;
    framesAirborne: number;
    jumped: boolean;
    clickTargetX?: number;
    clickTargetY?: number;
    angularVelocity: number;
    designRotation: number;
    lastContactPoints?: Array<{
        x: number;
        y: number;
        depth: number;
    }>;
    sleepFrames: number;
    sleeping: boolean;
    sleepAnchorX: number;
    sleepAnchorY: number;
    sleepAnchorRot: number;
    dragging: boolean;
    dragOriginCellX: number;
    dragOriginCellY: number;
    dragGrabOffsetX: number;
    dragGrabOffsetY: number;
}
/** Call when follow is set on an object — tracks which targets need trails */
export declare function registerFollowTarget(followerId: string, targetId: string): void;
/** Call when follow is cleared from an object */
export declare function unregisterFollowTarget(followerId: string): void;
/** Record a breadcrumb for a target object (call after movement each frame) */
export declare function recordBreadcrumb(targetId: string, x: number, y: number, rotation: number): void;
/**
 * Get the next waypoint for a follower from the target's breadcrumb trail.
 * Returns the breadcrumb position to steer toward, or null if no trail / caught up.
 * Advances the read cursor when the follower is close enough to the current waypoint.
 */
export declare function getNextBreadcrumb(followerId: string, followerX: number, followerY: number, waypointThreshold?: number): {
    x: number;
    y: number;
    rotation: number;
} | null;
/** Clear all breadcrumb state (call on engine stop) */
export declare function clearBreadcrumbs(): void;
/** Get all breadcrumb trail data for debug visualization */
export declare function getDebugBreadcrumbs(): Array<{
    targetId: string;
    points: Array<{
        x: number;
        y: number;
    }>;
    writeIndex: number;
    cursors: Array<{
        followerId: string;
        readIndex: number;
    }>;
}>;
/** Record that a movable-vs-movable collision was resolved this frame. */
export declare function addResolvedMovablePair(moverId: string, blockerId: string): void;
/** Check if a movable-vs-movable pair was already resolved this frame. */
export declare function isMovablePairResolved(a: string, b: string): boolean;
/** Clear resolved pairs at the start of each frame. */
export declare function clearResolvedMovablePairs(): void;
export interface PendingImpulse {
    vx: number;
    vy: number;
    av: number;
    dx: number;
    dy: number;
}
interface CollisionRecord {
    moverId: string;
    blockerId: string;
}
/**
 * Add an impulse to be applied to an object after all movement is processed.
 * Multiple impulses to the same object are summed.
 * Wakes the target object — an impulse means something hit it.
 */
export declare function addPendingImpulse(objectId: string, vx: number, vy: number, av?: number, dx?: number, dy?: number): void;
/**
 * Drain all pending impulses (returns and clears the map).
 */
export declare function drainPendingImpulses(): Map<string, PendingImpulse>;
/**
 * Record a collision event (mover hit blocker).
 * Deduplicated per frame - same pair won't fire multiple events.
 */
export declare function addCollisionEvent(moverId: string, blockerId: string): void;
/**
 * Drain all collision events (returns and clears the array).
 */
export declare function drainCollisionEvents(): CollisionRecord[];
/**
 * Get or create runtime state for an object
 */
export declare function getRuntime(id: string, grid: GridConfig | null, x: number, y: number, rotation?: number): RuntimeState;
/**
 * Get runtime state without creating (for reads)
 */
export declare function getRuntimeState(id: string): RuntimeState | undefined;
/**
 * Clear all runtime state (call when exiting play mode)
 */
export declare function clearRuntimeStates(): void;
/**
 * Set click-to-move target for an object
 */
export declare function setClickTarget(objectId: string, x: number, y: number): void;
/**
 * Wake a sleeping object (called on external stimuli: impulse, script action).
 */
export declare function wakeObject(objectId: string): void;
/**
 * Clear click-to-move target for an object
 */
export declare function clearClickTarget(objectId: string): void;
/**
 * Check if an object has a click-to-move target
 */
export declare function hasClickTarget(objectId: string): boolean;
/**
 * Get cell X coordinate for an object
 */
export declare function getCellX(objectId: string): number | undefined;
/**
 * Get cell Y coordinate for an object
 */
export declare function getCellY(objectId: string): number | undefined;
/**
 * Get animation opacity (for fade move style)
 */
export declare function getAnimationOpacity(objectId: string): number | undefined;
/**
 * Get animation scale (for jump move style)
 */
export declare function getAnimationScale(objectId: string): number | undefined;
/**
 * Check if object is currently animating
 */
export declare function isAnimating(objectId: string): boolean;
/**
 * Check if a specific object is currently moving or animating
 */
export declare function isObjectMoving(objectId: string): boolean;
/**
 * Check if any object is currently moving or animating
 */
export declare function isAnyObjectMoving(): boolean;
/**
 * Get full movement state for an object
 */
export declare function getMovementState(objectId: string): MovementState | undefined;
export interface MovementEvent {
    type: 'move' | 'stop' | 'jump' | 'land' | 'rotate' | 'stopRotate';
    objectId: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward';
    angle?: number;
    rotationDirection?: 'cw' | 'ccw';
}
/**
 * Record a jump event (called from continuous.ts when jump triggers)
 */
export declare function addJumpEvent(objectId: string): void;
/**
 * Update previous state and detect movement events.
 * Call this after processing each object's movement.
 */
export declare function detectMovementEvents(objectId: string): void;
/**
 * Drain all movement events (returns and clears the array).
 */
export declare function drainMovementEvents(): MovementEvent[];
/**
 * Set cell position directly in runtime state
 */
export declare function setCellPositionDirect(objectId: string, cellX: number, cellY: number): void;
export {};
