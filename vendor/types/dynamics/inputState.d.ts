/**
 * Input State
 *
 * Tracks held keys for continuous input detection.
 * Also handles touch/swipe for mobile - swipes simulate arrow key presses.
 * Pure TypeScript - attaches to document events but doesn't touch DOM rendering.
 */
export declare class InputState {
    private heldKeys;
    private attached;
    private prevGamepadButtons;
    private prevStickX;
    private prevStickY;
    private touchStartX;
    private touchStartY;
    private touchStartTime;
    private swipeKeyTimeout;
    private readonly SWIPE_THRESHOLD;
    private readonly SWIPE_MAX_TIME;
    private readonly SWIPE_KEY_DURATION;
    private handleKeyDown;
    private handleKeyUp;
    private handleTouchStart;
    private handleTouchEnd;
    /**
     * Simulate a key press for a short duration (for swipe → arrow key mapping)
     */
    private simulateKeyPress;
    /**
     * Start tracking input
     */
    attach(): void;
    /**
     * Stop tracking input
     */
    detach(): void;
    /**
     * Check if a key is currently held
     */
    isHeld(key: string): boolean;
    /**
     * Check if any of the given keys are held
     */
    isAnyHeld(keys: string[]): boolean;
    /**
     * Get all currently held keys
     */
    getHeldKeys(): Set<string>;
    /**
     * Clear all held keys (useful when losing focus)
     */
    clear(): void;
    private syntheticKeys;
    /**
     * Inject a synthetic key press (adds to heldKeys so dynamics engine sees it)
     */
    syntheticPress(key: string): void;
    /**
     * Inject a synthetic key release (removes from heldKeys only if not physically held)
     */
    syntheticRelease(key: string): void;
    /**
     * Get movement direction from gamepad left stick + d-pad.
     * Returns digital direction (0/1/-1 per axis) consistent with keyboard input.
     */
    getGamepadDirection(padIndex?: number, deadZone?: number): {
        x: number;
        y: number;
    };
    /**
     * Check if a gamepad button is currently pressed.
     */
    isGamepadButtonPressed(padIndex: number | undefined, buttonIndex: number): boolean;
    /**
     * Poll gamepad buttons and return edge transitions (press/release) since last poll.
     * Call once per frame. Returns empty array if no gamepad connected.
     */
    pollGamepadButtons(padIndex?: number): Array<{
        buttonIndex: number;
        pressed: boolean;
    }>;
    /**
     * Poll analog stick and return digital direction edges (cross dead zone = press, return to center = release).
     * Returns axis ('x'|'y') and digital value (-1, 0, 1). Caller maps to key names.
     */
    pollGamepadStick(padIndex?: number, deadZone?: number): Array<{
        axis: 'x' | 'y';
        value: number;
        prev: number;
    }>;
}
export declare const inputState: InputState;
