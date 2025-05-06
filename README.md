# Generative UI Chat Demo

This is a [Next.js](https://nextjs.org) project demonstrating the power of the [Vercel AI SDK](https://sdk.vercel.ai/) to create generative user interfaces within a chat application, including integration with a custom Python-based MCP (Model Context Protocol) server.

## Overview

This application showcases how Large Language Models (LLMs) can go beyond text responses by dynamically generating and rendering relevant UI components based on the conversation context. Ask the chat for:

*   Weather information (e.g., "What's the weather like in San Francisco?" - uses local tool, or "What's the weather in Sydney?" - uses MCP server tool)
*   Stock price information and charts (e.g., "Show me the stock price for AAPL over the last year" - uses local tool)

The AI determines when to use specialized tools, fetches the necessary data, and returns the results. Tools can be defined locally within the Next.js application or served remotely via the MCP server.

The frontend UI then iterates through the `message.parts` array provided by the Vercel AI SDK's `useChat` hook. When a part with `type === 'tool-invocation'` is found, a loading indicator (⚙️ Calling ToolName...) is shown. Once the `state` becomes `'result'`, the corresponding UI component (`Weather` card or `StockChart`) is rendered directly within the chat flow, displaying the tool's output below the 'Called ToolName' indicator.

## Key Technologies

*   **Frontend Framework:** [Next.js](https://nextjs.org) (App Router)
*   **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) (using `@ai-sdk/react`, `useChat` hook, local and MCP tool calling, `message.parts` for tool results)
*   **Backend Tool Server:** Python with [FastAPI](https://fastapi.tiangolo.com/)/[Uvicorn](https://www.uvicorn.org/) (via `fastapi dev`) serving tools over MCP.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **UI Components:** Custom React components (`Weather`, `StockChart`)
*   **Theme:** [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode

## Getting Started

### 1. Prerequisites

*   Node.js (version recommended by Next.js)
*   Python (version 3.8+ recommended)
*   `uv` (Python package installer/virtual environment manager): `pip install uv` or follow [official uv installation](https://github.com/astral-sh/uv#installation)

### 2. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-directory>
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
    # MCP_WEATHER_URL=http://your-mcp-server-address/sse 
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
    *(Note: You might need to create the `requirements.txt` file based on your MCP server imports, e.g., `mcp.server.fastmcp` if it's a custom library)*

### 5. Run the Development Servers:

*   **Run the Python MCP Server:**
    In the `mcp-server` directory (with the virtual environment active if not using `uv run`), start the server:
    ```bash
    # Activate venv first: source .venv/bin/activate 
    uv run main.py 
    ```
*   **Run the Next.js Frontend:**
    In the project root directory (in a separate terminal):
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

*   Remember to configure your environment variables (like `GOOGLE_GENERATIVE_AI_API_KEY` and `MCP_WEATHER_URL` pointing to your deployed MCP server) in the Vercel project settings.
*   The Python MCP server needs to be deployed separately (e.g., using Docker on a platform like Google Cloud Run, Fly.io, Railway, etc.).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on deploying the frontend.
