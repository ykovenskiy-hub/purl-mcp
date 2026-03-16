/**
 * WebSocket server for MCP ↔ Browser bridge.
 *
 * Runs on localhost, accepts a single browser connection (first wins).
 * Forwards tool requests to the browser and returns responses.
 * If the requested port is in use, tries up to 10 consecutive ports.
 */
export interface WsBridge {
    forward(tool: string, params: Record<string, unknown>): Promise<string>;
    isConnected(): boolean;
    close(): void;
}
export declare function createWsBridge(port: number): WsBridge;
