/**
 * Path Binding Utilities
 *
 * Geometry helpers for path-constrained movement.
 * All operations work on world-space polylines (arrays of {x, y} points).
 */
export interface PathPoint {
    x: number;
    y: number;
}
export interface PathProjection {
    t: number;
    x: number;
    y: number;
    dist: number;
    segIndex: number;
}
/** Compute total arc length of a polyline. */
export declare function getPolylineLength(points: PathPoint[]): number;
/** Get the point on a polyline at a given distance from the start. */
export declare function getPointAtDistance(points: PathPoint[], t: number): {
    x: number;
    y: number;
    segIndex: number;
};
/** Get the tangent direction (normalized) at a given distance along the polyline. */
export declare function getTangentAtDistance(points: PathPoint[], t: number): {
    x: number;
    y: number;
};
/**
 * Project a world position onto a polyline.
 * Returns the closest point on the polyline, the distance along it, and the perpendicular distance.
 */
export declare function projectOntoPath(points: PathPoint[], px: number, py: number): PathProjection;
