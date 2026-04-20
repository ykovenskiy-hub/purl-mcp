/**
 * Continuous Movement
 *
 * Velocity-based movement for free (non-grid) movement.
 */
import type { DynamicsObject, GridConfig, StateUpdate } from '../types';
import type { SpatialGrid } from '../collision';
/**
 * Process continuous (velocity-based) movement
 */
export declare function processContinuousMovement(obj: DynamicsObject, grid: GridConfig | null, deltaTime: number, allObjects?: DynamicsObject[], spatialGrid?: SpatialGrid, options?: {
    skipAngular?: boolean;
    skipCollision?: boolean;
    gravityOverride?: {
        gx: number;
        gy: number;
    };
    forceAngular?: boolean;
}): StateUpdate | null;
