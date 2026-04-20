/**
 * Check line of sight between two grid cells using Bresenham's line algorithm.
 * Returns true if no blocked cell exists between (x0,y0) and (x1,y1).
 * Start and end cells are NOT checked — only intermediate cells.
 */
export declare function bresenhamLineOfSight(x0: number, y0: number, x1: number, y1: number, isBlocked: (x: number, y: number) => boolean): boolean;
/**
 * A* pathfinding on a grid. Returns waypoint array (excluding start, including goal).
 * Returns empty array if no path exists.
 * Uses Manhattan distance heuristic with 4-way (cardinal) movement.
 */
export declare function aStarPathfind(x0: number, y0: number, x1: number, y1: number, cols: number, rows: number, isBlocked: (x: number, y: number) => boolean, moveCost?: (x: number, y: number) => number): Array<{
    x: number;
    y: number;
}>;
/**
 * Generate a maze using recursive backtracker (depth-first) algorithm.
 * Works on odd-dimensioned grids: walls on even coordinates, passages on odd.
 * Calls setWall(x, y, isWall) for each cell. Returns count of passage cells.
 *
 * For grids with even dimensions, effective maze area is (cols-1) x (rows-1).
 */
export declare function generateMazeAlgorithm(cols: number, rows: number, setWall: (x: number, y: number, isWall: boolean) => void): number;
