/**
 * Movement Helpers
 *
 * Shared utility functions for movement processing.
 */
import type { DynamicsObject, GridConfig, KeyMapping } from '../types';
import type { RuntimeState } from './state';
/**
 * Get the key mapping for an object based on its inputBinding
 */
export declare function getKeysForObject(obj: DynamicsObject): KeyMapping;
/**
 * Check if object should read keyboard input
 */
export declare function shouldReadKeyboard(obj: DynamicsObject): boolean;
/**
 * Check if object should read gamepad input
 */
export declare function shouldReadGamepad(obj: DynamicsObject): boolean;
/**
 * Check if object should use click-to-move input
 */
export declare function shouldUseClickTarget(obj: DynamicsObject): boolean;
export interface AIIntent {
    dirX: number;
    dirY: number;
    magnitude: number;
    waypointRotation?: number;
    waypointDist?: number;
}
/**
 * Compute AI intent for follow/avoid behavior.
 * Returns the desired direction and intensity, independent of movement model.
 * Returns null when: no follow, target not found, inside dead zone (arrived).
 */
export declare function getAIIntent(obj: DynamicsObject, allObjects: DynamicsObject[]): AIIntent | null;
/**
 * Convert AI intent into virtual input {x, y} matching the object's movement model.
 * For non-forward objects: direct projection.
 * For forward-axis (tank): decomposes into rotation + forward drive with turn-first logic.
 */
export declare function aiIntentToInput(intent: AIIntent, obj: DynamicsObject): {
    x: number;
    y: number;
};
/**
 * Get input direction toward click target.
 * Returns normalized direction for straight-line movement.
 * When arrived, returns target position for snapping.
 */
export declare function getClickTargetDirection(obj: DynamicsObject, runtime: RuntimeState): {
    x: number;
    y: number;
    arrived: boolean;
    targetX?: number;
    targetY?: number;
};
/**
 * Get input direction from gamepad
 */
export declare function getGamepadInputDirection(obj: DynamicsObject): {
    x: number;
    y: number;
};
/**
 * Get input direction from held keys
 */
export declare function getInputDirection(keys: KeyMapping): {
    x: number;
    y: number;
};
/**
 * Convert continuous input to discrete (single axis, no diagonal)
 */
export declare function getDiscreteDirection(input: {
    x: number;
    y: number;
}): {
    x: number;
    y: number;
};
/**
 * Determine primary direction from velocity or input
 */
export declare function getDirection(vx: number, vy: number): 'up' | 'down' | 'left' | 'right' | 'none';
/**
 * Calculate cell coordinates from world position
 */
export declare function getCellFromPosition(x: number, y: number, grid: GridConfig): {
    cellX: number;
    cellY: number;
};
/**
 * Calculate cell center position with rotation
 */
export declare function getCellPosition(cellX: number, cellY: number, grid: GridConfig): {
    x: number;
    y: number;
};
/**
 * Calculate how many grid cells an object spans based on its dimensions.
 * Rounds to nearest integer (object 0.15 wide on 0.1 cell = 2 cells).
 * Accounts for object rotation - calculates axis-aligned bounding box.
 */
export declare function getCellSpan(objWidth: number, objHeight: number, grid: GridConfig, rotation?: number): {
    spanX: number;
    spanY: number;
};
/**
 * Calculate center position for a multi-cell object given its anchor cell.
 * Anchor cell is the top-left cell the object occupies.
 */
export declare function getMultiCellPosition(anchorCellX: number, anchorCellY: number, spanX: number, spanY: number, grid: GridConfig): {
    x: number;
    y: number;
};
/**
 * Get the anchor cell (top-left) for a multi-cell object from its center position.
 */
export declare function getAnchorCellFromPosition(x: number, y: number, spanX: number, spanY: number, grid: GridConfig): {
    cellX: number;
    cellY: number;
};
/**
 * Get all cells occupied by a multi-cell object.
 */
export declare function getOccupiedCells(anchorCellX: number, anchorCellY: number, spanX: number, spanY: number): Array<{
    cellX: number;
    cellY: number;
}>;
/**
 * Check if target cells are blocked by any grid-snapped object.
 * Uses discrete cell coordinates - same blocking rules, discrete logic.
 * Returns the blocking object if found, null if cells are free.
 */
export declare function findBlockerAtCells<T extends {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    blocking?: boolean | string | {
        affects: string[];
    };
    snapToGrid?: string;
}>(targetCells: Array<{
    cellX: number;
    cellY: number;
}>, moverId: string, allObjects: T[], grid: GridConfig, gridId: string, excludeIds?: string[]): T | null;
/**
 * Find any grid-snapped object occupying the given cells (not just blockers).
 * Used by drag occupy mode to reject drops on occupied cells.
 */
export declare function findOccupantAtCells<T extends {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    snapToGrid?: string;
}>(targetCells: Array<{
    cellX: number;
    cellY: number;
}>, moverId: string, allObjects: T[], grid: GridConfig, gridId: string): T | null;
/**
 * Update velocity based on input and physics
 */
export declare function updateVelocity(vx: number, vy: number, inputX: number, inputY: number, maxSpeed: number, accel: number, decel: number, gravity: number, wind: number, windAngle: number, dt: number, contactNormalX?: number, contactNormalY?: number, mass?: number, area?: number, airResistance?: number, gravityScale?: number, windScale?: number, dragScale?: number, gravityOverride?: {
    gx: number;
    gy: number;
}): {
    velocityX: number;
    velocityY: number;
};
