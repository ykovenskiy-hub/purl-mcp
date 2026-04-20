#!/usr/bin/env node
/**
 * Purl MCP Server
 *
 * Thin bridge between Claude (stdio/MCP) and Purl Studio (WebSocket).
 *
 * Browser-forwarded tools (via WebSocket to live editor state):
 *   get_project, list_objects, get_script, set_property,
 *   update_script, add_object, remove_object, update_cell
 *
 * Local tools (parser bundle, no browser needed):
 *   validate_script, dsl_reference
 */

import { execSync } from 'node:child_process'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js'
import {
  parseEventScript,
  EVENTS,
  ACTIONS,
  FUNCTIONS,
  VARIABLES,
  OPERATORS,
  TRANSITIONS,
  CONCEPTS,
  SCRIPTABLE_PROPERTIES,
  CELL_SCRIPTABLE_PROPERTIES,
  CAMERA_SCRIPTABLE_PROPERTIES,
  SCREEN_SCRIPTABLE_PROPERTIES,
  FILL_LAYER_PROPERTIES,
  generateSyntaxReference,
} from '../vendor/purl-parser.mjs'
import { createWsBridge } from './wsServer.js'

// Kill any other purl-mcp-server processes on this machine. Each Claude Code
// session spawns its own MCP server via stdio, but the WS bridge keeps the
// event loop alive after Claude exits, leaving zombie servers that hold port
// 3001 hostage from the next session. We enforce exactly one instance.
function killZombieSiblings(): void {
  const myPid = process.pid
  const myScript = process.argv[1]
  if (!myScript) return
  try {
    const output = execSync('ps -A -o pid=,command=', { encoding: 'utf8' })
    for (const line of output.split('\n')) {
      const match = line.trim().match(/^(\d+)\s+(.*)$/)
      if (!match) continue
      const pid = Number(match[1])
      if (pid === myPid) continue
      if (!match[2].includes(myScript)) continue
      try {
        process.kill(pid, 'SIGKILL')
        console.error(`[Purl MCP] Killed zombie sibling PID ${pid}`)
      } catch {
        // already dead
      }
    }
  } catch (err) {
    console.error(`[Purl MCP] Failed to scan for siblings: ${err instanceof Error ? err.message : String(err)}`)
  }
}

killZombieSiblings()

// WebSocket bridge to browser
const WS_PORT = Number(process.env.PURL_WS_PORT) || 3001
const bridge = createWsBridge(WS_PORT)

// Tools forwarded to browser (no path param needed — operates on live state)
const BROWSER_TOOLS = new Set([
  'get_project', 'list_objects', 'get_object', 'get_script', 'get_states',
  'set_property', 'update_script', 'add_object', 'remove_object', 'update_cell',
  'clone_object', 'bulk_set_property',
])

// Shared schema for the `prompt` parameter required on every write tool. The
// editor keys its undo-history batching on this string, so the LLM must pass
// the user's message verbatim — not a paraphrase.
const PROMPT_PARAM = {
  type: 'string' as const,
  description: "THE USER'S EXACT PROMPT — verbatim, word-for-word, as typed. Do not summarize, paraphrase, translate, or shorten. Copy the user's message into this field exactly. Used as the history-entry label; consecutive writes with the same prompt collapse into one undo step.",
}

