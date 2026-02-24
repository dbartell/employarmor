#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_URL = process.env.EMPLOYARMOR_API_URL || "https://employarmor.com";

const server = new McpServer({
  name: "employarmor",
  version: "1.0.0",
});

server.tool(
  "scan_compliance",
  "Scan AI hiring tools for compliance risks across US states. Returns compliance score, risk level, applicable laws, gaps, and per-tool analysis. Regulated states: IL, CO, CA, NYC, MD, TX. Common tool IDs: hirevue, greenhouse, lever, workday, linkedin-recruiter, indeed, pymetrics, eightfold, textio, checkr, chatgpt, claude, copilot, bamboohr, rippling, adp, hubstaff",
  {
    states: z.array(z.string()).describe("US state codes (e.g. ['IL', 'CA', 'NYC'])"),
    tools: z.array(z.string()).describe("AI hiring tool IDs (e.g. ['hirevue', 'greenhouse'])"),
    employeeCount: z.number().int().positive().describe("Total number of employees"),
  },
  async ({ states, tools, employeeCount }) => {
    const res = await fetch(`${API_URL}/api/v1/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ states, tools, employeeCount }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { content: [{ type: "text" as const, text: `Error: ${res.status} ${err}` }] };
    }

    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
