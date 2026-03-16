/**
 * Blocking Logic
 *
 * Handles blocking expressions and cell occupancy checks.
 */
import type { DynamicsObject, GridConfig } from '../types';
/**
 * Evaluate a blocking expression
 * Supports: mover.prop, self.prop, comparisons (<, >, <=, >=, ==, !=), and/or
 */
export declare function evaluateBlockingExpression(expr: string, mover: DynamicsObject, blocker: DynamicsObject): boolean;
/**
 * Check if a cell is blocked by any object
 */
export declare function isCellBlocked(targetCellX: number, targetCellY: number, mover: DynamicsObject, grid: GridConfig, allObjects: DynamicsObject[]): boolean;
