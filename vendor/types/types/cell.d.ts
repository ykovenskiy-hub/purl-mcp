import type { CellObject, FillLayer } from './object';
export type { Prime, PrimeType, Component, CellObject, ObjectType, PropertyGroup, } from './object';
export { isComponent, isPrime, isLine, hasSize, hasText, hasFill, hasStroke, hasShape, hasCorners, hasShadow, hasOpacity, hasScripts, getObjectProperties, getAvailableProperties, getPropertyDefaults, getAllObjects, findObjectById, findParentComponent, updateObjectInTree, deleteObjectFromTree, cloneObjectWithNewIds, objectExistsInTree, getObjectPath, PROPERTY_GROUP_LABELS, DEFAULT_SIZE, DEFAULT_TEXT, DEFAULT_FILL, DEFAULT_STROKE, DEFAULT_SHAPE, DEFAULT_CORNERS, DEFAULT_SHADOW, DEFAULT_OPACITY, } from './object';
export type EdgeIndex = 0 | 1 | 2 | 3;
export declare const EDGE_LABELS: Record<EdgeIndex, string>;
export declare function getEdgeLabel(edge: EdgeIndex): string;
export interface ElementScripts {
    script?: string;
}
export declare const DEFAULT_CELL_COLOR = "#4b5563";
export type BackgroundPattern = 'none' | 'stripes-h' | 'stripes-v' | 'stripes-d1' | 'stripes-d2' | 'grid' | 'dots' | 'crosshatch' | 'bricks' | 'stone';
export declare const ALL_BACKGROUND_PATTERNS: BackgroundPattern[];
export declare const BACKGROUND_PATTERN_LABELS: Record<BackgroundPattern, string>;
export interface BackgroundStyle {
    fillLayers: FillLayer[];
    pattern: BackgroundPattern;
    patternColor: string;
    patternScale: number;
}
export interface CellVisuals {
    background: BackgroundStyle;
}
export declare const DEFAULT_BACKGROUND_STYLE: BackgroundStyle;
export declare const DEFAULT_CELL_VISUALS: CellVisuals;
export interface CellSize {
    width: number;
    height: number;
}
export declare const DEFAULT_CELL_SIZE: CellSize;
export declare const DEFAULT_INITIAL_CAMERA: {
    x: number;
    y: number;
    zoom: number;
};
export interface Cell {
    id: string;
    label: string;
    position: {
        col: number;
        row: number;
    };
    rotation: number;
    size: CellSize;
    visuals: CellVisuals;
    interior: CellInterior;
    tags?: string[];
    gravity?: number;
    wind?: number;
    windAngle?: number;
    airResistance?: number;
    timeScale?: number;
    gravityCenter?: {
        x: number;
        y: number;
    };
    perspectiveX?: number;
    perspectiveY?: number;
    canvasDraggable?: boolean;
    freshStart?: boolean;
    initialCamera: {
        x: number;
        y: number;
        zoom: number;
    };
}
export interface ScriptBlock {
    id: string;
    name: string;
    code: string;
    enabled?: boolean;
    syncId?: string;
}
export interface CellScripts {
    script?: string;
    scripts?: ScriptBlock[];
}
export declare function getCombinedScript(scripts: CellScripts | undefined): string | undefined;
export declare function hasScriptContent(scripts: CellScripts | undefined): boolean;
export interface Layer {
    id: string;
    name: string;
    layerId?: string;
    zIndex?: number;
    buildVisible?: boolean;
    locked?: boolean;
    color?: string;
}
export interface CellInterior {
    objects: CellObject[];
    scripts?: CellScripts;
    layers?: Layer[];
}
/** @deprecated Use Prime instead - kept for migration of old projects */
export interface LegacyMechanismBase {
    id: string;
    type: string;
    name: string;
    x: number;
    y: number;
    visible: boolean;
}
/** @deprecated Use Prime with primeType: 'text' instead */
export interface LegacyTextMechanism extends LegacyMechanismBase {
    type: 'text';
    content: string;
    fontSize: number;
    color: string;
    align: 'left' | 'center' | 'right';
    scripts?: ElementScripts;
}
/** @deprecated Kept for migration of old projects */
export type LegacyMechanism = LegacyTextMechanism;
export type MarkerType = 'start' | 'finish';
export interface Marker {
    type: MarkerType;
    cellId: string;
    showInPlayMode: boolean;
}
export type AspectRatioPreset = '21:9' | '16:9' | '3:2' | '4:3' | '1:1' | '3:4' | '2:3' | '9:16' | '9:21';
export declare const ASPECT_RATIO_VALUES: Record<AspectRatioPreset, number>;
export declare const ASPECT_RATIO_LABELS: Record<AspectRatioPreset, string>;
export type FullscreenMode = 'button' | 'auto' | 'disabled';
export declare const FULLSCREEN_MODE_LABELS: Record<FullscreenMode, string>;
export declare const FULLSCREEN_MODE_DESCRIPTIONS: Record<FullscreenMode, string>;
export interface GameSettings {
    letterboxColor: string;
    fullscreenMode: FullscreenMode;
    cameraDeadZone: number;
    cameraAspectRatio: number;
    cameraSubjectTransition?: number;
    autoSave?: boolean;
    debugConsole?: boolean;
}
export declare const DEFAULT_GAME_SETTINGS: GameSettings;
export interface Project {
    id: string;
    title: string;
    author: string;
    description?: string;
    thumbnail?: string;
    gameVersion?: string;
    version: string;
    createdAt: number;
    updatedAt: number;
    cells: Cell[];
    markers: Marker[];
    settings?: GameSettings;
    filename?: string;
    source?: 'local' | 'url' | 'new';
    sourceUrl?: string;
}
export type EditorView = 'map' | 'block';
export type EditorTheme = 'light' | 'dark';
export interface EditorColors {
    connectionMarker: string;
    connectionSelected: string;
    mapBackground: string;
    cellDefault: string;
    accent: string;
    toolbarBackground: string;
    panelBackground: string;
    uiBackground: string;
    uiHover: string;
    uiText: string;
    uiTextMuted: string;
    uiBorder: string;
}
export declare const DARK_THEME_COLORS: EditorColors;
export declare const LIGHT_THEME_COLORS: EditorColors;
export declare const DEFAULT_EDITOR_COLORS: EditorColors;
export declare function getThemeColors(theme: EditorTheme): EditorColors;
export interface ViewportState {
    zoom: number;
    panX: number;
    panY: number;
    scrollX?: number;
    scrollY?: number;
}
/**
 * Camera defines what portion of the coordinate space is visible.
 *
 * In the unified coordinate system:
 * - Cells are always 1×1 square in coordinate space
 * - NxM cells = coordinates (0,0) to (N,M)
 * - Camera aspect ratio defines the viewport shape (16:9, 4:3, etc.)
 * - Camera position and zoom define what's visible
 *
 * At 100% zoom with 16:9 aspect ratio, approximately 1.78×1 units are visible.
 */
