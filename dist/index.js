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
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { parseEventScript, EVENTS, ACTIONS, FUNCTIONS, VARIABLES, OPERATORS, TRANSITIONS, CONCEPTS, SCRIPTABLE_PROPERTIES, CELL_SCRIPTABLE_PROPERTIES, FILL_LAYER_PROPERTIES, generateSyntaxReference, } from '../vendor/purl-parser.mjs';
import { createWsBridge } from './wsServer.js';
// WebSocket bridge to browser
const WS_PORT = Number(process.env.PURL_WS_PORT) || 3001;
const bridge = createWsBridge(WS_PORT);
// Tools forwarded to browser (no path param needed — operates on live state)
const BROWSER_TOOLS = new Set([
    'get_project', 'list_objects', 'get_object', 'get_script', 'get_states',
    'set_property', 'update_script', 'add_object', 'remove_object', 'update_cell',
    'clone_object', 'bulk_set_property',
    'begin_prompt', 'end_prompt',
]);
// Tool definitions
const tools = [
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
                    enum: ['shape', 'text', 'line', 'grid', 'component', 'audio', 'emitter', 'mask', 'peg', 'viewport'],
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
            },
            required: ['sourceName', 'newName'],
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
            },
            required: ['updates'],
        },
    },
    {
        name: 'begin_prompt',
        description: 'Declare the start of a user prompt. Call this BEFORE any project-modifying tools in a response that will change the project, passing the user\'s exact request as `prompt`. All subsequent write tool calls (until `end_prompt`) are grouped into ONE undo entry in the editor history, labeled with this prompt text. Essential so per-prompt edits collapse to one undo step instead of dozens of per-tool entries.',
        inputSchema: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'The user\'s exact request text — shown to the user in the history dialog on hover.',
                },
            },
            required: ['prompt'],
        },
    },
    {
        name: 'end_prompt',
        description: 'Close the current prompt batch. Call once at the end of a response that used `begin_prompt`. Subsequent edits will be separate undo entries until the next `begin_prompt`.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
];
// --- Local tool handlers (parser bundle) ---
function handleValidateScript(args) {
    const result = parseEventScript(args.code);
    if (result.errors.length === 0) {
        const summary = [];
        if (result.events.length > 0) {
            summary.push(`Events: ${result.events.map(e => e.event).join(', ')}`);
        }
        if (result.actions.length > 0) {
            summary.push(`Actions: ${result.actions.map(a => a.name).join(', ')}`);
        }
        return `Script syntax is valid\n${summary.join('\n')}`;
    }
    const errorMessages = result.errors.map(e => `Line ${e.line}, Col ${e.column}: ${e.message}`);
    return `Script has ${result.errors.length} error(s):\n${errorMessages.map(e => `  - ${e}`).join('\n')}`;
}
function handleDslReference(args) {
    if (args.name) {
        const name = args.name;
        const registries = [
            ['event', EVENTS],
            ['action', ACTIONS],
            ['function', FUNCTIONS],
            ['variable', VARIABLES],
            ['operator', OPERATORS],
            ['transition', TRANSITIONS],
            ['property', SCRIPTABLE_PROPERTIES],
            ['concept', CONCEPTS],
        ];
        for (const [category, registry] of registries) {
            if (name in registry) {
                return JSON.stringify({ name, category, ...registry[name] }, null, 2);
            }
        }
        return `Unknown DSL element: "${name}". Use category queries to browse available elements.`;
    }
    switch (args.category) {
        case 'events': {
            const entries = Object.entries(EVENTS).map(([name, def]) => {
                const entry = { name, description: def.description, validFor: def.validFor, example: def.example };
                if ('parameters' in def)
                    entry.parameters = def.parameters;
                return entry;
            });
            return JSON.stringify(entries, null, 2);
        }
        case 'actions': {
            const entries = Object.entries(ACTIONS).map(([name, def]) => {
                const entry = { name, description: def.description, example: def.example };
                if ('parameters' in def)
                    entry.parameters = def.parameters;
                return entry;
            });
            return JSON.stringify(entries, null, 2);
        }
        case 'functions': {
            const entries = Object.entries(FUNCTIONS).map(([name, def]) => {
                const entry = { name, description: def.description, returns: def.returns, example: def.example };
                if ('parameters' in def)
                    entry.parameters = def.parameters;
                return entry;
            });
            return JSON.stringify(entries, null, 2);
        }
        case 'variables':
            return JSON.stringify(VARIABLES, null, 2);
        case 'operators':
            return JSON.stringify(OPERATORS, null, 2);
        case 'transitions':
            return JSON.stringify(TRANSITIONS, null, 2);
        case 'properties':
            return JSON.stringify({
                object: SCRIPTABLE_PROPERTIES,
                cell: CELL_SCRIPTABLE_PROPERTIES,
                fillLayers: FILL_LAYER_PROPERTIES,
            }, null, 2);
        case 'concepts':
            return JSON.stringify(CONCEPTS, null, 2);
        case 'all':
            return generateSyntaxReference();
        default:
            return `Unknown category: "${args.category}". Use: events, actions, functions, variables, operators, properties, transitions, concepts, all`;
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
- **Wrap every user prompt in begin_prompt / end_prompt** so the editor records \
all your edits as ONE undo step labeled with the user's prompt. At the very start \
of a response that will modify the project, call \`begin_prompt\` with \
\`{prompt: "<the user's exact request>"}\`. At the end of the response, call \
\`end_prompt\`. The user's undo history will show one entry per prompt with that \
text on hover, instead of dozens of per-tool entries that push earlier state out of \
the 50-entry history cap.
- The user can see and undo your changes in the editor's undo history.
`;
const server = new Server({ name: 'purl-mcp-server', version: '0.2.0' }, { capabilities: { tools: {} }, instructions: SERVER_INSTRUCTIONS });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        let result;
        if (BROWSER_TOOLS.has(name)) {
            // Forward to browser via WebSocket
            result = await bridge.forward(name, (args ?? {}));
        }
        else if (name === 'validate_script') {
            result = handleValidateScript(args);
        }
        else if (name === 'dsl_reference') {
            result = handleDslReference(args);
        }
        else {
            throw new Error(`Unknown tool: ${name}`);
        }
        return {
            content: [{ type: 'text', text: result }],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: 'text', text: `Error: ${message}` }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Purl MCP Server running on stdio');
}
main().catch(console.error);
