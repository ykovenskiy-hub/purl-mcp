/**
 * WebSocket server for MCP ↔ Browser bridge.
 *
 * Runs on localhost, accepts a single browser connection (first wins).
 * Forwards tool requests to the browser and returns responses.
 */
import { WebSocketServer, WebSocket } from 'ws';
const REQUEST_TIMEOUT_MS = 10_000;
export function createWsBridge(port) {
    let activeConnection = null;
    let requestId = 0;
    const pending = new Map();
    const wss = new WebSocketServer({ port });
    console.error(`[WS Bridge] Listening on ws://localhost:${port}`);
    wss.on('connection', (ws) => {
        if (activeConnection && activeConnection.readyState === WebSocket.OPEN) {
            // Reject — first wins
            ws.close(4000, 'Another browser tab is already connected');
            console.error('[WS Bridge] Rejected connection — active connection exists');
            return;
        }
        activeConnection = ws;
        console.error('[WS Bridge] Browser connected');
        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data.toString());
                const entry = pending.get(msg.id);
                if (!entry)
                    return;
                pending.delete(msg.id);
                clearTimeout(entry.timer);
                if (msg.error) {
                    entry.reject(new Error(msg.error));
                }
                else {
                    // Convert result to string for MCP response
                    const result = typeof msg.result === 'string' ? msg.result : JSON.stringify(msg.result, null, 2);
                    entry.resolve(result);
                }
            }
            catch {
                // Ignore malformed messages
            }
        });
        ws.on('close', () => {
            if (activeConnection === ws) {
                activeConnection = null;
                console.error('[WS Bridge] Browser disconnected');
                // Reject all pending requests
                for (const [id, entry] of pending) {
                    clearTimeout(entry.timer);
                    entry.reject(new Error('Browser disconnected'));
                    pending.delete(id);
                }
            }
        });
        ws.on('error', () => {
            // onclose will handle cleanup
        });
    });
    return {
        async forward(tool, params) {
            if (!activeConnection || activeConnection.readyState !== WebSocket.OPEN) {
                throw new Error('No Purl Studio browser tab connected. Open Purl Studio in your browser first.');
            }
            const id = `req_${++requestId}`;
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    pending.delete(id);
                    reject(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`));
                }, REQUEST_TIMEOUT_MS);
                pending.set(id, { resolve, reject, timer });
                activeConnection.send(JSON.stringify({ id, tool, params }));
            });
        },
        isConnected() {
            return activeConnection !== null && activeConnection.readyState === WebSocket.OPEN;
        },
        close() {
            for (const [id, entry] of pending) {
                clearTimeout(entry.timer);
                entry.reject(new Error('Server shutting down'));
                pending.delete(id);
            }
            if (activeConnection) {
                activeConnection.close();
                activeConnection = null;
            }
            wss.close();
        },
    };
}
