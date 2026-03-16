/**
 * Property Interpolation for Tween Animations
 *
 * Interpolates between two property values at time t (0-1).
 * Used by the animation engine for smooth state transitions.
 */
import type { Prime } from '../types/object';
export type EasingFunction = (t: number) => number;
export declare const EASING_FUNCTIONS: Record<string, EasingFunction>;
export declare function getEasing(name?: string): EasingFunction;
export type RotationDirection = 'shortest' | 'cw' | 'ccw';
/**
 * Interpolate a single property value between `from` and `to` at time `t` (0-1).
 */
export declare function interpolateProperty(key: string, from: unknown, to: unknown, t: number, rotationDirection?: RotationDirection): unknown;
/**
 * Interpolate between two full property snapshots.
 * Returns a new snapshot with all properties interpolated at time t.
 */
export declare function interpolateSnapshot(from: Record<string, Partial<Prime>>, to: Record<string, Partial<Prime>>, t: number, rotationDirection?: RotationDirection): Record<string, Partial<Prime>>;
