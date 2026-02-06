# Purl MCP Server

MCP (Model Context Protocol) server that exposes Purl Studio project files to AI assistants like Claude.

## Features

- **get_project** - Read and parse .purl files, get project structure
- **list_objects** - List objects with names, types, tags, and properties
- **get_script** - Get script code for any object or cell
- **validate_script** - Check script syntax for errors
- **list_purl_files** - Find .purl files in a directory

## Installation

```bash
npm install
npm run build
```

## Usage with Claude Code

Add to your Claude Code MCP settings (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "purl": {
      "command": "node",
      "args": ["/Users/yurikovenski/purl-mcp-server/dist/index.js"]
    }
  }
}
```

Then restart Claude Code. The tools will be available automatically.

## Example Usage

Once configured, you can ask Claude Code:

- "List objects in my game.purl file"
- "Show me the script for the Player object in ~/projects/game.purl"
- "Validate this script: onClick: show Message"
- "What cells are in ~/Desktop/puzzle.purl?"

## Tools

### get_project

Read a .purl file and return project summary.

```
Input: { path: "~/game.purl" }
Output: { title, cells, settings, ... }
```

### list_objects

List all objects in a project or specific cell.

```
Input: { path: "~/game.purl", cellName?: "Level1" }
Output: { "Level1": [{ name, type, tags, ... }] }
```

### get_script

Get script code for an object or cell.

```
Input: { path: "~/game.purl", target: "Player" }
Input: { path: "~/game.purl", target: "cell:Level1" }
Output: "onClick:\n  show Message"
```

### validate_script

Check if script syntax is valid.

```
Input: { code: "onClick: show Message" }
Output: "Script syntax is valid"
```

## Development

```bash
npm run dev    # Watch mode
npm run build  # Build once
npm start      # Run server
```
