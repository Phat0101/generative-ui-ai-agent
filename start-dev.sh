#!/bin/bash

echo "Starting all development servers in the background..."
echo "Project Root: $(pwd)"

# Ensure script exits if any command fails
set -e

# --- Start Next.js dev server ---
echo "[1/3] Starting Next.js server (npm run dev)..."
# Run in the background
npm run dev &
NEXT_PID=$!
echo "      Next.js PID: $NEXT_PID"

# --- Start Deno MCP server ---
echo "[2/3] Starting Deno MCP server (deno run -A)..."
# Run in the background. Using -A for broad permissions in dev.
deno run -A deno-mcp-server/main.ts &
DENO_PID=$!
echo "      Deno PID: $DENO_PID"

# --- Start Python MCP server ---
echo "[3/3] Starting Python MCP server (uv run main.py)..."
# Group commands in a subshell and run in background
(
  echo "      Changing directory to python-mcp-server..."
  cd python-mcp-server || { echo "      ERROR: Failed to cd into python-mcp-server"; exit 1; }
  
  # Check for virtual environment activation script
  if [ -f ".venv/bin/activate" ]; then
    echo "      Activating Python virtual environment..."
    source .venv/bin/activate
    echo "      Running Python server with uv..."
    # Run uv in the foreground *within this subshell*
    uv run main.py
  else
    echo "      ERROR: Python virtual environment not found at ./python-mcp-server/.venv/bin/activate"
    exit 1
  fi
) &
PYTHON_SUBPROCESS_PID=$!
echo "      Python Subprocess PID: $PYTHON_SUBPROCESS_PID (uv process runs within this)"

# --- Instructions ---
echo ""
echo "Servers launched."
echo "Use 'docker-compose logs -f ...' if running via Docker."
echo "If running manually via this script, monitor individual terminal outputs (if any) or use process monitoring tools."
echo ""
echo "To STOP the manually started background servers, run this command:"
# Note: pkill patterns might need adjustment based on exact process names
# Using kill with captured PIDs is more reliable if available
echo "  kill $NEXT_PID $DENO_PID $PYTHON_SUBPROCESS_PID" # Kills the subshell for python
echo "  # You might still need to kill the underlying 'uv run' or 'python' process if kill $PYTHON_SUBPROCESS_PID doesn't stop it completely."
echo "  # Alternative using pkill (potentially less precise):"
echo "  # pkill -f 'npm run dev' && pkill -f 'deno run -A deno-mcp-server/main.ts' && pkill -f 'uv run main.py'"
echo ""

# Optional: Wait here if you want the script to block until Ctrl+C
# Useful if you want one terminal to manage starting/stopping via Ctrl+C
# trap "echo 'Stopping servers...'; kill $NEXT_PID $DENO_PID $PYTHON_SUBPROCESS_PID; exit" INT TERM
# wait 