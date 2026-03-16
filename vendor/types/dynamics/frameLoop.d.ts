/**
 * Frame Loop
 *
 * Core animation loop using requestAnimationFrame.
 * Calls tick function at ~60fps with delta time.
 */
export type TickCallback = (deltaTime: number) => void;
export declare function getFrameLoopStats(): {
    tickCount: number;
    avgTickTime: number;
    maxTickTime: number;
};
export declare function resetFrameLoopStats(): void;
export declare class FrameLoop {
    private running;
    private frozen;
    private lastTimestamp;
    private animationFrameId;
    private tickCallback;
    private visibilityHandler;
    /**
     * Start the frame loop
     */
    start(onTick: TickCallback): void;
    /**
     * Stop the frame loop
     */
    stop(): void;
    /**
     * Check if loop is running
     */
    isRunning(): boolean;
    /**
     * Freeze the loop (stop ticking but remain "running")
     */
    private freeze;
    /**
     * Unfreeze the loop (resume ticking)
     */
    private unfreeze;
    private scheduleNextFrame;
    private tick;
}
export declare const frameLoop: FrameLoop;
