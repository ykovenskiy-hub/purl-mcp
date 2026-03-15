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
  SCRIPTABLE_PROPERTIES,
  CELL_SCRIPTABLE_PROPERTIES,
  FILL_LAYER_PROPERTIES,
  generateSyntaxReference,
} from 'purl-parser'
import { createWsBridge } from './wsServer.js'

// WebSocket bridge to browser
const WS_PORT = Number(process.env.PURL_WS_PORT) || 3001
const bridge = createWsBridge(WS_PORT)

// Tools forwarded to browser (no path param needed — operates on live state)
const BROWSER_TOOLS = new Set([
  'get_project', 'list_objects', 'get_script',
  'set_property', 'update_script', 'add_object', 'remove_object', 'update_cell',
])

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
    name: 'get_script',
    description: 'Get the script code for an object or cell in the current project.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Object name (e.g., "Player") or "cell:CellName" for cell scripts',
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
    description: 'Get reference documentation for the Purl DSL scripting language. Query by category (events, actions, functions, variables, operators, properties, transitions) or get the full syntax reference.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['events', 'actions', 'functions', 'variables', 'operators', 'properties', 'transitions', 'all'],
          description: 'Category to query. Use "all" for the complete syntax reference.',
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
      },
      required: ['target', 'code'],
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
      },
      required: ['objectName', 'properties'],
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
          enum: ['shape', 'text', 'line', 'grid', 'component'],
          description: 'Object type',
        },
        properties: {
          type: 'object',
          description: 'Optional properties to set (x, y, width, height, content, tags, etc.)',
        },
      },
      required: ['cellName', 'name', 'type'],
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
      },
      required: ['objectName'],
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
      },
      required: ['cellName', 'properties'],
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
        fillLayers: FILL_LAYER_PROPERTIES,
      }, null, 2)
    case 'all':
      return generateSyntaxReference()
    default:
      return `Unknown category: "${args.category}". Use: events, actions, functions, variables, operators, properties, transitions, all`
  }
}

// --- MCP Server ---

const server = new Server(
  { name: 'purl-mcp-server', version: '0.2.0' },
  { capabilities: { tools: {} } }
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

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Purl MCP Server running on stdio')
}

main().catch(console.error)
