/**
 * WebSocket server for MCP ↔ Browser bridge.
 *
 * Runs on localhost, accepts a single browser connection (first wins).
 * Forwards tool requests to the browser and returns responses.
 * Binds the requested port strictly — if it's busy, exits with a clear error.
 * (Sibling MCP processes are killed on startup; see index.ts.)
 */
export interface WsBridge {
    forward(tool: string, params: Record<string, unknown>): Promise<string>;
    isConnected(): boolean;
    close(): void;
}
export declare function createWsBridge(port: number): WsBridge;
