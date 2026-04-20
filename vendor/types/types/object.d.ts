/**
 * Object Types for Purl Studio
 *
 * Two distinct types:
 * - Prime: Atomic visual element (shape, text, line, grid)
 * - Component: Invisible container with children
 */
import type { ScriptBlock } from './cell';
import type { MovableConfig, JumpableConfig, InputType, InputBinding, ZoneConfig } from '../dynamics';
export interface DraggableConfig {
    once?: boolean;
    collision?: boolean;
    discrete?: boolean;
    occupy?: boolean;
}
export type DraggableValue = boolean | DraggableConfig;
export interface ObjectScripts {
    script?: string;
    scripts?: ScriptBlock[];
}
export type FillLayerType = 'color' | 'image' | 'gradient' | 'pattern' | 'noise' | 'innerShadow';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn';
export type ShapeFillPattern = 'dots' | 'grid' | 'lines' | 'diagonal' | 'cross';
interface FillLayerBase {
    id: string;
    type: FillLayerType;
    opacity: number;
    blendMode?: BlendMode;
}
export interface ColorFillLayer extends FillLayerBase {
    type: 'color';
    color: string;
}
export interface ImageFillLayer extends FillLayerBase {
    type: 'image';
    imageData: string;
    mode: 'fill' | 'fit' | 'stretch' | 'tile' | 'center';
    scale?: number;
    offsetX?: number;
    offsetY?: number;
    spriteColumns?: number;
    spriteRows?: number;
    spriteFrame?: number;
}
export interface GradientFillLayer extends FillLayerBase {
    type: 'gradient';
    gradientType: 'linear' | 'radial' | 'conic' | 'diamond';
    angle?: number;
    stops: Array<{
        color: string;
        position: number;
        opacity?: number;
    }>;
}
export interface PatternFillLayer extends FillLayerBase {
    type: 'pattern';
    pattern: ShapeFillPattern;
    color: string;
    scale: number;
    weight?: number;
}
export interface NoiseFillLayer extends FillLayerBase {
    type: 'noise';
    noiseType: 'fractalNoise' | 'turbulence';
    scale: number;
    intensity: number;
    monochrome: boolean;
}
export interface InnerShadowFillLayer extends FillLayerBase {
    type: 'innerShadow';
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
}
export type FillLayer = ColorFillLayer | ImageFillLayer | GradientFillLayer | PatternFillLayer | NoiseFillLayer | InnerShadowFillLayer;
export declare const DEFAULT_FILL_LAYER: ColorFillLayer;
/** Move to point (start new subpath) */
export interface PathMoveSegment {
    type: 'M';
    x: number;
    y: number;
}
/** Line to point */
export interface PathLineSegment {
    type: 'L';
    x: number;
    y: number;
}
/** Cubic bezier curve (two control points) */
export interface PathCubicSegment {
    type: 'C';
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    x: number;
    y: number;
}
/** Quadratic bezier curve (one control point) */
export interface PathQuadSegment {
    type: 'Q';
    cpx: number;
    cpy: number;
    x: number;
    y: number;
}
/** Close path (line back to start) */
export interface PathCloseSegment {
    type: 'Z';
}
export type PathSegment = PathMoveSegment | PathLineSegment | PathCubicSegment | PathQuadSegment | PathCloseSegment;
export interface StateGroup {
    name: string;
    states: string[];
    mode: 'tween' | 'frame';
    fps?: number;
    duration?: number;
    easing?: string;
}
export type ViewportAnchorPoint = 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
/** Anchor fraction mapping: [x, y] where 0=left/top, 0.5=center, 1=right/bottom */
export declare const ANCHOR_FRACTIONS: Record<ViewportAnchorPoint, [number, number]>;
export type PrimeType = 'text' | 'textbox' | 'shape' | 'line' | 'grid' | 'audio' | 'mask' | 'peg' | 'spring' | 'viewport' | 'anchor' | 'emitter' | 'ramp';
export type RampEdgeType = 'from' | 'to' | 'pass';
export interface RampEdgeConfig {
    top: RampEdgeType;
    bottom: RampEdgeType;
    left: RampEdgeType;
    right: RampEdgeType;
}
export type PegType = 'pin' | 'weld';
export type EmitterShape = 'circle' | 'rectangle';
export type EmitterSizeMode = 'contain' | 'area';
export type ParticleShape = 'circle' | 'square' | 'line';
export interface Prime {
    id: string;
    name: string;
    primeType: PrimeType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    visible: boolean;
    buildVisible?: boolean;
    template?: boolean;
    spawned?: boolean;
    pointerEvents?: 'auto' | 'none';
    movable?: MovableConfig;
    jumpable?: JumpableConfig;
    input?: InputType[];
    subject?: boolean;
    inputBinding?: InputBinding;
    draggable?: DraggableValue;
    blocking?: boolean | string | {
        affects: string[];
    };
    mass?: number;
    gravityScale?: number;
    windScale?: number;
    dragScale?: number;
    timeScale?: number;
    friction?: number;
    restitution?: number;
    oneWay?: boolean;
    sensor?: boolean | {
        affects: string[];
    };
    ghost?: boolean;
    pullable?: boolean;
    phase?: boolean | {
        affects: string[];
    };
    level?: number;
    rotatable?: boolean;
    follow?: {
        targetId: string;
        distance: number;
        avoid: boolean;
        pathfinding: boolean;
    };
    zone?: ZoneConfig;
    perspectiveX?: number;
    perspectiveY?: number;
    viewportAnchor?: ViewportAnchorPoint;
    scripts?: ObjectScripts;
    zIndex?: number;
    layerId?: string;
    layerOrder?: number;
    tags?: string[];
    libraryId?: string;
    content?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    textColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    textPadding?: number;
    lineHeight?: number;
    verticalAlign?: 'top' | 'center' | 'bottom';
    editable?: boolean;
    fillLayers?: FillLayer[];
    strokeWidth?: number;
    strokeColor?: string;
    strokeColor2?: string;
    strokeAlpha?: number;
    strokeAlpha2?: number;
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    shapeType?: 'circle' | 'ellipse' | 'polygon' | 'path';
    polygonPoints?: Array<{
        x: number;
        y: number;
    }>;
    pathSegments?: PathSegment[];
    pathLinkedHandles?: number[];
    cornerRadius?: number;
    cornerRadiusUnit?: 'px' | '%';
    inflate?: number;
    shadowX?: number;
    shadowY?: number;
    shadowBlur?: number;
    shadowSpread?: number;
    shadowColor?: string;
    glowBlur?: number;
    glowColor?: string;
    glowIntensity?: number;
    opacity?: number;
    blendMode?: BlendMode;
    trail?: boolean;
    trailLength?: number;
    trailOpacity?: number;
    trailColor?: string;
    trailScale?: number;
    trailWidth?: number;
    trailFade?: number;
    flipX?: boolean;
    flipY?: boolean;
    rotation?: number;
    pivot?: {
        x: number;
        y: number;
    };
    lineX1?: number;
    lineY1?: number;
    lineX2?: number;
    lineY2?: number;
    lineStartMarker?: 'none' | 'arrow' | 'circle' | 'square' | 'diamond';
    lineEndMarker?: 'none' | 'arrow' | 'circle' | 'square' | 'diamond';
    lineCap?: 'butt' | 'round' | 'square';
    arrowHead?: 'none' | 'start' | 'end' | 'both';
    audioType?: 'sfx' | 'dialog' | 'music' | 'ambient';
    src?: string;
    srcName?: string;
    volume?: number;
    loop?: boolean;
    autoplay?: boolean;
    extend?: boolean;
    startMarker?: number;
    duration?: number;
    buffered?: boolean;
    spatial?: boolean;
    spatialRange?: number;
    columns?: number;
    rows?: number;
    gridColor?: string;
    gridOpacity?: number;
    showLines?: boolean;
    showDots?: boolean;
    dotSize?: number;
    gridData?: (string | null)[][];
    maskResolution?: number;
    clipTag?: string;
    revealRadius?: number;
    revealFade?: number;
    revealNoise?: number;
    revealer?: boolean;
    revealerRadius?: number;
    revealerFade?: number;
    revealerNoise?: number;
    revealerShape?: 'circle' | 'rect';
    revealerRehide?: boolean;
    revealerRehideSpeed?: number;
    revealerRehideGrowth?: number;
    revealerRehideRate?: number;
    revealerRehideStopThreshold?: number;
    revealTags?: string[];
    snapToGrid?: string;
    pegType?: PegType;
    pegBodyA?: string;
    pegBodyB?: string;
    pegAnchorA?: {
        x: number;
        y: number;
    };
    pegAnchorB?: {
        x: number;
        y: number;
    };
    pegDamping?: number;
    pegBreakForce?: number;
    springPegA?: string;
    springPegB?: string;
    springStiffness?: number;
    springDamping?: number;
    springBreakForce?: number;
    rampFromLevel?: number;
    rampToLevel?: number;
    rampEdges?: RampEdgeConfig;
    emitterShape?: EmitterShape;
    emitterSizeMode?: EmitterSizeMode;
    emitterRate?: number;
    emitterBurst?: number;
    particleLifetime?: number;
    particleSpeedMin?: number;
    particleSpeedMax?: number;
    particleSpread?: number;
    particleShape?: ParticleShape;
    particleTrailLength?: number;
    particleSizeStart?: number;
    particleSizeEnd?: number;
    particleOpacityStart?: number;
    particleOpacityEnd?: number;
    particleColorA?: string;
    particleColorB?: string;
    particleColorEnd?: string;
    particleGravityX?: number;
    particleGravityY?: number;
    particleDrag?: number;
    emitterGlow?: number;
    emitterGlowSize?: number;
    emitterGlowFlicker?: number;
    referenceSnapshot?: Record<string, Partial<Prime>>;
    presets?: Array<{
        name: string;
        origin?: string;
        values: Record<string, Partial<Prime>>;
        snapshot?: Record<string, Partial<Prime>>;
    }>;
    state?: string;
    stateFormat?: number;
    spatialTracking?: Record<string, number | boolean>;
    stateGroups?: StateGroup[];
}
export interface Component {
    id: string;
    name: string;
    x: number;
    y: number;
    anchorX?: number;
    anchorY?: number;
    width: number;
    height: number;
    visible: boolean;
    buildVisible?: boolean;
    template?: boolean;
    spawned?: boolean;
    pointerEvents?: 'auto' | 'none';
    movable?: MovableConfig;
    jumpable?: JumpableConfig;
    input?: InputType[];
    subject?: boolean;
    inputBinding?: InputBinding;
    draggable?: DraggableValue;
    blocking?: boolean | string | {
        affects: string[];
    };
    mass?: number;
    gravityScale?: number;
    windScale?: number;
    dragScale?: number;
    timeScale?: number;
    friction?: number;
    restitution?: number;
    oneWay?: boolean;
    sensor?: boolean | {
        affects: string[];
    };
    ghost?: boolean;
    pullable?: boolean;
    phase?: boolean | {
        affects: string[];
    };
    level?: number;
    rotatable?: boolean;
    collisionDepth?: number;
    snapToGrid?: string;
    follow?: {
        targetId: string;
        distance: number;
        avoid: boolean;
        pathfinding: boolean;
    };
    zone?: ZoneConfig;
    perspectiveX?: number;
    perspectiveY?: number;
    viewportAnchor?: ViewportAnchorPoint;
    scripts?: ObjectScripts;
    zIndex?: number;
    rotation?: number;
    flipX?: boolean;
    flipY?: boolean;
    pivot?: {
        x: number;
        y: number;
    };
    opacity?: number;
    layerId?: string;
    layerOrder?: number;
    tags?: string[];
    libraryId?: string;
    children: CellObject[];
    referenceSnapshot?: Record<string, Partial<Prime>>;
    presets?: Array<{
        name: string;
        origin?: string;
        values: Record<string, Partial<Prime>>;
        snapshot?: Record<string, Partial<Prime>>;
    }>;
    state?: string;
    stateFormat?: number;
    spatialTracking?: Record<string, number | boolean>;
    stateGroups?: StateGroup[];
    exposedProperties?: Array<{
        childName: string;
        propertyName: string;
        displayName?: string;
    }>;
}
export type CellObject = Prime | Component;
export type ObjectType = PrimeType | 'component';
export declare function isComponent(obj: CellObject): obj is Component;
export declare function isPrime(obj: CellObject): obj is Prime;
export declare function isLine(obj: CellObject): boolean;
export declare function isGrid(obj: CellObject): boolean;
export declare function isAudio(obj: CellObject): boolean;
export declare function isMask(obj: CellObject): boolean;
export declare function isPeg(obj: CellObject): boolean;
export declare function isSpring(obj: CellObject): boolean;
export declare function isAnchor(obj: CellObject): boolean;
export declare function isEmitter(obj: CellObject): boolean;
export declare function isRamp(obj: CellObject): boolean;
export declare function hasSize(obj: CellObject): boolean;
export declare function hasText(obj: CellObject): boolean;
export declare function hasFill(obj: CellObject): boolean;
export declare function hasStroke(obj: CellObject): boolean;
export declare function hasShape(obj: CellObject): boolean;
export declare function isPolygon(obj: CellObject): boolean;
export declare function isPath(obj: CellObject): boolean;
export declare function isSvgShape(obj: CellObject): boolean;
export declare function hasCorners(obj: CellObject): boolean;
export declare function hasShadow(obj: CellObject): boolean;
export declare function hasGlow(obj: CellObject): boolean;
export declare function hasOpacity(obj: CellObject): boolean;
export declare function hasScripts(obj: CellObject): boolean;
export declare function hasParallax(obj: CellObject): boolean;
export type PropertyGroup = 'size' | 'text' | 'fill' | 'stroke' | 'shape' | 'corners' | 'shadow' | 'opacity' | 'parallax';
export declare const PROPERTY_GROUP_LABELS: Record<PropertyGroup, string>;
export declare function getObjectProperties(obj: CellObject): PropertyGroup[];
export declare function getAvailableProperties(obj: CellObject): PropertyGroup[];
export declare const DEFAULT_SIZE: {
    width: number;
    height: number;
};
export declare const DEFAULT_TEXT: {
    content: string;
    fontSize: number;
    textColor: string;
    textAlign: "center";
    textPadding: number;
};
export declare const DEFAULT_TEXTBOX: {
    content: string;
    fontSize: number;
    textColor: string;
    textAlign: "left";
    textPadding: number;
    lineHeight: number;
    verticalAlign: "top";
};
export declare const DEFAULT_FILL: {
    fillLayers: {
        id: string;
        type: "color";
        color: string;
        opacity: number;
    }[];
};
export declare const DEFAULT_STROKE: {
    strokeWidth: number;
    strokeColor: string;
    strokeStyle: "solid";
};
export declare const DEFAULT_SHAPE: {};
export declare const DEFAULT_CORNERS: {
    cornerRadius: number;
    cornerRadiusUnit: "px";
};
export declare const DEFAULT_SHADOW: {
    shadowX: number;
    shadowY: number;
    shadowBlur: number;
    shadowColor: string;
};
export declare const DEFAULT_OPACITY: {
    opacity: number;
};
export declare const DEFAULT_PARALLAX: {
    perspectiveX: number;
    perspectiveY: number;
};
export declare function getPropertyDefaults(prop: PropertyGroup): Partial<Prime>;
export declare function getAllObjects(objects: CellObject[]): CellObject[];
/** Like getAllObjects but excludes template objects (template: true) */
export declare function getRuntimeObjects(objects: CellObject[]): CellObject[];
export declare function findObjectById(objects: CellObject[], id: string): CellObject | undefined;
export declare function findParentComponent(objects: CellObject[], childId: string): Component | undefined;
/**
 * Get the selection target for an object click.
 * - At cell level (editingComponentId null): returns top-level object containing clicked object
 * - Editing a component: returns direct child of that component containing clicked object
 *
 * This ensures clicking inside a nested component selects that component (as a unit),
 * not the individual prime inside it.
 */
