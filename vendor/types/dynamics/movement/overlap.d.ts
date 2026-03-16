/**
 * Overlap Detection - Sensor system
 *
 * Detects when objects with sensor=true overlap with other objects.
 * Tracks overlap pairs across frames to produce start/end events.
 *
 * Pure TypeScript - renderer agnostic.
 */
import type { DynamicsObject, OverlapEvent } from '../types';
/**
 * Tracks overlap state across frames and produces enter/exit events.
 */
export declare class OverlapTracker {
    private activeOverlaps;
    /**
     * Detect overlaps between sensor objects and all other shaped objects.
     * Returns start/end events by diffing current frame against previous.
     */
    detectOverlaps(objects: DynamicsObject[]): OverlapEvent[];
    /**
     * Reset overlap state (on engine stop, cell change, etc.)
     */
    reset(): void;
}
