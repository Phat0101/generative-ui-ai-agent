import express from "npm:express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { Request, Response, NextFunction } from "npm:@types/express";
import mcp_server from "./mcp.ts";
const app = express();
app.use(express.json());

const PORT = 3001;
const MESSAGES_PATH = "/mcp-messages"; // Path for client to POST to, and for SSE to reference

// Store active SSE transports
// Using a Map for better control over adding/deleting by sessionId
const activeSseTransports = new Map<string, SSEServerTransport>();

// Legacy SSE endpoint for older clients
app.get("/sse", async (req: Request, res: Response, next: NextFunction) => {
  console.log(`GET /sse: Incoming SSE connection request`);
  try {
    const transport = new SSEServerTransport(MESSAGES_PATH, res);
    const sessionId = transport.sessionId; // Read the read-only property

    if (!sessionId) {
      // If transport.sessionId is falsy, it's a critical issue as we can't assign to a read-only property.
      console.error("GET /sse: Critical error - SSEServerTransport.sessionId is undefined/falsy after instantiation.");
      if (!res.headersSent) {
          res.status(500).send("Failed to initialize SSE transport: transport has no session ID.");
      }
      return; 
    }
    
    // If we reach here, sessionId is valid and was provided by the transport.
    console.log(`GET /sse: SSEServerTransport provided sessionId: ${sessionId}`);

    activeSseTransports.set(sessionId, transport);
    console.log(`GET /sse: SSE transport stored for sessionId: ${sessionId}.`);

    req.on("close", () => {
      console.log(`GET /sse: Client disconnected for sessionId: ${sessionId}. Removing transport.`);
      activeSseTransports.delete(sessionId!); // sessionId is guaranteed to be truthy here
    });

    await mcp_server.connect(transport);
    console.log(`GET /sse: McpServer connected to transport for sessionId: ${sessionId}`);
  } catch (error) {
    console.error("GET /sse: Error during SSE setup:", error);
    next(error); // Pass error to Express error handler
  }
});

// Legacy message endpoint for older clients
app.post(MESSAGES_PATH, async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.query.sessionId as string;
  console.log(`POST ${MESSAGES_PATH}: Incoming message for sessionId: ${sessionId}. Body:`, req.body);

  if (!sessionId) {
    console.log(`POST ${MESSAGES_PATH}: Missing sessionId in query.`);
    res.status(400).send("Missing sessionId query parameter");
    return;
  }

  const transport = activeSseTransports.get(sessionId);

  if (transport) {
    console.log(`POST ${MESSAGES_PATH}: Found active transport for sessionId: ${sessionId}. Handling message.`);
    try {
      await transport.handlePostMessage(req, res, req.body);
      console.log(`POST ${MESSAGES_PATH}: Message handled for sessionId: ${sessionId}`);
      // handlePostMessage should have sent the response. If not, Express might hang or timeout.
    } catch (error) {
      console.error(`POST ${MESSAGES_PATH}: Error in transport.handlePostMessage for sessionId: ${sessionId}:`, error);
      // Check if headers are already sent by handlePostMessage on error before sending our own error response
      if (!res.headersSent) {
         next(error); // Pass to Express error handler
      } else {
        console.error(`POST ${MESSAGES_PATH}: Headers already sent, cannot use next(error). Error was:`, error);
      }
    }
  } else {
    console.log(`POST ${MESSAGES_PATH}: No active transport found for sessionId: ${sessionId}.`);
    res.status(404).send("No active transport found for the given session ID, or session has expired.");
  }
});

app.use((err: Error, req: Request, res: Response) => {
  console.error("Global error handler:", err);
  if (!res.headersSent) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Deno MCP Express SSE Server listening on port ${PORT}`);
  console.log(`SSE connections should be made to: GET http://localhost:${PORT}/sse`);
  console.log(`Client messages should be POSTed to: http://localhost:${PORT}${MESSAGES_PATH}?sessionId=<your_session_id>`);
});