// Tool definitions
const tools: Tool[] = [
  {
    name: 'get_project',
    description: 'Get the current Purl project structure from the live editor. Returns cells, objects, and settings.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_objects',
    description: 'List all objects in the current project or a specific cell. Returns names, types, tags, and key properties.',
    inputSchema: {
      type: 'object',
      properties: {
        cellName: {
          type: 'string',
          description: 'Optional: filter to objects in this cell (by label)',
        },
      },
    },
  },
  {
    name: 'get_object',
    description: 'Get full details of a single object — all properties, dynamics config, states, children, scripts. Use this when you need to inspect or debug a specific object.',
    inputSchema: {
      type: 'object',
      properties: {
        objectName: {
          type: 'string',
          description: 'Name of the object to inspect',
        },
        cellName: {
          type: 'string',
          description: 'Optional: cell to search in (by label)',
        },
      },
      required: ['objectName'],
    },
  },
  {
    name: 'get_script',
    description: 'Get the script code for an object or cell in the current project.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Object name (e.g., "Player") or "cell:CellName" for cell scripts',
        },
        cellName: {
          type: 'string',
          description: 'Optional: restrict object lookup to this cell. Required when the same object name exists in multiple cells (e.g., after duplicating a cell); otherwise the server errors with a list of candidate cells.',
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'validate_script',
    description: 'Validate Purl DSL script syntax using the full parser. Returns detailed error messages with line/column numbers, or confirms valid syntax with a summary of detected events and actions.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'The script code to validate',
        },
      },
      required: ['code'],
    },
  },
  {
    name: 'dsl_reference',
    description: 'Get reference documentation for the Purl DSL scripting language. Query by category (events, actions, functions, variables, operators, properties, transitions, concepts) or get the full syntax reference. The "concepts" category covers object variables, component child access, message parameters, spawn parameters, and variable scopes.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['events', 'actions', 'functions', 'variables', 'operators', 'properties', 'transitions', 'concepts', 'all'],
          description: 'Category to query. Use "concepts" for object variables, message params, spawn params, component child access. Use "all" for the complete syntax reference.',
        },
        name: {
          type: 'string',
          description: 'Optional: specific item name (e.g., "onClick", "goto", "random") for detailed info',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'update_script',
    description: 'Set script code for an object or cell. If a script with the given name exists, its code is replaced. If not, a new script entry is created.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Object name (e.g., "Player") or "cell:CellName" for cell scripts',
        },
        code: {
          type: 'string',
          description: 'The script code to set',
        },
        scriptName: {
          type: 'string',
          description: 'Name of the script slot (default: "Main")',
        },
        cellName: {
          type: 'string',
          description: 'Optional: restrict object lookup to this cell. Required when the same object name exists in multiple cells (e.g., after duplicating a cell); otherwise the server errors with a list of candidate cells.',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['target', 'code', 'prompt'],
    },
  },
  {
    name: 'set_property',
    description: 'Set properties on an object. Merges the given properties into the object. Use for position (x, y), size (width, height), visibility, tags, content (for text), dynamics settings, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        objectName: {
          type: 'string',
          description: 'Name of the object to modify',
        },
        cellName: {
          type: 'string',
          description: 'Optional: cell to search in (by label)',
        },
        properties: {
          type: 'object',
          description: 'Key-value pairs to set on the object (e.g., {"x": 0.3, "y": 0.5, "visible": false})',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['objectName', 'properties', 'prompt'],
    },
  },
  {
    name: 'add_object',
    description: 'Add a new object (prime or component) to a cell. Returns the created object summary.',
    inputSchema: {
      type: 'object',
      properties: {
        cellName: {
          type: 'string',
          description: 'Cell label to add the object to',
        },
        name: {
          type: 'string',
          description: 'Name for the new object (must be unique across the project)',
        },
        type: {
          type: 'string',
          enum: ['shape', 'text', 'line', 'grid', 'component', 'audio', 'emitter', 'mask', 'peg', 'viewport'],
          description: 'Object type',
        },
        properties: {
          type: 'object',
          description: 'Optional properties to set (x, y, width, height, content, tags, etc.)',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['cellName', 'name', 'type', 'prompt'],
    },
  },
  {
    name: 'remove_object',
    description: 'Remove an object from a cell. If the object is a component, its children are also removed.',
    inputSchema: {
      type: 'object',
      properties: {
        objectName: {
          type: 'string',
          description: 'Name of the object to remove',
        },
        cellName: {
          type: 'string',
          description: 'Optional: cell to search in (by label)',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['objectName', 'prompt'],
    },
  },
  {
    name: 'update_cell',
    description: 'Set cell-level properties like gravity, wind, windAngle, size, or label.',
    inputSchema: {
      type: 'object',
      properties: {
        cellName: {
          type: 'string',
          description: 'Cell label to modify',
        },
        properties: {
          type: 'object',
          description: 'Key-value pairs to set on the cell (e.g., {"gravity": 9.8, "wind": 2, "windAngle": 180})',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['cellName', 'properties', 'prompt'],
    },
  },
  {
    name: 'get_states',
    description: 'Get presets/states for a component. Returns child list, preset names with per-child property overrides, reference snapshot, and state groups. Only works on components.',
    inputSchema: {
      type: 'object',
      properties: {
        objectName: {
          type: 'string',
          description: 'Name of the component to inspect',
        },
        cellName: {
          type: 'string',
          description: 'Optional: cell to search in (by label)',
        },
      },
      required: ['objectName'],
    },
  },
  {
    name: 'clone_object',
    description: 'Deep-clone an object (with all children, presets, states, scripts) into the same or a different cell. Generates new unique IDs and renames children to avoid name collisions.',
    inputSchema: {
      type: 'object',
      properties: {
        sourceName: {
          type: 'string',
          description: 'Name of the object to clone',
        },
        newName: {
          type: 'string',
          description: 'Name for the cloned object (must be unique)',
        },
        cellName: {
          type: 'string',
          description: 'Optional: cell where the source object lives (by label)',
        },
        targetCellName: {
          type: 'string',
          description: 'Optional: cell to place the clone in (defaults to same cell as source)',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['sourceName', 'newName', 'prompt'],
    },
  },
  {
    name: 'bulk_set_property',
    description: 'Set properties on multiple objects in a single call. Useful for mass-editing children of a component (e.g., changing colors). Each entry specifies an object name and properties to set.',
    inputSchema: {
      type: 'object',
      properties: {
        updates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              objectName: {
                type: 'string',
                description: 'Name of the object to modify',
              },
              properties: {
                type: 'object',
                description: 'Key-value pairs to set',
              },
            },
            required: ['objectName', 'properties'],
          },
          description: 'Array of { objectName, properties } entries',
        },
        cellName: {
          type: 'string',
          description: 'Optional: cell to search in (by label). Applies to all entries.',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['updates', 'prompt'],
    },
  },
]

// --- Local tool handlers (parser bundle) ---

function handleValidateScript(args: { code: string }): string {
  const result = parseEventScript(args.code)

  if (result.errors.length === 0) {
    const summary: string[] = []
    if (result.events.length > 0) {
      summary.push(`Events: ${result.events.map(e => e.event).join(', ')}`)
    }
    if (result.actions.length > 0) {
      summary.push(`Actions: ${result.actions.map(a => a.name).join(', ')}`)
    }
    return `Script syntax is valid\n${summary.join('\n')}`
  }

  const errorMessages = result.errors.map(e =>
    `Line ${e.line}, Col ${e.column}: ${e.message}`
  )
  return `Script has ${result.errors.length} error(s):\n${errorMessages.map(e => `  - ${e}`).join('\n')}`
}

function handleDslReference(args: { category: string; name?: string }): string {
  if (args.name) {
    const name = args.name
    const registries: [string, Record<string, unknown>][] = [
      ['event', EVENTS],
      ['action', ACTIONS],
      ['function', FUNCTIONS],
      ['variable', VARIABLES],
      ['operator', OPERATORS],
      ['transition', TRANSITIONS],
      ['property', SCRIPTABLE_PROPERTIES],
      ['concept', CONCEPTS],
    ]
    for (const [category, registry] of registries) {
      if (name in registry) {
        return JSON.stringify({ name, category, ...(registry as Record<string, object>)[name] }, null, 2)
      }
    }
    return `Unknown DSL element: "${name}". Use category queries to browse available elements.`
  }

  switch (args.category) {
    case 'events': {
      const entries = Object.entries(EVENTS).map(([name, def]) => {
        const entry: Record<string, unknown> = { name, description: def.description, validFor: def.validFor, example: def.example }
        if ('parameters' in def) entry.parameters = def.parameters
        return entry
      })
      return JSON.stringify(entries, null, 2)
    }
    case 'actions': {
      const entries = Object.entries(ACTIONS).map(([name, def]) => {
        const entry: Record<string, unknown> = { name, description: def.description, example: def.example }
        if ('parameters' in def) entry.parameters = def.parameters
        return entry
      })
      return JSON.stringify(entries, null, 2)
    }
    case 'functions': {
      const entries = Object.entries(FUNCTIONS).map(([name, def]) => {
        const entry: Record<string, unknown> = { name, description: def.description, returns: def.returns, example: def.example }
        if ('parameters' in def) entry.parameters = def.parameters
        return entry
      })
      return JSON.stringify(entries, null, 2)
    }
    case 'variables':
      return JSON.stringify(VARIABLES, null, 2)
    case 'operators':
      return JSON.stringify(OPERATORS, null, 2)
    case 'transitions':
      return JSON.stringify(TRANSITIONS, null, 2)
    case 'properties':
      return JSON.stringify({
        object: SCRIPTABLE_PROPERTIES,
        cell: CELL_SCRIPTABLE_PROPERTIES,
        camera: CAMERA_SCRIPTABLE_PROPERTIES,
        screen: SCREEN_SCRIPTABLE_PROPERTIES,
        fillLayers: FILL_LAYER_PROPERTIES,
      }, null, 2)
    case 'concepts':
      return JSON.stringify(CONCEPTS, null, 2)
    case 'all':
      return generateSyntaxReference()
    default:
      return `Unknown category: "${args.category}". Use: events, actions, functions, variables, operators, properties, transitions, concepts, all`
  }
}

// --- MCP Server ---

const SERVER_INSTRUCTIONS = `\
You are connected to a live Purl Studio project via MCP.

Purl Studio (purl.studio) is a browser-based visual game/interactive-content engine. \
Users build projects composed of **cells** (scenes/rooms), each containing **objects** \
(shapes, text, lines, grids, components, audio, emitters, masks, pegs, viewports). \
Objects have visual properties (position, size, fill, opacity, etc.) and can have **scripts** \
written in the Purl DSL — an event-driven scripting language (onClick, onTick, onCollide, etc.).

**Components** are grouping objects whose children move together. They support **presets** \
(named visual states) and **state transitions**.

## How to use these tools

1. **Start with \`get_project\`** to understand the project structure — cells, objects, markers.
2. **Use \`list_objects\`** to see what's in a specific cell.
3. **Use \`get_script\`** to read an object's script before modifying it.
4. **Use \`dsl_reference\`** to look up valid events, actions, functions, and properties \
before writing scripts. The Purl DSL has specific syntax — never guess.
5. **Use \`validate_script\`** to check script syntax before applying it with \`update_script\`.
6. **Use \`set_property\`** / \`bulk_set_property\`** to change object properties.
7. **Use \`add_object\`** / \`remove_object\`** to create or delete objects.
8. **Use \`update_cell\`** to change cell-level settings (gravity, wind, size).

## Important notes

- **Coordinates are 0–1 normalized** (0,0 = top-left, 1,1 = bottom-right).
- Changes made via these tools appear **instantly** in the user's browser.
- Always call \`dsl_reference\` with category "events" or "actions" before writing scripts \
if you are unsure about syntax. Never invent event or action names.
- **Custom object variables must not collide with built-in properties.** Before using \
\`set self.<name>\` with any new custom variable, call \`dsl_reference\` with category \
"properties" and confirm \`<name>\` is not listed. Collisions fail silently — e.g., \
\`set self.pivot 0\` overwrites the built-in \`pivot\` ({x, y}) with a scalar and breaks \
the component's transform, hiding children with no error. Reserved names include (but \
are not limited to): x, y, width, height, rotation, flipX, flipY, visible, opacity, \
zIndex, scale, state, pivot, fillColor, strokeColor, strokeWidth, content, velocityX, \
velocityY, movable. When in doubt, use a disambiguating name (e.g., \`self.phaseStep\` \
instead of \`self.phase\`, \`self.mirrored\` instead of \`self.pivot\`).
- **Every write tool takes a required \`prompt\` parameter** — pass the user's \
exact message verbatim (not a summary or paraphrase). The editor uses it to label \
and coalesce edits in the undo history: consecutive writes sharing the same \`prompt\` \
collapse into one undo step, with the prompt text shown in the hover tooltip.
- The user can see and undo your changes in the editor's undo history.
`

const server = new Server(
  { name: 'purl-mcp-server', version: '0.2.0' },
  { capabilities: { tools: {} }, instructions: SERVER_INSTRUCTIONS }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    let result: string

    if (BROWSER_TOOLS.has(name)) {
      // Forward to browser via WebSocket
      result = await bridge.forward(name, (args ?? {}) as Record<string, unknown>)
    } else if (name === 'validate_script') {
      result = handleValidateScript(args as { code: string })
    } else if (name === 'dsl_reference') {
      result = handleDslReference(args as { category: string; name?: string })
    } else {
      throw new Error(`Unknown tool: ${name}`)
    }

    return {
      content: [{ type: 'text', text: result }],
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    }
  }
})

// When Claude Code exits, our stdin closes. Without this handler the WS
// server keeps the event loop alive and we become a zombie holding port 3001.
function shutdown(reason: string): void {
  console.error(`[Purl MCP] Shutting down: ${reason}`)
  bridge.close()
  process.exit(0)
}

process.stdin.on('end', () => shutdown('stdin ended'))
process.stdin.on('close', () => shutdown('stdin closed'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Purl MCP Server running on stdio')
}

main().catch(console.error)
