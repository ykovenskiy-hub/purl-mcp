/**
 * Dynamics Engine
 *
 * Main coordinator for the dynamics system.
 * Runs the frame loop, processes all movable objects, outputs state updates.
 *
 * Pure TypeScript - renderer agnostic.
 */
import type { DynamicsObject, GridConfig, DynamicsCallbacks, CameraConfig, CameraState, PegConstraintDef } from './types';
import type { EasingFunction } from '../utils/interpolate';
import type { Point } from '../utils/collisionShapes';
export declare class DynamicsEngine {
    private objects;
    private objectsById;
    private grids;
    private callbacks;
    private running;
    private camera;
    private overlapTracker;
    private spatialGrid;
    private blockingCount;
    private zoneObjects;
    private constraints;
    private constraintDefs;
    private pathConstraints;
    private transportTargets;
    /**
     * Start the dynamics engine
     */
    start(callbacks: DynamicsCallbacks): void;
    /**
     * Stop the dynamics engine
     */
    stop(): void;
    /**
     * Populate the spatial grid with all blocking objects
     */
    private populateSpatialGrid;
    /**
     * Update a single object's position in the spatial grid
     */
    private updateObjectInGrid;
    /**
     * Sync animation-driven objects: read current positions from RuntimeStore
     * and update internal state + spatial grid for any object that moved.
     * Covers both directly animated objects (locked) and their children
     * (moved by component cascade in RuntimeStore but not in dynamics engine).
     */
    private syncAnimatedObjects;
    /**
     * Check if engine is running
     */
    isRunning(): boolean;
    /**
     * Set up engine for testing without starting frame loop or input.
     * Use with testTick() to run physics in unit tests.
     */
    testInit(callbacks: DynamicsCallbacks): void;
    /**
     * Execute one physics tick with explicit delta time.
     * Calls the real tick() — exercises full engine path.
     */
    testTick(deltaTime: number): void;
    /**
     * Configure camera for MxN cell scrolling
     */
    setCameraConfig(config: Partial<CameraConfig>): void;
    /**
     * Reset camera to initial state (called on cell enter)
     */
    resetCamera(): void;
    /**
     * Set initial camera offset directly
     */
    setInitialCameraOffset(offsetX: number, offsetY: number): void;
    /**
     * Get current camera state
     */
    getCameraState(): CameraState;
    /**
     * Get current camera config
     */
    getCameraConfig(): CameraConfig;
    /**
     * Start a smooth camera zoom tween
     */
    tweenCameraZoom(target: number, durationMs: number, easingFn: (t: number) => number): void;
    /**
     * Start user-controlled camera drag
     */
    startCameraDrag(): void;
    /**
     * Apply delta during user camera drag (in offset units)
     */
    applyCameraDragDelta(deltaX: number, deltaY: number): void;
    /**
     * End user camera drag - recenters on subjects if any
     */
    endCameraDrag(): void;
    /**
     * Pause camera following (during object drag)
     */
    pauseCameraFollow(): void;
    /**
     * Resume camera following (after object drag)
     */
    resumeCameraFollow(): void;
    /**
     * Update the list of objects to process
     */
    setObjects(objects: DynamicsObject[]): void;
    /**
     * Add a single object to the engine.
     * Called by spawn notification callback for immediate updates.
     */
    addObject(obj: DynamicsObject): void;
    /**
     * Remove an object from the engine.
     * Called by destroy notification callback for immediate updates.
     */
    removeObject(objectId: string): void;
    /**
     * Replace an object's collision shape (e.g. after width/height change from state).
     */
    updateCollisionShape(objectId: string, shape: import('../utils/collisionShapes').CollisionShape | undefined): void;
    /**
     * Check if an object is tracked by the dynamics engine.
     * Used by animation engine to skip position writes for physics objects.
     */
    hasObject(objectId: string): boolean;
    /**
     * Find the zone containing a point. If multiple zones contain the point,
     * the smallest (by area) wins. Returns null if no zone contains the point.
     */
    private findContainingZone;
    /**
     * Update a single property on an object.
     * Called by property change notification callback.
     * Returns true if the property was handled (is physics-relevant).
     */
    updateObjectProperty(objectId: string, property: string, value: unknown): boolean;
    /**
     * Add or update a peg constraint definition.
     * Rebuilds the active constraint for this peg.
     */
    addConstraint(def: PegConstraintDef): void;
    /**
     * Remove a peg constraint.
     */
    removeConstraint(pegId: string): void;
    /**
     * Rebuild active constraints from definitions.
     * Resolves body references from current objects.
     */
    private rebuildConstraints;
    /**
     * Set all constraint definitions at once (called on play start).
     */
    setConstraints(defs: PegConstraintDef[]): void;
    /**
     * Merge new objects while preserving positions of existing ones
     */
    mergeObjects(objects: DynamicsObject[]): void;
    /**
     * Update the grid configuration (legacy single grid)
     * @deprecated Use setGrids() for grid-as-object architecture
     */
    setGrid(grid: GridConfig | null): void;
    /**
     * Update the grids map (grid-as-object architecture)
     */
    setGrids(grids: Map<string, GridConfig>): void;
    /**
     * Get grid by ID
     */
    getGrid(gridId: string): GridConfig | undefined;
    /**
     * Set an object's position directly (for teleportation, etc.)
     * This updates the internal state and clears momentum.
     */
    setPosition(objectId: string, x: number, y: number): boolean;
    /** Set resolved world-space path points for path-constrained movement */
    setPathConstraint(objectId: string, points: {
        x: number;
        y: number;
    }[]): void;
    /** Remove path constraint for an object */
    clearPathConstraint(objectId: string): void;
    /** Project a position onto a stored path constraint. Returns original if no constraint. */
    constrainToPath(objectId: string, x: number, y: number): {
        x: number;
        y: number;
    };
    /**
     * Wake any sleeping movable objects near a moved object's old or new position.
     * This handles the case where a blocker is dragged away from resting objects.
     */
    private wakeNearbySleepers;
    /**
     * Mark an object as being dragged — skips physics and grid snap.
     */
    startObjectDrag(objectId: string, grabOffsetX?: number, grabOffsetY?: number): void;
    /**
     * Cancel a drag without snapping or callbacks — just reset the drag flag.
     * Used when onDragStart script returns early to reject the drag.
     */
    cancelObjectDrag(objectId: string): void;
    /**
     * Mark drag ended — if on a grid, snap to nearest valid cell.
     * Returns true if drop succeeded, false if rejected (occupy mode).
     */
    endObjectDrag(objectId: string, options?: {
        occupy?: boolean;
    }): boolean;
    /**
     * Get an object's current position from the engine
     */
    getPosition(objectId: string): {
        x: number;
        y: number;
    } | null;
    /**
     * Set click-to-move target for a specific object
     */
    setClickTarget(objectId: string, x: number, y: number): void;
    /**
     * Clear click-to-move target for a specific object
     */
    clearClickTarget(objectId: string): void;
    /**
     * Trigger a jump impulse on an object (from script `jump` action).
     * Bypasses input gating and multiJump counter — designer explicitly triggers it.
     */
    triggerJump(objectId: string, heightOverride?: number): boolean;
    /**
     * Add velocity to an object (from script `impulse` action).
     * Additive — accumulates with existing velocity.
     */
    triggerImpulse(objectId: string, vx: number, vy: number): boolean;
    /**
     * Test if two objects' collision shapes intersect (synchronous SAT check).
     * Used by the intersects() script function.
     */
    testObjectIntersection(id1: string, id2: string): boolean;
    /**
     * Set click-to-move target for ALL objects with input: 'click'
     */
    setClickTargetForAll(x: number, y: number): void;
    /**
     * Set a click-to-move target from script (moveTo command).
     * Works even if the object doesn't have input: 'click' — continuous.ts
     * checks for existing click targets as a fallback.
     */
    setMoveToTarget(objectId: string, x: number, y: number): void;
    /**
     * Start a transport: smoothly move object to (x, y) over duration seconds.
     * Bypasses physics during transit. Replaces any in-flight transport.
     */
    setTransportTarget(id: string, x: number, y: number, duration: number, easing: EasingFunction): void;
    /**
     * Cancel an in-flight transport (object stays at current position).
     */
    clearTransportTarget(id: string): void;
    /**
     * Check if an object has an active transport.
     */
    hasTransportTarget(id: string): boolean;
    /**
     * Set an object's cell position (for grid-snapped objects)
     */
    setCellPosition(objectId: string, cellX: number, cellY: number, gridId?: string): {
        x: number;
        y: number;
    } | null;
    /**
     * Main tick - called every frame
     */
    private tick;
    /**
     * Set rotation directly (used when animation releases rotation lock).
     * Zeroes angular velocity to prevent residual spin.
     */
    setRotation(objectId: string, rotation: number): boolean;
    /**
     * Snapshot all object positions, rotations, and velocities for save.
     */
    snapshotState(): Record<string, {
        x: number;
        y: number;
        rotation: number;
        vx: number;
        vy: number;
        av: number;
    }>;
    /**
     * Restore object positions, rotations, and velocities from save.
     * Directly writes state without side effects (no waking sleepers, no canceling transports).
     */
    restoreStates(states: Record<string, {
        x: number;
        y: number;
        rotation: number;
        vx: number;
        vy: number;
        av: number;
    }>): void;
    /**
     * Get collision shapes in world space for debug visualization.
     */
    getDebugCollisionShapes(): Array<{
        id: string;
        vertices: Point[];
        blocking: boolean;
        movable: boolean;
    }>;
}
export declare const dynamicsEngine: DynamicsEngine;
