import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
  description: 'Display the weather for a San Francisco',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { weather: 'Sunny', temperature: 75, location };
  },
});

export const stockPriceTool = createTool({
  description: 'Display the stock price for a stock symbol',
  parameters: z.object({
    symbol: z.string().describe('The company stock symbol to get the stock price for'),
  }),
  execute: async function ({ symbol }) {
    console.log("Fetching stock price for symbol:", symbol);
    try {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`,);
      const data = await response.json();
      const timestamp = data.chart.result[0].timestamp;
      const prices = data.chart.result[0].indicators.quote[0].close
      const stockPrice = prices[prices.length - 1];
      return { stockPrice, prices, timestamp, symbol };
    } catch (error) {
      console.error("Error fetching stock price:", error);
      return { stockPrice: 0, symbol };
    }
  },
});

export const tools = {
  displayWeather: weatherTool,
  displayStockPrice: stockPriceTool,
};