# Generative UI Chat Demo

This is a [Next.js](https://nextjs.org) project demonstrating the power of the [Vercel AI SDK](https://sdk.vercel.ai/) to create generative user interfaces within a chat application, including integration with custom MCP (Model Context Protocol) servers built with Python and Deno/TypeScript.

## Overview

This application showcases how Large Language Models (LLMs) can go beyond text responses by dynamically generating and rendering relevant UI components based on the conversation context. Ask the chat for:

*   Web search results (e.g., "What is the current population of Tokyo?" - uses Python MCP server tool)
*   Adding two numbers (e.g., "What is 5 + 10?" - uses Deno MCP server tool)
*   Weather information (e.g., "What's the weather like in San Francisco?" - uses local tool)
*   Stock price information and charts (e.g., "Show me the stock price for AAPL over the last year" - uses local tool)

The AI determines when to use specialized tools, fetches the necessary data, and returns the results. Tools can be defined locally within the Next.js application or served remotely via the MCP servers.

The frontend UI then iterates through the `message.parts` array provided by the Vercel AI SDK's `useChat` hook. When a part with `type === 'tool-invocation'` is found, a loading indicator (⚙️ Calling ToolName...) is shown. Once the `state` becomes `'result'`, the corresponding UI component is rendered directly within the chat flow, displaying the tool's output below the 'Called ToolName' indicator.

## Key Technologies

*   **Frontend Framework:** [Next.js](https://nextjs.org) (App Router)
*   **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) (using `@ai-sdk/react`, `useChat` hook, local and MCP tool calling, `message.parts` for tool results)
*   **Backend Tool Server (Python):** Python with [FastMCP](https://github.com/modelcontextprotocol/python-sdk) serving tools.
*   **Backend Tool Server (Deno):** Deno with [Express](https://github.com/modelcontextprotocol/typescript-sdk) and TypeScript serving tools over MCP.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **UI Components:** Custom React components (`Weather`, `StockChart`, `SearchResults`)
*   **Theme:** [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
*   **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

## Getting Started (Recommended: Docker Compose)

This method runs the Next.js app, the Python MCP server, and the Deno MCP server in isolated Docker containers using Docker Compose.

### 1. Prerequisites

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Clone the repository:
    ```bash
    git clone https://github.com/Phat0101/generative-ui-ai-agent.git
    cd generative-ui-ai-agent
    ```

### 3. Set up Environment Variables:

*   Create a `.env` file in the **root** directory of the project.
*   Add your API keys to this file:
    ```dotenv
    # .env (in project root)
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
    TAVILY_API_KEY=your_tavily_api_key_here
    ```
    *   You can get a Tavily API key from [tavily.com](https://tavily.com).
    *   Docker Compose will automatically load this file and make the variables available to the respective containers (`next_app` and `python_mcp_server`).

### 4. Build and Run with Docker Compose:

*   From the project root directory, run:
    ```bash
    docker-compose up --build -d
    ```
    *   `--build` forces Docker to build the images using the Dockerfiles.
    *   `-d` runs the containers in detached mode (in the background).

### 5. Access the Application:

*   Open [http://localhost:3000](http://localhost:3000) in your browser.
*   The Next.js app will communicate with the Python MCP server at `http://python_mcp_server:8051/sse` and the Deno MCP server at `http://deno_mcp_server:3001/sse` within the Docker network.

## Manual Development Setup (Alternative)

Use this method if you prefer to run each service directly on your host machine without Docker.

### 1. Prerequisites

*   Node.js (version recommended by Next.js)
*   Python (version 3.12+ recommended)
*   Deno (version 1.44+ or 2.x recommended)
*   `uv` (Python package installer): `pip install uv` or follow [official uv installation](https://github.com/astral-sh/uv#installation)

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
    ```
*   Set up environment variables:
    Create a `.env.local` file in the root directory:
    ```dotenv
    # .env.local (in project root)
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
    # If MCP servers run locally, defaults in route.ts to localhost might work.
    # Otherwise, set explicit URLs if needed:
    # PYTHON_MCP_SERVER_URL=http://localhost:8051/sse
    # DENO_MCP_SERVER_URL=http://localhost:3001/sse
    ```

### 4. Set up the Python MCP Server:

*   Navigate to the `python-mcp-server` directory:
    ```bash
    cd python-mcp-server
    ```
*   Create a virtual environment and install dependencies using `uv`:
    ```bash
    uv venv # Create .venv
    uv pip install . # Install from pyproject.toml
    ```
*   Set up environment variables for the Python server:
    Create a `.env` file inside the `python-mcp-server` directory:
    ```dotenv
    # .env (in python-mcp-server directory)
    TAVILY_API_KEY=your_tavily_api_key_here
    ```

### 5. Set up the Deno MCP Server:

*   Navigate to the `deno-mcp-server` directory:
    ```bash
    cd ../deno-mcp-server # Assuming you are in python-mcp-server
    ```
*   Dependencies (like `express`, `@types/express`, `@modelcontextprotocol/sdk`) are typically fetched by Deno automatically based on the `npm:` specifiers in the `import` statements when you run the script. No explicit install step is usually needed unless using a `deno.jsonc` task runner.

### 6. Run the Development Servers:

You'll need three separate terminal windows.

*   **Run the Python MCP Server:**
    In the `python-mcp-server` directory, run:
    ```bash
    uv run main.py 
    ```
    It should be available at `http://localhost:8051`.

*   **Run the Deno MCP Server:**
    In the `deno-mcp-server` directory, run:
    ```bash
    deno run --allow-net --allow-read --allow-env main.ts
    ```
    It should be available at `http://localhost:3001`.

*   **Run the Next.js Frontend:**
    In the project **root** directory, run:
    ```bash
    npm run dev
    ```
    It should be available at `http://localhost:3000`.

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Backend Details

### Python MCP Server (`python-mcp-server`)

The Python server is built using `FastMCP` and serves tools that the frontend can utilize.
*   `main.py`: Entry point, initializes `FastMCP`, registers tools, runs the server via Uvicorn.
*   `tools/search.py`: Implements the `search_web` tool using the `tavily-python` library.

### Deno MCP Server (`deno-mcp-server`)

The Deno server uses Express.js (via `npm:` specifiers) and the TypeScript MCP SDK to serve tools.
*   `main.ts`: Entry point, sets up the Express server, defines SSE routes (`/sse`, `/mcp-messages`), handles transport connections and message posting.
*   `mcp.ts`: Defines the `McpServer` instance and registers tools (like `addTwoNumbers`) and resources.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

*   Remember to configure your environment variables (like `GOOGLE_GENERATIVE_AI_API_KEY`) in the Vercel project settings.
*   The **Python and Deno MCP servers** need to be deployed separately (e.g., using their Docker images on platforms like Google Cloud Run, Fly.io, Railway, etc.).
*   Ensure the deployed MCP servers are accessible via public URLs.
*   Configure the `PYTHON_MCP_SERVER_URL` and `DENO_MCP_SERVER_URL` environment variables in your Vercel project settings to point to the deployed URLs of your Python and Deno MCP servers, respectively.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on deploying the frontend.

