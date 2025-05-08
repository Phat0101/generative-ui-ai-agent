"""Main file for the MCP server"""
import asyncio
from contextlib import asynccontextmanager
import os
from typing import AsyncIterator

from mcp.server.fastmcp import FastMCP
from tools.search import search_web

@asynccontextmanager
async def lifespan(server: FastMCP) -> AsyncIterator[None]:
    """Lifespan for the MCP server"""
    print("Starting MCP server")
    try:
        yield
    finally:
        print("Shutting down MCP server")
        await server.shutdown()

mcp = FastMCP("mcp-search-server",
              description="Performs web searches using Tavily",
              host="0.0.0.0",
              port=8051,
              lifespan=lifespan)

mcp.tool()(search_web)

async def main():
    """Main function"""
    transport = os.getenv("TRANSPORT", "sse")
    if transport == "sse":
        await mcp.run_sse_async()
    else:
        await mcp.run_stdio_async()

if __name__ == "__main__":
    asyncio.run(main())
