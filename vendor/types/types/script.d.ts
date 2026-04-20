export type Expression = LiteralExpr | GetExpr | PropertyAccessExpr | BinaryExpr | UnaryExpr | FunctionExpr | AggregateExpr | TagExpr | ArrayLiteralExpr | IndexAccessExpr | GridCellAccessExpr;
export interface LiteralExpr {
    type: 'literal';
    value: string | number | boolean;
}
export interface TagExpr {
    type: 'tag';
    name: string;
}
export interface ArrayLiteralExpr {
    type: 'array';
    elements: Expression[];
}
export interface IndexAccessExpr {
    type: 'index';
    array: Expression;
    index: Expression;
    property?: string;
}
export interface GridCellAccessExpr {
    type: 'grid-cell';
    gridName: string;
    x: Expression;
    y: Expression;
    property?: string;
}
export interface GetExpr {
    type: 'get';
    key: string;
}
export interface PropertyAccessExpr {
    type: 'property';
    cell?: string;
    object: string;
    property: string;
}
export interface BinaryExpr {
    type: 'binary';
    operator: '>' | '<' | '==' | '!=' | '>=' | '<=' | 'and' | 'or' | '+' | '-' | '*' | '/' | '%' | 'mod' | 'is';
    left: Expression;
    right: Expression;
}
export interface UnaryExpr {
    type: 'unary';
    operator: 'not' | '-';
    operand: Expression;
}
export interface FunctionExpr {
    type: 'function';
    name: string;
    args: Expression[];
}
export interface AggregateExpr {
    type: 'aggregate';
    mode: 'all' | 'any' | 'count';
    tag: string;
    tagIsVariable?: boolean;
    countOnly?: boolean;
    property: string;
    operator: '>' | '<' | '==' | '!=' | '>=' | '<=';
    value: Expression;
}
export interface SourceLocation {
    line: number;
}
export type Statement = GotoStatement | ShowStatement | HideStatement | WaitStatement | SyncStatement | SetStatement | SetPropertyStatement | SetStateStatement | EnableStatement | DisableStatement | SetGridCellDataStatement | ResetStatement | ResetScriptStatement | RestartStatement | IfStatement | ActionCallStatement | ShoutStatement | FirstStatement | ForeachStatement | RepeatStatement | LogStatement | OpenUrlStatement | AnimateStatement | StopAnimationStatement | AnimateGroupStatement | StopAnimateGroupStatement | CellTransitionStatement | ClearGridStatement | PostStatement | FetchStatement | SpawnStatement | DestroyStatement | ReturnStatement | BreakStatement | CopyStatement | PlayStatement | PauseStatement | JumpStatement | ImpulseStatement | ScreenshakeStatement | StopScreenshakeStatement | RevealStatement | RehideStatement | TransportStatement | MoveToStatement | SaveStatement | LoadStatement | DeleteSaveStatement | EndGameStatement | PressStatement | ReleaseStatement | AddTagStatement | RemoveTagStatement;
export type GotoTransition = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom';
export type GotoDirection = 'north' | 'east' | 'south' | 'west';
export type VisibilityTransition = 'fade' | 'slide-up' | 'slide-down' | 'scale';
export declare const DEFAULT_TRANSITION_DURATION = 300;
export interface TransitionConfig {
    type: string;
    duration: number;
    durationExpr?: Expression;
}
export interface GotoStatement {
    type: 'goto';
    target?: string;
    direction?: GotoDirection;
    resetLevel?: 'clean' | 'fresh';
    transition?: TransitionConfig;
    loc?: SourceLocation;
}
export interface ShowStatement {
    type: 'show';
    cell?: string;
    target: string;
    transition?: TransitionConfig;
    loc?: SourceLocation;
}
export interface HideStatement {
    type: 'hide';
    cell?: string;
    target: string;
    transition?: TransitionConfig;
    loc?: SourceLocation;
}
export interface WaitStatement {
    type: 'wait';
    duration?: number;
    durationExpr?: Expression;
    waitFor?: 'movement';
    waitTarget?: string;
    loc?: SourceLocation;
}
export interface SyncStatement {
    type: 'sync';
    loc?: SourceLocation;
}
export interface SetStatement {
    type: 'set';
    key: string;
    value: Expression;
    loc?: SourceLocation;
}
export interface SetPropertyStatement {
    type: 'set-property';
    cell?: string;
    object: string;
    property: string;
    value: Expression;
    duration?: Expression;
    easing?: string;
    zOrder?: {
        relation: 'above' | 'below';
        ref: string;
    };
    loc?: SourceLocation;
}
export interface SetStateStatement {
    type: 'set-state';
    cell?: string;
    object: string;
    value: Expression;
    modifiers: string[];
    duration?: Expression;
    easing?: string;
    rotationDirection?: 'cw' | 'ccw';
    loc?: SourceLocation;
}
export type CapabilityType = 'movable' | 'jumpable' | 'draggable' | 'keyboard' | 'click' | 'gamepad' | 'script' | 'subject' | 'follow' | 'zone' | 'blocking' | 'sensor' | 'phase';
export interface EnableStatement {
    type: 'enable';
    target: Expression;
    capability: CapabilityType;
    speed?: Expression;
    acceleration?: Expression;
    deceleration?: Expression;
    moveStyle?: 'teleport' | 'slide' | 'fade' | 'jump';
    axis?: 'x' | 'y' | 'forward';
    steerRate?: Expression;
    pathId?: Expression;
    pathReverse?: boolean;
    pathContactSpan?: Expression;
    faceTravel?: boolean;
    turnaround?: boolean;
    faceMovement?: boolean;
    traction?: boolean;
    stable?: boolean;
    dodge?: Expression;
    solid?: boolean;
    snapToGrid?: string;
    height?: Expression;
    keys?: string[];
    multiJump?: Expression;
    once?: boolean;
    collision?: boolean;
    discrete?: boolean;
    occupy?: boolean;
    followTarget?: Expression;
    followDistance?: Expression;
    followAvoid?: boolean;
    followPathfinding?: boolean;
    followDeadZone?: Expression;
    followArrival?: Expression;
    followDelay?: Expression;
    followCenter?: boolean;
    followRigid?: boolean;
    zoneGravity?: Expression;
    zoneWind?: Expression;
    zoneWindAngle?: Expression;
    zoneDrag?: Expression;
    zoneFlowX?: Expression;
    zoneFlowY?: Expression;
    zoneAffectTags?: string[];
    affectTags?: string[];
    loc?: SourceLocation;
}
export interface DisableStatement {
    type: 'disable';
    target: Expression;
    capability: CapabilityType;
    loc?: SourceLocation;
}
export interface SetGridCellDataStatement {
    type: 'set-grid-cell';
    gridName: string;
    x: Expression;
    y: Expression;
    property: string;
    value: Expression;
    duration?: Expression;
    easing?: string;
    loc?: SourceLocation;
}
export interface ClearGridStatement {
    type: 'clear-grid';
    gridName: string;
    x?: Expression;
    y?: Expression;
    loc?: SourceLocation;
}
export interface ResetStatement {
    type: 'reset';
    scope: 'visits' | 'session' | 'game' | 'all' | string;
    loc?: SourceLocation;
}
export interface RestartStatement {
    type: 'restart';
    scope?: 'cell';
    loc?: SourceLocation;
}
export interface EndGameStatement {
    type: 'endGame';
    loc?: SourceLocation;
}
export interface ResetScriptStatement {
    type: 'resetscript';
    loc?: SourceLocation;
}
export interface IfStatement {
    type: 'if';
    condition: Expression;
    then: Statement[];
    else?: Statement[];
    loc?: SourceLocation;
}
export interface ActionCallStatement {
    type: 'action-call';
    object: string;
    action: string;
    loc?: SourceLocation;
}
export interface ShoutStatement {
    type: 'shout';
    message: string;
    target?: string;
    params?: Record<string, Expression>;
    global?: boolean;
    loc?: SourceLocation;
}
export interface PressStatement {
    type: 'press';
    key: string;
    target?: string;
    loc?: SourceLocation;
}
export interface ReleaseStatement {
    type: 'release';
    key: string;
    target?: string;
    loc?: SourceLocation;
}
export interface AddTagStatement {
    type: 'add-tag';
    target: string;
    tag: string;
    loc?: SourceLocation;
}
export interface RemoveTagStatement {
    type: 'remove-tag';
    target: string;
    tag: string;
    loc?: SourceLocation;
}
export interface PostStatement {
    type: 'post';
    url: Expression;
    data: Record<string, Expression>;
    loc?: SourceLocation;
}
export interface FetchStatement {
    type: 'fetch';
    url: Expression;
    into: string;
    loc?: SourceLocation;
}
export interface SpawnStatement {
    type: 'spawn';
    templateName: string;
    templateNameExpr?: Expression;
    anchorName?: string;
    params?: Record<string, Expression>;
    loc?: SourceLocation;
}
export interface DestroyStatement {
    type: 'destroy';
    target: Expression;
    transition?: TransitionConfig;
    loc?: SourceLocation;
}
export interface ReturnStatement {
    type: 'return';
    loc?: SourceLocation;
}
export interface BreakStatement {
    type: 'break';
    loc?: SourceLocation;
}
export interface CopyStatement {
    type: 'copy';
    value: Expression;
    loc?: SourceLocation;
}
export interface PlayStatement {
    type: 'play';
    target: string;
    loop?: boolean;
    fadeIn?: number;
    loc?: SourceLocation;
}
export interface PauseStatement {
    type: 'pause';
    target: string;
    fadeOut?: number;
    loc?: SourceLocation;
}
export interface JumpStatement {
    type: 'jump';
    target: string;
    height?: Expression;
    loc?: SourceLocation;
}
export interface ImpulseStatement {
    type: 'impulse';
    target: string;
    vx: Expression;
    vy: Expression;
    loc?: SourceLocation;
}
export interface FirstStatement {
    type: 'first';
    tag: string;
    tagIsVariable?: boolean;
    property: string;
    operator: '>' | '<' | '==' | '!=' | '>=' | '<=';
    value: Expression;
    body: Statement[];
    else?: Statement[];
    loc?: SourceLocation;
}
export interface ForeachStatement {
    type: 'foreach';
    variable: string;
    array: Expression;
    body: Statement[];
    loc?: SourceLocation;
}
export interface RepeatStatement {
    type: 'repeat';
    count?: Expression;
    body: Statement[];
    loc?: SourceLocation;
}
export interface LogStatement {
    type: 'log';
    expressions: Expression[];
    loc?: SourceLocation;
}
export interface OpenUrlStatement {
    type: 'openUrl';
    url: Expression;
    newTab: boolean;
    loc?: SourceLocation;
}
export type AnimationType = 'shake' | 'vibrate' | 'pulse' | 'squeeze' | 'bounce' | 'spin' | 'glow';
export interface AnimateStatement {
    type: 'animate';
    animation: AnimationType;
    target: string;
    duration: number;
    durationExpr?: Expression;
    loop: boolean;
    params: {
        intensity?: number;
        scale?: number;
        direction?: 'horizontal' | 'vertical' | 'cw' | 'ccw';
        height?: number;
        color?: string;
        children?: boolean;
    };
    loc?: SourceLocation;
}
export interface StopAnimationStatement {
    type: 'stop-animation';
    target: string;
    animation?: AnimationType;
    fadeOut?: number;
    loc?: SourceLocation;
}
export interface ScreenshakeStatement {
    type: 'screenshake';
    duration: number;
    loop: boolean;
    intensityFrom: number;
    intensityTo: number;
    loc?: SourceLocation;
}
export interface StopScreenshakeStatement {
    type: 'stop-screenshake';
    loc?: SourceLocation;
}
export interface RevealStatement {
    type: 'reveal';
    target: string;
    x: Expression;
    y: Expression;
    radius?: Expression;
    fade?: Expression;
    loc?: SourceLocation;
}
export interface RehideStatement {
    type: 'rehide';
    target: string;
    revealer?: string;
    loc?: SourceLocation;
}
export interface TransportStatement {
    type: 'transport';
    target: string;
    x: Expression;
    y: Expression;
    duration: Expression;
    easing?: string;
    loc?: SourceLocation;
}
export interface MoveToStatement {
    type: 'moveTo';
    target: string;
    x: Expression;
    y: Expression;
    destination?: string;
    destinationExpr?: Expression;
    loc?: SourceLocation;
}
export interface SaveStatement {
    type: 'save';
    slotName: string;
    loc?: SourceLocation;
}
export interface LoadStatement {
    type: 'load';
    slotName: string;
    loc?: SourceLocation;
}
export interface DeleteSaveStatement {
    type: 'deletesave';
    slotName: string;
    loc?: SourceLocation;
}
export interface AnimateGroupStatement {
    type: 'animate-group';
    target: string;
    group: string;
    fps?: number;
    duration?: number;
    durationExpr?: Expression;
    easing?: string;
    playMode: 'loop' | 'once' | 'pingpong';
    rotationDirection?: 'cw' | 'ccw';
    resume?: boolean;
    exclusive?: boolean;
    reverse?: boolean;
    loc?: SourceLocation;
}
export interface StopAnimateGroupStatement {
    type: 'stop-animate-group';
    target: string;
    loc?: SourceLocation;
}
export interface CellTransitionStatement {
    type: 'cell-transition';
    transition: GotoTransition;
    duration: number;
    loc?: SourceLocation;
}
export interface ActiveAnimation {
    id: string;
    type: AnimationType;
    objectId: string;
    startTime: number;
    duration: number;
    loop: boolean;
    params: AnimateStatement['params'];
}
export interface Script {
    id: string;
    statements: Statement[];
}
export interface PropertyBinding {
    property: string;
    expression: Expression;
}
export type VariableScope = 'session' | 'game' | 'local';
export type ScriptValue = string | number | boolean | ScriptValue[] | {
    [key: string]: ScriptValue;
};
export interface ScopedVariables {
    session: Record<string, ScriptValue>;
    game: Record<string, ScriptValue>;
    local: Record<string, ScriptValue>;
}
export interface CameraState {
    offsetX: number;
    offsetY: number;
    targetOffsetX: number;
    targetOffsetY: number;
    followObjectId: string | null;
}
export declare const INITIAL_CAMERA_STATE: CameraState;
export interface GameState {
    variables: ScopedVariables;
    visitedCells: Set<string>;
    visitCounts: Record<string, number>;
    propertyOverrides: Record<string, ScriptValue>;
    clickIndices: Record<string, number>;
    gridCellData: Record<string, Record<string, ScriptValue>>;
    objectVariables?: Record<string, ScriptValue>;
    camera: CameraState;
}
export declare const INITIAL_GAME_STATE: GameState;
export declare function parseVariableKey(fullKey: string): {
    scope: VariableScope;
    key: string;
};
export declare const GOTO_TRANSITIONS: readonly ["fade", "slide-left", "slide-right", "slide-up", "slide-down", "zoom"];
export declare const VISIBILITY_TRANSITIONS: readonly ["fade", "slide-up", "slide-down", "scale", "typewriter", "word", "scramble", "redact"];
