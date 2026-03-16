/**
 * Static Grid Snapping
 *
 * For non-movable objects that should snap to grid cells.
 * Supports multi-cell objects (1x2, 2x1, etc).
 */
import type { DynamicsObject, GridConfig, StateUpdate } from '../types';
/**
 * Snap a non-movable object to its grid cell(s)
 */
export declare function processStaticSnap(obj: DynamicsObject, grid: GridConfig): StateUpdate | null;
