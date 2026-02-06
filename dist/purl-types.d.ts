/**
 * Purl file types - subset needed for MCP tools
 * Full spec: https://knowledge.purl.studio/fileformat.html
 */
export interface PurlProject {
    id: string;
    title: string;
    author: string;
    version: string;
    cells: PurlCell[];
    markers: PurlMarker[];
    settings?: GameSettings;
}
export interface PurlCell {
    id: string;
    label: string;
    position: {
        col: number;
        row: number;
    };
    size: {
        width: number;
        height: number;
    };
    interior: {
        objects: CellObject[];
        scripts?: {
            scripts: Script[];
        };
    };
    gravity?: number;
    wind?: number;
    windAngle?: number;
}
export interface PurlMarker {
    type: 'start' | 'finish';
    cellId: string;
}
export interface GameSettings {
    cameraAspectRatio?: number;
    cameraDeadZone?: number;
}
export interface Script {
    id: string;
    name: string;
    code: string;
    enabled: boolean;
}
export type CellObject = Prime | Component;
export interface BaseObject {
    id: string;
    name: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    visible: boolean;
    zIndex?: number;
    tags?: string[];
    scripts?: {
        scripts: Script[];
    };
    movable?: MovableConfig | boolean;
    jumpable?: JumpableConfig | boolean;
    draggable?: DraggableConfig | boolean;
    blocking?: boolean | string;
    sensor?: boolean;
    snapToGrid?: string;
    mass?: number;
    template?: boolean;
}
export interface Prime extends BaseObject {
    primeType: 'shape' | 'text' | 'button' | 'line' | 'grid';
    content?: string;
    columns?: number;
    rows?: number;
}
export interface Component extends BaseObject {
    children: CellObject[];
}
export interface MovableConfig {
    speed?: number;
    acceleration?: number;
    deceleration?: number;
    moveStyle?: 'teleport' | 'slide' | 'fade' | 'jump';
}
export interface JumpableConfig {
    height?: number;
    keys?: string[];
    multiJump?: number;
}
export interface DraggableConfig {
    once?: boolean;
    collision?: boolean;
    discrete?: boolean;
    occupy?: boolean;
}
export declare function isComponent(obj: CellObject): obj is Component;
export declare function isPrime(obj: CellObject): obj is Prime;