export declare function getSelectionTarget(objects: CellObject[], clickedObjectId: string, editingComponentId: string | null): string;
export declare function updateObjectInTree(objects: CellObject[], id: string, updates: Partial<CellObject>): CellObject[];
/**
 * Delete an object from the tree by ID. Returns a new array without the object.
 * Works recursively through component children.
 */
export declare function deleteObjectFromTree(objects: CellObject[], id: string): CellObject[];
/**
 * Clone an object with new IDs. For components, recursively clones children with new IDs.
 * @param obj Object to clone
 * @param generateId Function to generate new IDs
 * @returns Cloned object with new IDs
 */
export declare function cloneObjectWithNewIds(obj: CellObject, generateId: () => string): CellObject;
/**
 * Check if an object exists in the tree (at any nesting level)
 */
export declare function objectExistsInTree(objects: CellObject[], id: string): boolean;
/**
 * Get the path to an object (list of parent component IDs from root to parent)
 */
export declare function getObjectPath(objects: CellObject[], id: string): string[];
/**
 * Move an object into a component as a child.
 * - Removes object from its current location (top-level or another component)
 * - Adds it to the target component's children
 * - Converts coordinates to component-relative
 * - Expands component bounds if needed to fit the object
 * - Clears layerId (inherits from component)
 * Returns updated objects array and updated component.
 */
export declare function moveObjectIntoComponent(objects: CellObject[], objectId: string, targetComponentId: string): CellObject[];
/**
 * Move an object out of a component to top-level.
 * - Removes object from its parent component's children
 * - Adds it to the top-level objects array
 * - Converts coordinates from component-relative to cell-relative
 * - Sets layerId to match the component's layerId
 */
export declare function moveObjectOutOfComponent(objects: CellObject[], objectId: string): CellObject[];
export {};
