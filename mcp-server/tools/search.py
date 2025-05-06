"""Defines the web search tool using Tavily for the MCP server."""

import os
from tavily import AsyncTavilyClient

async def search_web(query: str) -> list[dict]:
    """Search the web using Tavily based on a query and return the results.

    Args:
        query: The search query string.

    Returns:
        A list of search result dictionaries, each containing 'title', 'url', and 'content'.
        Returns an empty list if the API key is missing or an error occurs.
        
    """
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        print("Error: TAVILY_API_KEY environment variable not set.")
        return []

    try:
        tavily_client = AsyncTavilyClient(api_key=api_key)
        response = await tavily_client.search(query=query, search_depth="advanced") 
        
        # Extract relevant parts of the results 
        results = [
            {"title": res.get("title"), "url": res.get("url"), "content": res.get("content")}
            for res in response.get("results", [])
        ]
        print(f"Tavily async search for '{query}' returned {len(results)} results. Results: {results}")
        return results
    except Exception as e:
        print(f"Error during Tavily async search: {e}")
        return []
