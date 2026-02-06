#!/usr/bin/env node
/**
 * Purl MCP Server
 *
 * Exposes Purl project files to AI assistants via the Model Context Protocol.
 *
 * Tools:
 * - get_project: Read and parse a .purl file
 * - list_objects: List objects in a cell with their properties
 * - get_script: Get script code for an object or cell
 * - validate_script: Check if script syntax is valid
 *
 * Usage with Claude Code:
 *   Add to ~/.claude/settings.json:
 *   {
 *     "mcpServers": {
 *       "purl": {
 *         "command": "node",
 *         "args": ["/path/to/purl-mcp-server/dist/index.js"]
 *       }
 *     }
 *   }
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { isComponent, isPrime } from './purl-types.js';
// Tool definitions
const tools = [
    {
        name: 'get_project',
        description: 'Read and parse a Purl project file (.purl). Returns project structure including cells, objects, and settings.',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the .purl file (absolute or relative to current directory)',
                },
            },
            required: ['path'],
        },
    },
    {
        name: 'list_objects',
        description: 'List all objects in a Purl project or specific cell. Returns names, types, tags, and key properties.',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the .purl file',
                },
                cellName: {
                    type: 'string',
                    description: 'Optional: filter to objects in this cell (by label)',
                },
            },
            required: ['path'],
        },
    },
    {
        name: 'get_script',
        description: 'Get the script code for an object or cell in a Purl project.',
        inputSchema: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the .purl file',
                },
                target: {
                    type: 'string',
                    description: 'Object name (e.g., "Player") or "cell:CellName" for cell scripts',
                },
            },
            required: ['path', 'target'],
        },
    },
    {
        name: 'validate_script',
        description: 'Validate Purl DSL script syntax. Returns errors if any, or confirms valid syntax.',
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
        name: 'list_purl_files',
        description: 'List .purl files in a directory.',
        inputSchema: {
            type: 'object',
            properties: {
                directory: {
                    type: 'string',
                    description: 'Directory to search (defaults to current directory)',
                },
            },
        },
    },
];
// Helper: Read and parse .purl file
async function readPurlFile(filePath) {
    const absolutePath = path.resolve(filePath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(content);
}
// Helper: Find object by name (searches all cells, includes nested)
function findObject(project, name, cellName) {
    const cells = cellName
        ? project.cells.filter(c => c.label === cellName)
        : project.cells;
    for (const cell of cells) {
        const found = findObjectInList(cell.interior.objects, name);
        if (found)
            return { object: found, cell };
    }
    return null;
}
function findObjectInList(objects, name) {
    for (const obj of objects) {
        if (obj.name === name)
            return obj;
        if (isComponent(obj)) {
            const found = findObjectInList(obj.children, name);
            if (found)
                return found;
        }
    }
    return null;
}
// Helper: Get all objects (flattened)
function getAllObjects(objects, results = []) {
    for (const obj of objects) {
        results.push(obj);
        if (isComponent(obj)) {
            getAllObjects(obj.children, results);
        }
    }
    return results;
}
// Helper: Summarize object for listing
function summarizeObject(obj) {
    const summary = {
        name: obj.name,
        type: isComponent(obj) ? 'component' : obj.primeType,
        visible: obj.visible,
    };
    if (obj.tags?.length)
        summary.tags = obj.tags;
    if (obj.template)
        summary.template = true;
    if (obj.movable)
        summary.movable = true;
    if (obj.draggable)
        summary.draggable = true;
    if (obj.blocking)
        summary.blocking = obj.blocking;
    if (obj.snapToGrid)
        summary.snapToGrid = obj.snapToGrid;
    if (isComponent(obj))
        summary.childCount = obj.children.length;
    if (isPrime(obj) && obj.primeType === 'grid') {
        summary.columns = obj.columns;
        summary.rows = obj.rows;
    }
    return summary;
}
// Simple script validator (basic syntax check)
function validateScript(code) {
    const errors = [];
    const lines = code.split('\n');
    // Check for common syntax issues
    let inBlock = false;
    let blockIndent = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#'))
            continue;
        // Check for event handlers
        if (/^on\w+/.test(trimmed) && !trimmed.includes(':') && !trimmed.includes('{')) {
            errors.push(`Line ${lineNum}: Event handler missing colon or brace: ${trimmed}`);
        }
        // Check for unclosed strings
        const quoteCount = (trimmed.match(/"/g) || []).length;
        if (quoteCount % 2 !== 0) {
            errors.push(`Line ${lineNum}: Unclosed string quote`);
        }
        // Check for invalid keywords at start of line
        const validStarters = [
            'if', 'else', 'foreach', 'first', 'set', 'show', 'hide', 'goto', 'wait',
            'shout', 'shoutTo', 'spawn', 'destroy', 'shake', 'vibrate', 'pulse',
            'squeeze', 'bounce', 'spin', 'stop', 'next', 'prev', 'wrap', 'reset',
            'restart', 'transition', 'copy', 'log', 'sync', 'return', 'break',
            'clear', 'post', 'fetch', 'action', 'on'
        ];
        const firstWord = trimmed.split(/[\s:{(]/)[0];
        if (firstWord && !validStarters.some(s => firstWord.startsWith(s)) &&
            !trimmed.includes('.') && !trimmed.startsWith('}')) {
            // Might be a custom action call like "self.doThing" or object reference
            if (!trimmed.match(/^\w+\.\w+/)) {
                errors.push(`Line ${lineNum}: Unknown statement: ${firstWord}`);
            }
        }
    }
    return { valid: errors.length === 0, errors };
}
// Tool handlers
async function handleGetProject(args) {
    const project = await readPurlFile(args.path);
    const summary = {
        title: project.title,
        author: project.author,
        version: project.version,
        cellCount: project.cells.length,
        cells: project.cells.map(c => ({
            label: c.label,
            size: c.size,
            objectCount: c.interior.objects.length,
            hasScripts: !!(c.interior.scripts?.scripts?.length),
            gravity: c.gravity,
            wind: c.wind,
        })),
        startCell: project.cells.find(c => project.markers.some(m => m.type === 'start' && m.cellId === c.id))?.label,
        settings: project.settings,
    };
    return JSON.stringify(summary, null, 2);
}
async function handleListObjects(args) {
    const project = await readPurlFile(args.path);
    const cells = args.cellName
        ? project.cells.filter(c => c.label === args.cellName)
        : project.cells;
    if (args.cellName && cells.length === 0) {
        return `Cell "${args.cellName}" not found. Available cells: ${project.cells.map(c => c.label).join(', ')}`;
    }
    const result = {};
    for (const cell of cells) {
        const allObjects = getAllObjects(cell.interior.objects);
        result[cell.label] = allObjects.map(summarizeObject);
    }
    return JSON.stringify(result, null, 2);
}
async function handleGetScript(args) {
    const project = await readPurlFile(args.path);
    // Check if target is a cell
    if (args.target.startsWith('cell:')) {
        const cellName = args.target.slice(5);
        const cell = project.cells.find(c => c.label === cellName);
        if (!cell) {
            return `Cell "${cellName}" not found`;
        }
        const scripts = cell.interior.scripts?.scripts || [];
        if (scripts.length === 0) {
            return `Cell "${cellName}" has no scripts`;
        }
        return scripts.map(s => `# Script: ${s.name}\n${s.code}`).join('\n\n');
    }
    // Find object by name
    const found = findObject(project, args.target);
    if (!found) {
        return `Object "${args.target}" not found`;
    }
    const scripts = found.object.scripts?.scripts || [];
    if (scripts.length === 0) {
        return `Object "${args.target}" has no scripts`;
    }
    return scripts.map(s => `# Script: ${s.name}\n${s.code}`).join('\n\n');
}
async function handleValidateScript(args) {
    const result = validateScript(args.code);
    if (result.valid) {
        return 'Script syntax is valid';
    }
    return `Script has syntax errors:\n${result.errors.map(e => `  - ${e}`).join('\n')}`;
}
async function handleListPurlFiles(args) {
    const dir = args.directory || process.cwd();
    const absoluteDir = path.resolve(dir);
    try {
        const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
        const purlFiles = entries
            .filter(e => e.isFile() && e.name.endsWith('.purl'))
            .map(e => path.join(absoluteDir, e.name));
        if (purlFiles.length === 0) {
            return `No .purl files found in ${absoluteDir}`;
        }
        return `Found ${purlFiles.length} .purl file(s):\n${purlFiles.join('\n')}`;
    }
    catch (error) {
        return `Error reading directory: ${error}`;
    }
}
// Main server setup
const server = new Server({
    name: 'purl-mcp-server',
    version: '0.1.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
}));
// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        let result;
        switch (name) {
            case 'get_project':
                result = await handleGetProject(args);
                break;
            case 'list_objects':
                result = await handleListObjects(args);
                break;
            case 'get_script':
                result = await handleGetScript(args);
                break;
            case 'validate_script':
                result = await handleValidateScript(args);
                break;
            case 'list_purl_files':
                result = await handleListPurlFiles(args);
                break;
            default:
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
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Purl MCP Server running on stdio');
}
main().catch(console.error);
