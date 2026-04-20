/**
 * Spatial Hash Grid
 *
 * Divides 2D space into fixed-size cells for efficient broad-phase collision detection.
 * Objects are stored in all cells their AABB overlaps.
 *
 * Performance: O(1) insert/remove/query for typical cases.
 * Memory: Sparse representation — only occupied cells are stored.
 */
export interface AABB {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
/**
 * Spatial hash grid for broad-phase collision detection.
 */
export declare class SpatialGrid {
    private cellSize;
    private invCellSize;
    private cells;
    private objectCells;
    constructor(cellSize?: number);
    /**
     * Get cell key from cell coordinates
     */
    private cellKey;
    /**
     * Get cell coordinates from world position
     */
    private getCellCoords;
    /**
     * Get all cell keys that an AABB overlaps
     */
    private getCellsForAABB;
    /**
     * Insert an object into the grid
     */
    insert(id: string, aabb: AABB): void;
    /**
     * Remove an object from the grid
     */
    remove(id: string): void;
    /**
     * Update an object's position in the grid
     */
    update(id: string, aabb: AABB): void;
    /**
     * Query all objects whose AABBs overlap the given region.
     * Returns unique object IDs (no duplicates from multi-cell objects).
     */
    query(aabb: AABB): string[];
    /**
     * Query objects in a specific set of cell keys.
     * Used by DDA path tracing.
     */
    queryByCellKeys(cellKeys: string[]): string[];
    /**
     * Get cell keys along a line from (x0,y0) to (x1,y1) using DDA algorithm.
     * Returns all cells the line passes through in order.
     */
    getCellsAlongPath(x0: number, y0: number, x1: number, y1: number): string[];
    /**
     * Query all objects within a radius of a point.
     * Uses AABB broad-phase then distance check for circular accuracy.
     * Returns unique object IDs sorted by distance.
     */
    queryRadius(x: number, y: number, radius: number, excludeId?: string): Array<{
        id: string;
        distance: number;
        aabb: AABB;
    }>;
    /**
     * Check if two AABBs overlap
     */
    private aabbOverlap;
    /**
     * Clear all objects from the grid
     */
    clear(): void;
    /**
     * Get the current cell size
     */
    getCellSize(): number;
    /**
     * Get statistics for debugging
     */
    getStats(): {
        objectCount: number;
        cellCount: number;
        avgObjectsPerCell: number;
    };
}
