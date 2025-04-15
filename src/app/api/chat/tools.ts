import { tool as createTool } from 'ai';
import { z } from 'zod';
import yahooFinance from 'yahoo-finance2';

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
  description: 'Display the stock price for a stock symbol for a given range, If no range is provided or just what is the price, the default is 1y',
  parameters: z.object({
    symbol: z.string().describe('The company stock symbol to get the stock price for'),
    range: z.string().describe('The range of the stock price to get: 1 year is 1y, 5 years is 5y, 1 month is 1mo, 3 months is 3mo, 6 months is 6mo, 1 day is 1d, max is max, year to date is ytd. Default is 1y if not specified.'),
  }),
  execute: async function ({ symbol, range = '1y' }) {
    console.log("Fetching stock price for symbol:", symbol);
    try {
      if (range === '1d') { range = '1y' }
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=1d`,);
      const data = await response.json();
      console.log("Stock price data:", data.chart.result[0]);
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

export const stockFinancialTool = createTool({
  description: 'Display key financial data for a company by stock symbol (e.g., Market Cap, P/E Ratio, EPS, Dividend Yield).',
  parameters: z.object({
    symbol: z.string().describe('The company stock symbol to get financial data for'),
  }),
  execute: async function ({ symbol }) {
    console.log("Fetching financial data for symbol:", symbol);
    try {
      const quote = await yahooFinance.quote(symbol);
      console.log(`Quote data for ${symbol}:`, quote);

      const formatValue = (value: number | undefined | null, prefix = '', suffix = '', decimals = 2): string => {
        if (typeof value === 'number' && !isNaN(value)) {
           if (value > 1_000_000_000) return `${prefix}${(value / 1_000_000_000).toFixed(decimals)}B${suffix}`;
          if (value > 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(decimals)}M${suffix}`;
          if (value > 1_000) return `${prefix}${(value / 1_000).toFixed(decimals)}K${suffix}`;
          return `${prefix}${value.toFixed(decimals)}${suffix}`;
        }
        return 'N/A';
      };

      return {
        symbol: quote?.symbol || symbol.toUpperCase(),
        name: quote?.longName || quote?.shortName || 'N/A',
        marketCap: formatValue(quote?.marketCap, '$'),
        peRatioTTM: formatValue(quote?.trailingPE, '', '', 2),
        epsTTM: formatValue(quote?.epsTrailingTwelveMonths, '$'),
        forwardPE: formatValue(quote?.forwardPE, '', '', 2),
        epsForward: formatValue(quote?.epsForward, '$'),
        dividendYield: formatValue(quote?.trailingAnnualDividendYield, '', '%', 2),
        priceToBook: formatValue(quote?.priceToBook, '', '', 2),
        marketState: quote?.marketState || 'N/A',
        regularMarketPrice: formatValue(quote?.regularMarketPrice, '$'),
        regularMarketChangePercent: formatValue(quote?.regularMarketChangePercent, '', '%', 2),
      };
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred while fetching financial data.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error(`Error fetching financial data for ${symbol}:`, errorMessage);
      return { 
        symbol: symbol.toUpperCase(), 
        name: symbol.toUpperCase(),
        error: `Could not retrieve financial data for ${symbol}. ${errorMessage}`
      };
    }
  },
});

export const tools = {
  displayWeather: weatherTool,
  displayStockPrice: stockPriceTool,
  displayStockFinancials: stockFinancialTool,
};