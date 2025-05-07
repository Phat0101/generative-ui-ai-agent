# Generative UI Chat Demo

This is a [Next.js](https://nextjs.org) project demonstrating the power of the [Vercel AI SDK](https://sdk.vercel.ai/) to create generative user interfaces within a chat application, including integration with a custom Python-based MCP (Model Context Protocol) server.

## Overview

This application showcases how Large Language Models (LLMs) can go beyond text responses by dynamically generating and rendering relevant UI components based on the conversation context. Ask the chat for:

*   Web search results (e.g., "What is the current population of Tokyo?" - uses MCP server tool)
*   Weather information (e.g., "What's the weather like in San Francisco?" - uses local tool)
*   Stock price information and charts (e.g., "Show me the stock price for AAPL over the last year" - uses local tool)

The AI determines when to use specialized tools, fetches the necessary data, and returns the results. Tools can be defined locally within the Next.js application or served remotely via the MCP server.

The frontend UI then iterates through the `message.parts` array provided by the Vercel AI SDK's `useChat` hook. When a part with `type === 'tool-invocation'` is found, a loading indicator (⚙️ Calling ToolName...) is shown. Once the `state` becomes `'result'`, the corresponding UI component is rendered directly within the chat flow, displaying the tool's output below the 'Called ToolName' indicator.

## Key Technologies

*   **Frontend Framework:** [Next.js](https://nextjs.org) (App Router)
*   **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) (using `@ai-sdk/react`, `useChat` hook, local and MCP tool calling, `message.parts` for tool results)
*   **Backend Tool Server:** Python with [FastAPI](https://fastapi.tiangolo.com/)/[Uvicorn](https://www.uvicorn.org/) serving tools over MCP.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **UI Components:** Custom React components (`Weather`, `StockChart`, `SearchResults`)
*   **Theme:** [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode

## Getting Started

### 1. Prerequisites

*   Node.js (version recommended by Next.js)
*   Python (version 3.8+ recommended)
*   `uv` (Python package installer/virtual environment manager): `pip install uv` or follow [official uv installation](https://github.com/astral-sh/uv#installation)

### 2. Clone the repository:
    ```bash
    git clone https://github.com/Phat0101/generative-ui-ai-agent.git
    cd generative-ui-ai-agent
    ```

### 3. Set up the Next.js Frontend:

*   Navigate to the project root.
*   Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
*   Set up environment variables:
    Create a `.env.local` file in the root directory and add your AI provider API key:
    ```
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
    # Optionally, set the MCP server URL if not running on default localhost:8051
    # MCP_SERVER_URL=http://your-mcp-server-address/sse 
    ```

### 4. Set up the Python MCP Server:

*   Navigate to the `mcp-server` directory:
    ```bash
    cd mcp-server
    ```
*   Create a virtual environment and install dependencies using `uv`:
    ```bash
    uv venv # Create .venv
    uv pip install -r requirements.txt # Install packages
    ```
*   Set up environment variables for the MCP server:
    Create a `.env` file inside the `mcp-server` directory and add your Tavily API key:
    ```
    TAVILY_API_KEY=your_tavily_api_key_here
    ```
    You can get a Tavily API key from [tavily.com](https://tavily.com).

### 5. Run the Development Servers:

*   **Run the Python MCP Server:**
    In the `mcp-server` directory (with the virtual environment active if not using `uv run`), start the server:
    ```bash
    uv run main.py 
    ```
    The server should start and be accessible at `http://localhost:8051`.

*   **Run the Next.js Frontend:**
    In the project root directory (in a separate terminal):
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend (MCP Server) Details

The Python MCP server (`mcp-server`) is built using `FastMCP` and serves tools that the Vercel AI SDK frontend can utilize. Key components:

*   `main.py`: The entry point of the server. It initializes `FastMCP`, defines the server's lifespan (handling startup and shutdown), registers the available tools, and runs the server.
*   `tools/search.py`: Contains the implementation of the `search_web` tool. This tool uses the `tavily-python` library to perform web searches via the Tavily API.

Tools registered with the `FastMCP` instance become available to the AI model when connected via the Vercel AI SDK.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

*   Remember to configure your environment variables (like `GOOGLE_GENERATIVE_AI_API_KEY` and the MCP server URL if not running on the default `http://localhost:8051/sse`) in the Vercel project settings.
*   The Python MCP server needs to be deployed separately (e.g., using Docker on a platform like Google Cloud Run, Fly.io, Railway, etc.). Ensure the deployed server is accessible via a public URL and configure `MCP_SERVER_URL` in your Vercel environment variables accordingly.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on deploying the frontend.
