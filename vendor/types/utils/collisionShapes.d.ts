/**
 * 2D Collision Shape Library
 *
 * Pure geometry utilities for shape intersection testing.
 * Used by: blocking (play mode), component bounds (editor), area detection.
 *
 * Two collision primitives:
 *   - CollisionPolygon: convex or concave polygon (vertices in world space)
 *   - CollisionLine: line segment (two endpoints in world space)
 *
 * All coordinates are in the same space (cell-relative global coords).
 */
export interface Point {
    x: number;
    y: number;
}
export interface CollisionPolygon {
    type: 'polygon';
    vertices: Point[];
    convexParts?: Point[][];
}
export interface CollisionLine {
    type: 'line';
    p1: Point;
    p2: Point;
}
export type CollisionShape = CollisionPolygon | CollisionLine;
export interface ContactPoint {
    x: number;
    y: number;
    depth: number;
}
export interface CollisionResult {
    colliding: boolean;
    /** Minimum translation vector to separate shapes (from A out of B) */
    mtv?: Point;
    /** Contact points between colliding shapes (1-2 points for polygon-polygon) */
    contactPoints?: ContactPoint[];
}
/**
 * Test if two collision shapes intersect.
 */
export declare function testIntersection(a: CollisionShape, b: CollisionShape): CollisionResult;
/**
 * Polygon intersection test.
 * Convex-convex uses SAT directly. Concave polygons are handled via
 * pre-computed convex decomposition (ear-clipped triangles).
 */
export declare function testPolygonPolygon(a: CollisionPolygon, b: CollisionPolygon): CollisionResult;
/**
 * Test if a line segment intersects a polygon.
 * Checks: (1) either endpoint inside polygon, (2) segment crosses any edge.
 */
export declare function testPolygonLine(poly: CollisionPolygon, line: CollisionLine): CollisionResult;
/**
 * Test if two line segments intersect.
 */
export declare function testLineLine(a: CollisionLine, b: CollisionLine): CollisionResult;
/**
 * Test if a point is inside a polygon using ray casting.
 */
export declare function pointInPolygon(point: Point, vertices: Point[]): boolean;
interface AABB {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
/**
 * Compute the axis-aligned bounding box of a polygon.
 */
export declare function polygonAABB(vertices: Point[]): AABB;
/**
 * Compute the AABB of a collision shape.
 */
export declare function shapeAABB(shape: CollisionShape): AABB;
/**
 * Create a collision polygon from a rotated rectangle.
 * x, y = pivot position; width, height = size; rotation in degrees.
 * pivot = {0.5, 0.5} means x,y is center.
 */
export declare function rectToPolygon(x: number, y: number, width: number, height: number, rotation?: number, pivot?: Point): CollisionPolygon;
/**
 * Create a collision polygon from an ellipse.
 * Approximates with N vertices.
 */
export declare function ellipseToPolygon(x: number, y: number, width: number, height: number, rotation?: number, pivot?: Point, segments?: number): CollisionPolygon;
/**
 * Create a collision polygon from custom polygon points.
 * Points are 0-1 relative to bounding box; transformed to world space.
 */
export declare function polygonPointsToPolygon(points: Point[], x: number, y: number, width: number, height: number, rotation?: number, pivot?: Point, flipX?: boolean, flipY?: boolean): CollisionPolygon;
/**
 * Create a collision polygon from path segments (bezier curves).
 * Flattens curves to line segments for collision.
 */
export declare function pathSegmentsToPolygon(segments: Array<{
    type: string;
    x?: number;
    y?: number;
    cp1x?: number;
    cp1y?: number;
    cp2x?: number;
    cp2y?: number;
    cpx?: number;
    cpy?: number;
}>, x: number, y: number, width: number, height: number, rotation?: number, pivot?: Point, flipX?: boolean, flipY?: boolean, curveSamples?: number): CollisionPolygon;
/**
 * Create a collision line from world-space endpoints.
 */
export declare function lineToCollisionLine(x1: number, y1: number, x2: number, y2: number): CollisionLine;
/**
 * Create a thin polygon from a line segment (for blocking collision).
 * Extrudes the line perpendicular to its direction by halfThickness on each side.
 */
export declare function lineToPolygon(x1: number, y1: number, x2: number, y2: number, halfThickness?: number): CollisionPolygon;
/**
 * Translate a collision shape by (dx, dy).
 * Returns a new shape — does not mutate the original.
 */
export declare function translateShape(shape: CollisionShape, dx: number, dy: number): CollisionShape;
/**
 * Rotate a collision shape around its vertex-average center.
 * For runtime rotation of physics shapes, prefer rotateShapeAroundPoint
 * with the object's position to match the visual pivot.
 */
export declare function rotateShapeAroundCenter(shape: CollisionShape, angleDegrees: number): CollisionShape;
/**
 * Rotate a collision shape around an explicit point by the given angle.
 * Returns a new shape — does not mutate the original.
 * Use this for runtime rotation so the collision shape matches the visual pivot.
 */
export declare function rotateShapeAroundPoint(shape: CollisionShape, angleDegrees: number, cx: number, cy: number): CollisionShape;
/**
 * Area-weighted centroid of a simple polygon (center of mass for uniform density).
 * Uses the signed-area formula. Falls back to vertex average for degenerate polygons.
 */
export declare function polygonAreaCentroid(vertices: Point[]): Point;
/**
 * Test if a point is inside a collision shape.
 * For convex polygons: cross-product winding test.
 * For concave polygons (with convexParts): test each convex sub-polygon.
 * Lines always return false (no area).
 */
export declare function pointInShape(px: number, py: number, shape: CollisionShape): boolean;
export {};
