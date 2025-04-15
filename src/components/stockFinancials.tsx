'use client';

import { Landmark } from 'lucide-react'; // Example icon for financials

type StockFinancialsProps = {
  symbol: string;
  name: string;
  marketCap?: string;
  peRatioTTM?: string;
  epsTTM?: string;
  forwardPE?: string;
  epsForward?: string;
  dividendYield?: string;
  priceToBook?: string;
  marketState?: string;
  regularMarketPrice?: string;
  regularMarketChangePercent?: string;
  error?: string;
};

// Helper component for displaying each metric item
const MetricItem = ({ label, value }: { label: string; value?: string }) => {
  if (!value || value === 'N/A') return null; // Don't render if value is missing or N/A
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="font-medium text-gray-800 dark:text-gray-100">{value}</span>
    </div>
  );
};

export const StockFinancials = (props: StockFinancialsProps) => {
  const { 
    symbol, 
    name,
    error,
    marketCap,
    peRatioTTM,
    epsTTM,
    forwardPE,
    epsForward,
    dividendYield,
    priceToBook,
    marketState,
    regularMarketPrice,
    regularMarketChangePercent 
  } = props;

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-inner relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2 border-b border-gray-300 dark:border-gray-600 pb-2 mb-3">
        <div className="flex items-center space-x-3">
          <Landmark className="w-7 h-7 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{name} ({symbol.toUpperCase()})</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Market Status: {marketState}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 pl-2">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{regularMarketPrice}</p>
          {regularMarketChangePercent && regularMarketChangePercent !== 'N/A' && (
             <p className={`text-sm font-medium ${
                regularMarketChangePercent.startsWith('-') 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
             }`}>
               ({regularMarketChangePercent})
             </p>
          )}
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        <MetricItem label="Market Cap" value={marketCap} />
        <MetricItem label="P/E (TTM)" value={peRatioTTM} />
        <MetricItem label="EPS (TTM)" value={epsTTM} />
        <MetricItem label="Forward P/E" value={forwardPE} />
        <MetricItem label="Forward EPS" value={epsForward} />
        <MetricItem label="Dividend Yield" value={dividendYield} />
        <MetricItem label="Price/Book" value={priceToBook} />
        {/* Add more metrics as needed */}
      </div>
    </div>
  );
};