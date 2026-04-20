/**
 * Movement Helpers
 *
 * Shared utility functions for movement processing.
 */
import type { DynamicsObject, GridConfig, KeyMapping, PadMapping } from '../types';
import type { RuntimeState } from './state';
import type { SpatialGrid } from '../collision';
export interface DebugDodgeRod {
    x: number;
    y: number;
    endX: number;
    endY: number;
    blocked: boolean;
    objectId: string;
}
export declare function getDebugDodgeRods(): DebugDodgeRod[];
export declare function clearDebugDodgeRods(): void;
interface DodgeTargetState {
    prevDist: number;
    steerSide: number;
}
export declare function getDodgeRayState(moverId: string, targetId: string): DodgeTargetState | undefined;
export declare function setDodgeRayState(moverId: string, targetId: string, state: DodgeTargetState): void;
export declare function clearDodgeRayStates(): void;
export declare function pushDebugDodgeRod(x: number, y: number, endX: number, endY: number, blocked: boolean, objectId: string): void;
/**
 * Get effective radius for an object — uses collision shape if available,
 * falls back to width/height. Excludes ghost children from component bounds.
 */
export declare function getEffectiveRadius(obj: DynamicsObject, allObjects?: DynamicsObject[]): number;
/**
 * Get the key mapping for an object based on its inputBinding.
 * Fills in defaults for any axes not explicitly bound (legacy objects may
 * lack jump/pull fields).
 */
export declare function getKeysForObject(obj: DynamicsObject): KeyMapping;
/**
 * Get the pad mapping for an object. Fills defaults for missing axes.
 */
export declare function getPadForObject(obj: DynamicsObject): PadMapping;
/**
 * Check if object should read keyboard input
 */
export declare function shouldReadKeyboard(obj: DynamicsObject): boolean;
export declare function shouldReadScript(obj: DynamicsObject): boolean;
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
export declare function getAIIntent(obj: DynamicsObject, allObjects: DynamicsObject[], deltaTime?: number): AIIntent | null;
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
export declare function getClickTargetDirection(obj: DynamicsObject, runtime: RuntimeState, deltaTime?: number, allObjects?: DynamicsObject[]): {
    x: number;
    y: number;
    arrived: boolean;
    targetX?: number;
    targetY?: number;
};
/**
 * Get input direction from gamepad using the object's pad binding.
 */
export declare function getGamepadInputDirection(obj: DynamicsObject): {
    x: number;
    y: number;
};
/**
 * Get input direction from held keys
 */
export declare function getInputDirection(keys: KeyMapping, heldKeySet?: Set<string>): {
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
 * Cast a "rod" (line segment) from object center in the given direction.
 * Returns true if the rod hits a blocker, false if clear.
 * Uses spatial grid for broad-phase, then line-vs-AABB for each candidate.
 */
export declare function probeDirection(obj: DynamicsObject, dirX: number, dirY: number, distance: number, allObjects: DynamicsObject[], spatialGrid: SpatialGrid): boolean;
/**
 * Adjust a movement direction to avoid obstacles.
 * Casts the rod in the desired direction; if blocked, sweeps ±N° to find
 * the minimum deviation that clears. Returns adjusted direction.
 */
export declare function applyDodge(obj: DynamicsObject, dirX: number, dirY: number, distance: number, allObjects: DynamicsObject[], spatialGrid: SpatialGrid): {
    dirX: number;
    dirY: number;
};
/**
 * Update velocity based on input and physics
 */
export declare function updateVelocity(vx: number, vy: number, inputX: number, inputY: number, maxSpeed: number, accel: number, decel: number, gravity: number, wind: number, windAngle: number, dt: number, contactNormalX?: number, contactNormalY?: number, mass?: number, area?: number, drag?: number, gravityScale?: number, windScale?: number, dragScale?: number, gravityOverride?: {
    gx: number;
    gy: number;
}): {
    velocityX: number;
    velocityY: number;
};
export {};
