/**
 * Dynamics Types
 *
 * Pure TypeScript types for the dynamics engine.
 * No React/DOM dependencies - renderer agnostic.
 */
import type { CollisionShape } from '../utils/collisionShapes';
export type InputType = 'keyboard' | 'click' | 'gamepad' | 'script';
export interface InputBinding {
    player?: 1 | 2;
    keys?: KeyMapping;
    pad?: PadMapping;
    padIndex?: number;
    deadZone?: number;
}
export declare const GAMEPAD_BUTTONS: {
    readonly A: 0;
    readonly B: 1;
    readonly X: 2;
    readonly Y: 3;
    readonly DPAD_UP: 12;
    readonly DPAD_DOWN: 13;
    readonly DPAD_LEFT: 14;
    readonly DPAD_RIGHT: 15;
};
export declare const DEFAULT_PLAYER_KEYS: Record<1 | 2, KeyMapping>;
export declare const DEFAULT_PAD_MAPPING: PadMapping;
export interface DynamicsObject {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    pivot?: {
        x: number;
        y: number;
    };
    rotation?: number;
    collisionShape?: CollisionShape;
    collisionShapeOriginX?: number;
    collisionShapeOriginY?: number;
    parentOriginRotation?: number;
    mass?: number;
    gravityScale?: number;
    windScale?: number;
    dragScale?: number;
    timeScale?: number;
    movable?: MovableConfig;
    jumpable?: JumpableConfig;
    input?: InputType[];
    subject?: boolean;
    inputBinding?: InputBinding;
    snapToGrid?: string;
    blocking?: boolean | string | {
        affects: string[];
    };
    friction?: number;
    restitution?: number;
    oneWay?: boolean;
    sensor?: boolean | {
        affects: string[];
    };
    ghost?: boolean;
    visible?: boolean;
    pullable?: boolean;
    phase?: boolean | {
        affects: string[];
    };
    level?: number;
    rotatable?: boolean;
    props?: Record<string, string | number | boolean>;
    follow?: {
        targetId: string;
        distance: number;
        avoid: boolean;
        pathfinding: boolean;
        deadZone?: number;
        arrival?: number;
        delay?: number;
        delayRemaining?: number;
        center?: boolean;
        rigid?: boolean;
    };
    initialVelocityX?: number;
    initialVelocityY?: number;
    zone?: ZoneConfig;
    ramp?: RampConfig;
    parentComponentId?: string;
    dodgeWidth?: number;
    dodgeHeight?: number;
    tags?: string[];
    pathPolyline?: Array<{
        x: number;
        y: number;
    }>;
    pathClosed?: boolean;
    pathId?: string;
    visualOnly?: boolean;
    rampDualLevel?: {
        fromLevel: number;
        toLevel: number;
    };
    rampScaleT?: number;
}
export interface ZoneConfig {
    enabled?: boolean;
    gravity?: number;
    wind?: number;
    windAngle?: number;
    drag?: number;
    flowX?: number;
    flowY?: number;
    gravityCenter?: {
        x: number;
        y: number;
    };
    affectTags?: string[];
}
export type RampEdgeType = 'from' | 'to' | 'pass';
export interface RampConfig {
    fromLevel: number;
    toLevel: number;
    edges: {
        top: RampEdgeType;
        bottom: RampEdgeType;
        left: RampEdgeType;
        right: RampEdgeType;
    };
}
export interface MovableConfig {
    speed: number;
    acceleration?: number;
    deceleration?: number;
    moveStyle?: 'teleport' | 'slide' | 'fade' | 'jump';
    axis?: 'x' | 'y' | 'forward';
    steerRate?: number;
    traction?: boolean;
    stable?: boolean;
    dodge?: number;
    pathName?: string;
    pathReverse?: boolean;
    pathContactSpan?: number;
    faceTravel?: boolean;
    turnaround?: boolean;
    faceMovement?: boolean;
    keys?: KeyMapping;
}
export interface JumpableConfig {
    height: number;
    keys?: string[];
    multiJump?: number;
}
export interface KeyMapping {
    up: string[];
    down: string[];
    left: string[];
    right: string[];
    jump: string[];
    pull: string[];
}
export interface PadMapping {
    up: string[];
    down: string[];
    left: string[];
    right: string[];
    jump: string[];
    pull: string[];
}
export declare const DEFAULT_KEY_MAPPING: KeyMapping;
export interface MovementState {
    moving: boolean;
    velocityX: number;
    velocityY: number;
    direction: 'up' | 'down' | 'left' | 'right' | 'none';
    cellX?: number;
    cellY?: number;
    animating?: boolean;
    opacity?: number;
    scale?: number;
    angularVelocity?: number;
}
export interface StateUpdate {
    id: string;
    x?: number;
    y?: number;
    rotation?: number;
    level?: number;
    movementState?: MovementState;
}
export interface GridConfig {
    geometry: 'cartesian' | 'isometric' | 'hex';
    columns: number;
    rows: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    gravity?: number;
    wind?: number;
    windAngle?: number;
    drag?: number;
    timeScale?: number;
    gravityCenter?: {
        x: number;
        y: number;
    };
    snapToCell?: boolean;
}
export type PegConstraintType = 'pin' | 'weld' | 'rod' | 'spring';
export interface PegConstraintDef {
    id: string;
    bodyAId: string;
    bodyBId: string | null;
    anchorA: {
        x: number;
        y: number;
    };
    anchorB: {
        x: number;
        y: number;
    };
    type: PegConstraintType;
    stiffness: number;
    damping: number;
    breakForce?: number;
    worldAnchorX?: number;
    worldAnchorY?: number;
    restLength?: number;
    restAngle?: number;
    weldA?: boolean;
    weldB?: boolean;
}
export interface PegBreakEvent {
    pegId: string;
    bodyAId: string;
    bodyBId: string | null;
    force: number;
}
export interface OverlapEvent {
    type: 'start' | 'end';
    objectA: string;
    objectB: string;
}
export interface CollideEvent {
    moverId: string;
    blockerId: string;
}
export interface MoveEvent {
    type: 'move' | 'stop' | 'arrive' | 'jump' | 'land' | 'rotate' | 'stopRotate';
    objectId: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward';
    angle?: number;
    rotationDirection?: 'cw' | 'ccw';
}
export interface BoundsEvent {
    objectId: string;
    boundary: 'left' | 'right' | 'top' | 'bottom';
}
export interface DynamicsCallbacks {
    onStateUpdate: (updates: StateUpdate[]) => void;
    onCameraUpdate?: (offsetX: number, offsetY: number, followObjectId: string | null) => void;
    onCameraZoomChange?: (zoom: number) => void;
    onOverlapChange?: (events: OverlapEvent[]) => void;
    onCollide?: (events: CollideEvent[]) => void;
    onMoveChange?: (events: MoveEvent[]) => void;
    onBoundsChange?: (events: BoundsEvent[]) => void;
    /** Called when a peg constraint breaks (force exceeded breakForce). */
    onPegBreak?: (events: PegBreakEvent[]) => void;
    /** Called each physics tick for objects with onTick handlers. Raw (unscaled) deltaTime + cell timeScale. */
    onTick?: (deltaTime: number, cellTimeScale: number) => void;
    /** Called after all physics + events are processed, before next frame. Used for animation tick. Raw deltaTime + cell timeScale. */
    onPostPhysics?: (deltaTime: number, cellTimeScale: number) => void;
    /** Check if a property is locked by animation (dynamics should skip processing it). */
    isPropertyLocked?: (objectId: string, property: string) => boolean;
    /** Read current position/rotation from RuntimeStore for animation-driven objects. */
    getObjectPosition?: (objectId: string) => {
        x: number;
        y: number;
        rotation: number;
    } | undefined;
}
export interface CameraConfig {
    cellWidth: number;
    cellHeight: number;
    deadZone: number;
    viewportAspectRatio: number;
    zoom: number;
    subjectTransition?: number;
}
export interface CameraState {
    offsetX: number;
    offsetY: number;
    targetOffsetX: number;
    targetOffsetY: number;
    followObjectId: string | null;
}
