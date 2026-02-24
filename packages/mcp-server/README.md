# @employarmor/mcp-server

MCP server for scanning AI hiring tool compliance via [EmployArmor](https://employarmor.com).

## Setup

### Claude Desktop / Cursor / any MCP client

Add to your MCP config:

```json
{
  "mcpServers": {
    "employarmor": {
      "command": "npx",
      "args": ["@employarmor/mcp-server"]
    }
  }
}
```

### Tool: `scan_compliance`

Scans your AI hiring tools for compliance risks across US states.

**Parameters:**
- `states` — Array of US state codes (e.g. `["IL", "CA", "NYC"]`)
- `tools` — Array of tool IDs (e.g. `["hirevue", "greenhouse", "linkedin-recruiter"]`)
- `employeeCount` — Total employees (integer)

**Common tool IDs:** `hirevue`, `greenhouse`, `lever`, `workday`, `linkedin-recruiter`, `indeed`, `pymetrics`, `eightfold`, `textio`, `checkr`, `chatgpt`, `claude`, `copilot`, `bamboohr`, `rippling`, `adp`

**Regulated states:** IL, CO, CA, NYC, MD, TX

**Returns:** Compliance score, risk level, applicable laws, compliance gaps, and per-tool risk analysis.

## Development

```bash
npm install
npm run build
npm start
```
