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
  'get_project', 'list_objects', 'get_object', 'get_script', 'get_script_history', 'get_states',
  'search_scripts', 'read_project_scripts',
  'set_property', 'update_script', 'edit_script', 'add_object', 'remove_object', 'update_cell',
  'clone_object', 'bulk_set_property',
  'push_value', 'set_value_at_path', 'remove_value_at_path',
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
    name: 'search_scripts',
    description: 'Search every script in the project (all cell-script tabs and all object-level scripts, templates included) for a substring. Returns one entry per matching line with target/scriptName/lineNumber/line so the result is directly actionable. Pass contextLines: N to also return the N lines above and below each match — usually enough to skip a follow-up get_script call. Use this whenever you need to answer "where is X used / set / played / spawned / destroyed / handled" before making changes — the only reliable way to enumerate distributed Purl logic.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Substring to find. Case-sensitive by default; pass caseInsensitive: true to relax.',
        },
        caseInsensitive: {
          type: 'boolean',
          description: 'Optional: when true, match case-insensitively. Default false.',
        },
        cellName: {
          type: 'string',
          description: 'Optional: restrict search to a single cell (by label). Default searches all cells.',
        },
        contextLines: {
          type: 'number',
          description: 'Optional: number of lines of context to include above and below each match (returned as contextBefore / contextAfter arrays on each match). Default 0 (no context). Capped at 20.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'read_project_scripts',
    description: 'Dump every script in the project (cell scripts + object scripts, all tabs) in one call. Use this for whole-project audits, refactors, or "find every place X is wired" questions where you need the surrounding code, not just matching lines (use search_scripts when you only need matching lines). Returns a flat array of {target, scriptName, code, lineCount}, sorted scene-order. Skips empty scripts by default. Soft byte cap (default 50000) bounds the response — if exceeded, returns what fits plus a truncation marker; refine via cellName or targets.',
    inputSchema: {
      type: 'object',
      properties: {
        cellName: {
          type: 'string',
          description: 'Optional: restrict to a single cell (by label). Default: all cells.',
        },
        targets: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional: restrict to a list of targets. Each entry is either an object name (e.g., "HAB") or "cell:Label" for a cell script. Default: all targets.',
        },
        includeEmpty: {
          type: 'boolean',
          description: 'Optional: include empty scripts (default false).',
        },
        maxBytes: {
          type: 'number',
          description: 'Optional: soft cap on response size in bytes (default 200000). When exceeded, the response includes a truncation marker and skipped-entry summary.',
        },
      },
    },
  },
  {
    name: 'get_script_history',
    description: 'Get the MCP edit history of a specific script — all past versions written via update_script, most recent last. Use this to recover code that was accidentally wiped by a previous edit. Each entry shows the timestamp, the user prompt that triggered the edit, and the full code snapshot.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Object name (e.g., "Player") or "cell:CellName" for cell scripts',
        },
        scriptName: {
          type: 'string',
          description: 'Script name on the object/cell. Defaults to "Main".',
        },
        cellName: {
          type: 'string',
          description: 'Optional: restrict object lookup to this cell when the same object name exists in multiple cells.',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of most-recent entries to return. Defaults to 10. Pass 0 to return all entries.',
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
    description: 'Full-replace a script: writes the supplied code as the new content. Use for genuine rewrites or to create a new script slot. For incremental edits to an existing script, prefer edit_script — its anchor matching catches stale baselines that update_script would silently overwrite. If you must full-replace an existing script, pass expectedVersion (from get_script or read_project_scripts) so a stale write fails loudly instead of stomping concurrent changes.',
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
        expectedVersion: {
          type: 'string',
          description: 'Optional precondition: the version token of the script you read (from get_script\'s "(version: ...)" header or read_project_scripts entry.version). If supplied and does not match the current content, the write is rejected with the actual hash — prevents silently overwriting concurrent changes. Highly recommended for any full-replace of an existing script.',
        },
        validate: {
          type: 'boolean',
          description: 'Optional: when true, parse the new code with the full DSL parser before writing. If parsing fails, the write is rejected with line/column diagnostics and the existing script is unchanged. Default false (matches legacy behavior). Recommended whenever you are not certain the code parses.',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['target', 'code', 'prompt'],
    },
  },
  {
    name: 'edit_script',
    description: 'Edit an existing script via a list of find/replace anchors — the safe way to change part of a script without overwriting unrelated lines. Each edit\'s "old" string must match exactly once in the current content (or set replaceAll: true to replace every occurrence). Edits are applied sequentially in the order supplied; each later edit operates on the result of the previous. Atomic: if any anchor fails to match (zero or multiple), the whole call is rejected with line numbers — nothing is written. Use this for targeted changes; use update_script only for full rewrites or brand-new scripts. Stale baselines fail loudly because the anchor either matches today\'s content (safe) or doesn\'t (rejected).',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Object name (e.g., "Player") or "cell:CellName" for cell scripts',
        },
        edits: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              old: {
                type: 'string',
                description: 'Exact substring to find in the current script content. Multi-line strings are fine. Must match exactly once unless replaceAll is true.',
              },
              new: {
                type: 'string',
                description: 'Replacement string. May be empty to delete the matched text.',
              },
              replaceAll: {
                type: 'boolean',
                description: 'When true, replace every occurrence of "old" instead of requiring a unique match. Default false.',
              },
            },
            required: ['old', 'new'],
          },
          description: 'Ordered list of find/replace edits. Sequential — later edits see earlier results.',
        },
        scriptName: {
          type: 'string',
          description: 'Script slot to edit (default: "Main"). Required if the target object has multiple scripts.',
        },
        cellName: {
          type: 'string',
          description: 'Optional: restrict object lookup to this cell when the same object name exists in multiple cells.',
        },
        validate: {
          type: 'boolean',
          description: 'Optional: when true, parse the post-edit content with the full DSL parser before writing. If parsing fails, the edit is rejected with line/column diagnostics and the existing script is unchanged. Default false (matches legacy behavior). Recommended whenever you are not certain the result parses.',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['target', 'edits', 'prompt'],
    },
  },
  {
    name: 'set_property',
    description: 'Set properties on an object. Merges the given properties into the object. Use for position (x, y), size (width, height), visibility, tags, content (for text), dynamics settings, etc. For nested-shape properties (arrays/maps) the call is guarded: `expectedVersion` is required to prevent stale-baseline overwrites, and `confirmTypeChange` is required when the property\'s shape changes among array/map/scalar. Read with get_object first to obtain `_versions`.',
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
        expectedVersion: {
          type: 'object',
          description: 'Optional precondition map: {propName: hash} from get_object\'s `_versions`. REQUIRED for any property in `properties` whose CURRENT value is an array or map — prevents silently overwriting concurrent changes. Mismatch is reported with the actual hash so you can rebase. Scalar properties don\'t need versions.',
        },
        confirmTypeChange: {
          type: 'boolean',
          description: 'Pass true to allow changing a property\'s shape among array/map/scalar. REQUIRED for those transitions; protects against accidental clobber of nested data with a scalar (or vice-versa). Creation (property absent → set) and deletion don\'t need this flag.',
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
    description: 'Set properties on multiple objects in a single call. Useful for mass-editing children of a component (e.g., changing colors). Each entry specifies an object name and properties to set. Same nested-write guards as set_property apply per entry: pass `expectedVersion` for any property currently holding an array/map and `confirmTypeChange:true` to allow shape changes.',
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
              expectedVersion: {
                type: 'object',
                description: 'Optional per-property hash map (from get_object\'s `_versions`). Required for any property in `properties` whose current value is an array or map.',
              },
              confirmTypeChange: {
                type: 'boolean',
                description: 'Pass true to allow shape changes (array/map/scalar) on this entry\'s properties.',
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
  // ---------------------------------------------------------------------------
  // Granular write tools for nested-data properties (DATA primes' `dataValue`,
  // grid cell-data, anything holding an array or map). Additive by construction:
  // each tool touches exactly one slot, so unrelated entries can't be destroyed
  // by accident. Prefer these over `set_property` for partial mutations of
  // structured data — `set_property` is a full property replace and requires
  // `expectedVersion` for nested values to prevent stale-baseline overwrites.
  //
  // Path syntax (all three tools): bracket-and-dot subset.
  //   "value"                  — top-level property
  //   "value[5]"               — element 5 of an array property
  //   "value[5].correct"       — field on the array element
  //   "value.config.maxAlt"    — nested map key
  //   "value.records[0].x"     — mixed
  // Bracketed integers and dotted identifiers only — no expressions, no
  // computed indices, no string keys with brackets.
  // ---------------------------------------------------------------------------
  {
    name: 'push_value',
    description: 'Append a value to an array at a nested path. Additive — only the target array is touched; siblings and unrelated entries stay intact. Errors if the target isn\'t an array. Use this instead of `set_property` for adding items to a DATA prime\'s value (or any other array-shaped property).',
    inputSchema: {
      type: 'object',
      properties: {
        objectName: { type: 'string', description: 'Name of the object whose property holds the array' },
        cellName: { type: 'string', description: 'Optional: cell to search in (by label)' },
        path: {
          type: 'string',
          description: 'Dotted/bracketed path to the array (e.g., "value", "value.records", "value.config.scores"). Bracket-indexed segments allowed for nested arrays.',
        },
        value: {
          description: 'Value to append. Any JSON: scalar, array, or object. Required.',
        },
        expectedVersion: {
          type: 'string',
          description: 'Optional precondition: hash of the top-level property (from get_object\'s `_versions[topSlot]`). When supplied, the call is rejected if the top slot has changed since you read it. Optional because push is additive — supply when you need to ensure no concurrent edit slipped in.',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['objectName', 'path', 'value', 'prompt'],
    },
  },
  {
    name: 'set_value_at_path',
    description: 'Set a single nested value at the given path. Auto-creates intermediate objects/arrays where needed. Siblings stay intact. Use this instead of `set_property` for changing one field deep in a DATA prime\'s value (or any other nested property).',
    inputSchema: {
      type: 'object',
      properties: {
        objectName: { type: 'string', description: 'Name of the object whose property holds the value' },
        cellName: { type: 'string', description: 'Optional: cell to search in (by label)' },
        path: {
          type: 'string',
          description: 'Dotted/bracketed path to the leaf (e.g., "value[5].correct", "value.config.maxAlt"). At least one segment required.',
        },
        value: {
          description: 'New value at the path. Any JSON: scalar, array, or object.',
        },
        expectedVersion: {
          type: 'string',
          description: 'Optional precondition: hash of the top-level property (from get_object\'s `_versions[topSlot]`). When supplied, rejects the write if the top slot has changed since you read it.',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['objectName', 'path', 'value', 'prompt'],
    },
  },
  {
    name: 'remove_value_at_path',
    description: 'Remove a single value at the given path. For arrays, removes the element at the bracket index and shifts subsequent elements down. For maps, deletes the keyed entry. Errors if the path doesn\'t exist (no silent no-ops).',
    inputSchema: {
      type: 'object',
      properties: {
        objectName: { type: 'string', description: 'Name of the object' },
        cellName: { type: 'string', description: 'Optional: cell to search in (by label)' },
        path: {
          type: 'string',
          description: 'Dotted/bracketed path to the entry to remove (e.g., "value[5]", "value.config.foo").',
        },
        expectedVersion: {
          type: 'string',
          description: 'Optional precondition: hash of the top-level property (from get_object\'s `_versions[topSlot]`). When supplied, rejects the call if the top slot has changed since you read it.',
        },
        prompt: PROMPT_PARAM,
      },
      required: ['objectName', 'path', 'prompt'],
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
3. **Use \`get_script\`** to read a single object's script before modifying it. For whole-project audits or refactors that need the surrounding code (not just matching lines), use \`read_project_scripts\` for one-shot recon.
4. **Use \`search_scripts\`** to grep for a substring across every script (returns matching lines only — fast for "where is X used / set / spawned / handled").
5. **Use \`dsl_reference\`** to look up valid events, actions, functions, and properties \
before writing scripts. The Purl DSL has specific syntax — never guess.
6. **Use \`validate_script\`** to check script syntax before applying it.
7. **Editing an existing script: prefer \`edit_script\`** (anchor-based find/replace). \
Each anchor must match the current content exactly — stale baselines fail loudly \
instead of silently overwriting unrelated lines. \`update_script\` is full-replace \
and is only the right call for genuine rewrites or brand-new scripts; when you do \
use it on an existing script, pass \`expectedVersion\` (from \`get_script\`'s header \
or \`read_project_scripts\` entry) so a concurrent change can't be stomped.
8. **Changing object properties:**
   - \`set_property\` / \`bulk_set_property\` — for scalar properties (position, visibility, content, dynamics flags, etc.). Merges the given keys onto the object.
   - For **nested array/map properties** (especially DATA primes' \`value\`), prefer the granular tools — they touch only the target path and leave siblings intact: \`push_value\` (append to an array), \`set_value_at_path\` (set/replace a single leaf — auto-creates intermediate maps/arrays), \`remove_value_at_path\` (delete a map key or shift-out an array element).
   - Path syntax is dotted identifiers + bracket integers, e.g. \`value\`, \`value[5]\`, \`value[5].correct\`, \`value.config.maxAlt\`.
   - **Safety contract on \`set_property\` / \`bulk_set_property\`:** \`get_object\` returns a \`_versions\` map (FNV-1a hashes) for array/map-shaped properties. For any property currently holding an array or map you MUST pass \`expectedVersion: { propName: hash }\` — a mismatch reports the current hash so you can rebase. To change a property's shape (array↔map↔scalar) you MUST pass \`confirmTypeChange: true\`. Scalar properties need neither. The granular tools accept an optional \`expectedVersion\` (single string against the top slot) for the same precondition.
9. **Use \`add_object\`** / \`remove_object\`** to create or delete objects.
10. **Use \`update_cell\`** to change cell-level settings (gravity, wind, size).

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
