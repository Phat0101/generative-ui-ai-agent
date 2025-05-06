"""Defines the weather tool for the MCP server."""

async def get_weather(city: str) -> str:
    """Get the weather in a city
    
    Args:
        city: The city to get the weather for

    Returns:
        The weather in the city
    """
    print(f"get_weather called with city: {city}")
    return f"The weather in {city} is rainy"