export interface Camera {
    x: number;
    y: number;
    zoom: number;
    aspectRatio: number;
}
export declare const DEFAULT_CAMERA: Camera;
export declare const CAMERA_ASPECT_RATIOS: Record<AspectRatioPreset, number>;
/**
 * Calculate the visible viewport rectangle for a camera.
 * Returns the min/max coordinates visible in the camera's view.
 */
export declare function getCameraViewport(camera: Camera): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};
export interface ClipboardState {
    objectCount: number;
    hasStyle: boolean;
    hasScript: boolean;
    label: string | null;
}
export type BuildGridSize = 4 | 10 | 20 | 40;
export interface BuildGrid {
    visible: boolean;
    size: BuildGridSize;
}
export type StructureViewMode = 'immediate' | 'full';
export type PanelPosition = 'left' | 'right';
export interface EditorState {
    mode: 'build' | 'play';
    view: EditorView;
    currentCellId: string | null;
    selectedObjectIds: string[];
    viewport: ViewportState;
    cellViewports: Record<string, ViewportState>;
    theme: EditorTheme;
    autoHideMenubar: boolean;
    colors: EditorColors;
    panelMode: 'both' | 'properties' | 'structure' | 'none';
    structureViewMode: StructureViewMode;
    structurePanelPosition: PanelPosition;
    propertiesPanelPosition: PanelPosition;
    editingComponentId: string | null;
    enteredComponentId: string | null;
    selectedLayerId: string | null;
    workingLayerId: string | null;
    centerViewRequest: number;
    clipboard: ClipboardState;
    buildGrid: BuildGrid;
    camera: Camera;
    showCameraOverlay: boolean;
    showCollisionOverlay: boolean;
    showComponentIndicators: boolean;
    dirty: boolean;
    collapsedLayers: Record<string, string[]>;
    autoCollapseStructure: boolean;
    projectOpen: boolean;
    _savedBuildAspectRatio?: number;
}
export declare const EDGE_COUNT = 4;
