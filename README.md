# Purl MCP Server

MCP server that connects AI assistants to your live [Purl Studio](https://purl.studio) project. Read objects, modify scripts, set properties — all from your AI coding tool.

## Quick Setup

### Claude Code

```bash
claude mcp add purl -- npx purl-mcp@latest
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "purl": {
      "command": "npx",
      "args": ["purl-mcp@latest"]
    }
  }
}
```

### VS Code

Add to your VS Code settings:

```json
{
  "mcp": {
    "servers": {
      "purl": {
        "command": "npx",
        "args": ["purl-mcp@latest"]
      }
    }
  }
}
```

## How It Works

The MCP server runs a local WebSocket bridge on port 3001. When you open Purl Studio in your browser, it automatically connects to the bridge. Your AI assistant communicates with the MCP server via stdio, which forwards requests to the browser over WebSocket.

```
AI Assistant  ←stdio→  MCP Server  ←WebSocket→  Browser (purl.studio)
```

No API keys, no cloud relay — everything runs locally on your machine.

## Tools

### Read Tools

| Tool | Description |
|------|-------------|
| `get_project` | Get project structure (cells, settings) |
| `list_objects` | List all objects with names, types, tags |
| `get_script` | Get script code for an object or cell |
| `get_states` | Get component states/presets |
| `dsl_reference` | Query Purl DSL documentation |
| `validate_script` | Check script syntax for errors |

### Write Tools

| Tool | Description |
|------|-------------|
| `set_property` | Set properties on an object (position, size, color, etc.) |
| `update_script` | Replace script code on an object or cell |
| `add_object` | Create a new object in a cell |
| `remove_object` | Delete an object |
| `update_cell` | Set cell-level properties (gravity, wind, size) |
| `clone_object` | Deep-clone an object tree |
| `bulk_set_property` | Set properties on multiple objects at once |

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PURL_WS_PORT` | `3001` | WebSocket server port |

You can also set the port in the browser via URL parameter: `https://purl.studio?mcpPort=3002`

## Requirements

- Node.js 18+
- A browser with Purl Studio open
