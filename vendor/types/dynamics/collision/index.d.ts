/**
 * Collision Module
 *
 * Provides efficient collision detection using spatial hashing
 * and path tracing to prevent tunneling.
 */
export { SpatialGrid, type AABB } from './spatialGrid';
export { getSweptAABB, queryAlongPath, findCollisionPoint, getAABBAtPosition, getRotatedAABB, } from './pathTrace';
