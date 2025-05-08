# Use an official Deno image
FROM denoland/deno:2.3.1 
# Using a specific version for stability, e.g., 1.44.4. Check for latest or your preferred version.

# Set the working directory in the container
WORKDIR /app

# Copy the Deno application files
# This assumes all necessary files for deno-mcp-server are in the context of this Dockerfile (deno-mcp-server/)
COPY . .

# Expose the port the Deno server runs on
EXPOSE 3001

# Command to run the Deno application
# Deno's entrypoint is `deno`, so CMD starts with `run`
# --allow-net is needed for the server to listen
# --allow-read might be needed if you read other files (e.g., mcp.ts if it was in a sub-folder not copied yet)
# --allow-env might be needed if your Deno server uses environment variables
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "main.ts"] 