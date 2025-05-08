# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Install uv
RUN pip install --no-cache-dir uv

# Set the working directory in the container
WORKDIR /app

# Copy the pyproject.toml first to leverage Docker cache for dependencies
COPY pyproject.toml ./pyproject.toml

# Install project dependencies using uv from pyproject.toml in current directory (.)
# The --system flag installs packages into the system Python, standard for containers.
RUN uv pip install --system --no-cache .

# Copy the rest of the application code into the container
COPY . .

# Make port 8051 available
EXPOSE 8051

# Run main.py when the container launches
# TAVILY_API_KEY will be injected by Docker Compose from the .env file
CMD ["uv", "run", "main.py"] 