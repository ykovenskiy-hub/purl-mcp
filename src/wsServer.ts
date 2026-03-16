/**
 * WebSocket server for MCP ↔ Browser bridge.
 *
 * Runs on localhost, accepts a single browser connection (first wins).
 * Forwards tool requests to the browser and returns responses.
 * If the requested port is in use, tries up to 10 consecutive ports.
 */

import { WebSocketServer, WebSocket } from 'ws'

const REQUEST_TIMEOUT_MS = 10_000
const MAX_PORT_ATTEMPTS = 10

export interface WsBridge {
  forward(tool: string, params: Record<string, unknown>): Promise<string>
  isConnected(): boolean
  close(): void
}

export function createWsBridge(port: number): WsBridge {
  let activeConnection: WebSocket | null = null
  let requestId = 0
  let wss: WebSocketServer | null = null
  const pending = new Map<string, {
    resolve: (value: string) => void
    reject: (reason: Error) => void
    timer: ReturnType<typeof setTimeout>
  }>()

  function setupConnections(server: WebSocketServer): void {
    server.on('connection', (ws) => {
      if (activeConnection && activeConnection.readyState === WebSocket.OPEN) {
        ws.close(4000, 'Another browser tab is already connected')
        console.error('[WS Bridge] Rejected connection — active connection exists')
        return
      }

      activeConnection = ws
      console.error('[WS Bridge] Browser connected')

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString())
          const entry = pending.get(msg.id)
          if (!entry) return

          pending.delete(msg.id)
          clearTimeout(entry.timer)

          if (msg.error) {
            entry.reject(new Error(msg.error))
          } else {
            const result = typeof msg.result === 'string' ? msg.result : JSON.stringify(msg.result, null, 2)
            entry.resolve(result)
          }
        } catch {
          // Ignore malformed messages
        }
      })

      ws.on('close', () => {
        if (activeConnection === ws) {
          activeConnection = null
          console.error('[WS Bridge] Browser disconnected')
          for (const [id, entry] of pending) {
            clearTimeout(entry.timer)
            entry.reject(new Error('Browser disconnected'))
            pending.delete(id)
          }
        }
      })

      ws.on('error', () => {
        // onclose will handle cleanup
      })
    })
  }

  function tryListen(p: number, attempt: number): void {
    const server = new WebSocketServer({ port: p })

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
        server.close()
        tryListen(p + 1, attempt + 1)
      } else {
        console.error(`[WS Bridge] Failed to listen: ${err.message}`)
      }
    })

    server.on('listening', () => {
      wss = server
      console.error(`[WS Bridge] Listening on ws://localhost:${p}`)
      setupConnections(server)
    })
  }

  tryListen(port, 1)

  return {
    async forward(tool: string, params: Record<string, unknown>): Promise<string> {
      if (!activeConnection || activeConnection.readyState !== WebSocket.OPEN) {
        throw new Error('No Purl Studio browser tab connected. Open Purl Studio in your browser first.')
      }

      const id = `req_${++requestId}`

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id)
          reject(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`))
        }, REQUEST_TIMEOUT_MS)

        pending.set(id, { resolve, reject, timer })
        activeConnection!.send(JSON.stringify({ id, tool, params }))
      })
    },

    isConnected(): boolean {
      return activeConnection !== null && activeConnection.readyState === WebSocket.OPEN
    },

    close() {
      for (const [id, entry] of pending) {
        clearTimeout(entry.timer)
        entry.reject(new Error('Server shutting down'))
        pending.delete(id)
      }
      if (activeConnection) {
        activeConnection.close()
        activeConnection = null
      }
      wss?.close()
    },
  }
}
