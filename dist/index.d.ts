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
export {};
