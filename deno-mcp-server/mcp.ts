import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const mcp_server = new McpServer({ 
  name: "Deno MCP Express SSE Server",
  version: "0.1.0",
});

mcp_server.tool(
  "addTwoNumbers",
  "Add two numbers together",
  {
    a: z.number().describe("The first number to be added."),
    b: z.number().describe("The second number to be added.")
  },
  async ({ a, b }) => Promise.resolve({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// Add a dynamic greeting resource
// mcp_server.resource(
//   "greeting",
//   new ResourceTemplate("greeting://{name}", { list: undefined }),
//   async (uri, { name }) => Promise.resolve({
//     contents: [{
//       uri: uri.href,
//       text: `Hello, ${name}!`
//     }]
//   })
// );

export default mcp_server;