/**
 * Camera Controller
 *
 * Handles camera positioning, subject following, and dead zone logic
 * for MxN cell scrolling in play mode.
 *
 * Pure TypeScript - renderer agnostic.
 */
import type { CameraConfig, CameraState, DynamicsObject } from './types';
export type CameraUpdateCallback = (offsetX: number, offsetY: number, followObjectId: string | null) => void;
export declare class CameraController {
    private config;
    private state;
    private initialized;
    private snapNextCenter;
    private subjectIds;
    private onUpdate;
    private onZoomChange;
    private userDragging;
    private followPaused;
    private zoomTween;
    private panTween;
    private tweeningSelf;
    /**
     * Set the callback for camera updates
     */
    setUpdateCallback(callback: CameraUpdateCallback | null): void;
    /**
     * Set the callback for zoom changes (fired when setConfig changes zoom)
     */
    setZoomChangeCallback(callback: ((zoom: number) => void) | null): void;
    /**
     * Configure camera parameters
     */
    setConfig(config: Partial<CameraConfig>): void;
    /**
     * Get current config
     */
    getConfig(): CameraConfig;
    /**
     * Start a smooth zoom tween
     */
    tweenZoom(target: number, durationMs: number, easingFn: (t: number) => number): void;
    /**
     * Start a smooth pan tween (for subject transitions)
     */
    tweenPan(toX: number, toY: number, durationMs: number, easingFn: (t: number) => number): void;
    /**
     * Tick tweens (call each frame from engine tick)
     */
    tickTweens(deltaTimeMs: number): void;
    /**
     * Reset camera to initial state
     */
    reset(): void;
    /**
     * Pause camera following (used during object drag)
     */
    pauseFollow(): void;
    /**
     * Resume camera following (used after object drag ends)
     */
    resumeFollow(): void;
    /**
     * Set initial camera offset directly (from cell.initialCamera)
     */
    setInitialOffset(offsetX: number, offsetY: number): void;
    /**
     * Get current camera state
     */
    getState(): CameraState;
    /**
     * Check if camera has been initialized
     */
    isInitialized(): boolean;
    /**
     * Update subject tracking from objects list
     */
    updateSubjects(objects: DynamicsObject[]): void;
    /**
     * Check if there are any subjects
     */
    hasSubjects(): boolean;
    /**
     * Start user-controlled camera drag
     * While dragging, automatic subject following is paused
     */
    startUserDrag(): void;
    /**
     * Apply delta during user drag (in offset units)
     */
    applyUserDragDelta(deltaX: number, deltaY: number): void;
    /**
     * End user drag - recenter on subjects if any
     */
    endUserDrag(objects: DynamicsObject[]): void;
    /**
     * Check if user is currently dragging the camera
     */
    isUserDragging(): boolean;
    /**
     * Center camera on subjects
     * Called on first subject, when new subjects are added, or after user drag ends
     */
    centerOnSubjects(objects: DynamicsObject[]): void;
    /**
     * Update camera position based on subject positions
     *
     * Dead zone behavior:
     * - Dead zone is a centered region of the viewport where subjects can move freely
     * - When subject is inside dead zone: camera stays put
     * - When subject exits dead zone: camera follows to keep subject at the edge
     */
    update(objects: DynamicsObject[]): void;
}
