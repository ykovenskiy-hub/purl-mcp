/**
 * Movement Module
 *
 * Public API for the movement system.
 * Grid is a constraint on physics, not a separate movement mode.
 */
import type { DynamicsObject, GridConfig, StateUpdate } from '../types';
import type { SpatialGrid } from '../collision';
export { clearRuntimeStates, getCellX, getCellY, getAnimationOpacity, getAnimationScale, isAnimating, isObjectMoving, isAnyObjectMoving, getMovementState, setCellPositionDirect, drainPendingImpulses, drainCollisionEvents, detectMovementEvents, drainMovementEvents, addJumpEvent, wakeObject, getDebugBreadcrumbs, getDebugClickTargets, } from './state';
export type { MovementEvent } from './state';
export { getDebugMoveToPaths } from './pathfinding';
export { getCellPosition, getCellFromPosition, getCellSpan, getMultiCellPosition, getAnchorCellFromPosition, getOccupiedCells, findBlockerAtCells, findOccupantAtCells, } from './helpers';
export { processStaticSnap } from './static';
/**
 * Process movement for a single object
 * Physics always runs; grid snapping is applied as a constraint if enabled
 */
export declare function processMovement(obj: DynamicsObject, grid: GridConfig | null, deltaTime: number, allObjects?: DynamicsObject[], spatialGrid?: SpatialGrid, options?: {
    skipAngular?: boolean;
    skipCollision?: boolean;
    gravityOverride?: {
        gx: number;
        gy: number;
    };
}): StateUpdate | null;
