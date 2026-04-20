/**
 * Path Tracing for Tunneling Prevention
 *
 * Uses DDA ray marching through the spatial grid to detect
 * collisions along the entire movement path, not just the endpoint.
 *
 * This prevents high-speed objects from tunneling through thin obstacles.
 */
import type { AABB, SpatialGrid } from './spatialGrid';
/**
 * Get the swept AABB along a movement path.
 * This is the union of the object's AABB at start and end positions.
 */
export declare function getSweptAABB(objectAABB: AABB, startX: number, startY: number, endX: number, endY: number): AABB;
/**
 * Get all potential blockers along a movement path.
 *
 * Uses the spatial grid's DDA algorithm to find cells along the path,
 * then queries for objects in those cells.
 *
 * @param grid - The spatial hash grid
 * @param startX - Start position X
 * @param startY - Start position Y
 * @param endX - End position X
 * @param endY - End position Y
 * @param objectHalfWidth - Half width of the moving object
 * @param objectHalfHeight - Half height of the moving object
 * @returns Array of object IDs that might collide along the path
 */
export declare function queryAlongPath(grid: SpatialGrid, startX: number, startY: number, endX: number, endY: number, objectHalfWidth: number, objectHalfHeight: number): string[];
/**
 * Find the first collision point along a path using binary search.
 * Returns the t value (0-1) where collision occurs, or 1 if no collision.
 *
 * @param checkCollision - Function that checks collision at a given position
 * @param startX - Start position X
 * @param startY - Start position Y
 * @param endX - End position X
 * @param endY - End position Y
 * @param iterations - Number of binary search iterations (default 5)
 * @returns t value (0-1) of first collision point
 */
export declare function findCollisionPoint(checkCollision: (x: number, y: number) => boolean, startX: number, startY: number, endX: number, endY: number, iterations?: number): number;
/**
 * Line-segment vs line-segment intersection.
 * Returns the intersection point, or null if segments don't cross.
 */
export declare function segmentIntersection(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): {
    x: number;
    y: number;
} | null;
/**
 * Line-segment vs AABB intersection test (slab method).
 * Returns true if the segment from (x0,y0) to (x1,y1) intersects the AABB.
 */
export declare function lineIntersectsAABB(x0: number, y0: number, x1: number, y1: number, aabb: AABB): boolean;
/**
 * Calculate AABB for an object at a given position
 */
export declare function getAABBAtPosition(x: number, y: number, width: number, height: number, pivot?: {
    x: number;
    y: number;
}): AABB;
/**
 * Compute AABB that encompasses a rotated rectangle.
 * When rotationDelta is 0, falls back to getAABBAtPosition.
 */
export declare function getRotatedAABB(x: number, y: number, width: number, height: number, pivot?: {
    x: number;
    y: number;
}, rotationDelta?: number): AABB;
