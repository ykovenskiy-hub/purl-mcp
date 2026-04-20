/**
 * Pathfinding — Static collision bitmap + A* path planning for moveTo.
 *
 * Rasterizes static blockers into a grid, uses A* to find routes around obstacles,
 * smooths paths with Bresenham line-of-sight.
 */
import type { DynamicsObject } from '../types';
export interface CollisionBitmap {
    data: Uint8Array;
    distance: Uint8Array;
    cols: number;
    rows: number;
    cellSize: number;
    originX: number;
    originY: number;
}
/**
 * Build collision bitmap from static blocking objects.
 * Call at play start and when static blockers change.
 */
export declare function buildCollisionBitmap(objects: DynamicsObject[], cellWidth: number, cellHeight: number, inflation?: number, // Inflate blocked cells for mover clearance (~1 cell margin)
level?: number): CollisionBitmap;
/** Mark bitmap as needing rebuild (blocker spawned/destroyed). */
export declare function invalidateBitmap(): void;
/** Get current bitmap (null if not built yet). */
export declare function getBitmap(): CollisionBitmap | null;
/** Get bitmap for a specific level (built and cached on demand). */
export declare function getBitmapForLevel(level: number, objects: DynamicsObject[]): CollisionBitmap | null;
/** Check if bitmap needs rebuild. */
export declare function isBitmapDirty(): boolean;
/**
 * Find a path from world position (fromX, fromY) to (toX, toY).
 * Returns waypoints in world coordinates (smoothed), or empty if no path.
 */
export declare function findPath(fromX: number, fromY: number, toX: number, toY: number, bitmap: CollisionBitmap, moverRadius?: number): Array<{
    x: number;
    y: number;
}>;
/**
 * Get the next direction for an object following a path.
 * Returns null if no path is active — caller should use straight-line fallback.
 */
export declare function getPathDirection(objectId: string, objX: number, objY: number, targetX: number, targetY: number, deltaTime: number, bitmap: CollisionBitmap | null, allObjects?: DynamicsObject[], // All objects — used to build bitmap with movables when stuck
objectLevel?: number, // Object's level — for stuck replan bitmap
facingAngle?: number, // Object's current rotation in degrees — for alignment check
moverRadius?: number): {
    x: number;
    y: number;
    arrived: boolean;
} | null;
/** Clear path state for an object (on destroy or moveTo cancel). */
export declare function clearPathState(objectId: string): void;
/** Clear all path states (on play reset). */
export declare function clearAllPathStates(): void;
/** Get debug data for moveTo path visualization. */
export declare function getDebugMoveToPaths(): Array<{
    objectId: string;
    targetX: number;
    targetY: number;
    waypoints: Array<{
        x: number;
        y: number;
    }>;
    waypointIndex: number;
}>;
