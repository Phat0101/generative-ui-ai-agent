'use client'; // Add this directive for recharts

import { LineChart as ChartIcon } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

type StockChartProps = {
  stockPrice: number;
  prices: (number | null)[]; // Allow nulls in price array
  timestamp: number[];   
  symbol: string;
};

export const StockChart = ({ stockPrice, prices, timestamp, symbol }: StockChartProps) => {
  
  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' , year: 'numeric' });

  // Combine timestamps and prices into data for the chart
  const chartData = timestamp.map((ts, index) => ({
    date: formatDate(ts),
    price: prices[index] !== null ? prices[index] : undefined, // Map null to undefined for recharts
  })).filter(data => data.price !== undefined); // Ensure we only plot valid points

  const startDate = chartData.length > 0 ? chartData[0].date : 'N/A';
  const endDate = chartData.length > 0 ? chartData[chartData.length - 1].date : 'N/A';

  // Determine Y-axis domain with some padding, handling cases with few/no valid points
  const validPrices = chartData.map(d => d.price as number);
  let yDomain: [number, number] | [string, string] = ['auto', 'auto'];
  if (validPrices.length > 0) {
    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);
    const domainPadding = (maxPrice - minPrice) * 0.1 || 1; // Add padding, at least 1 if min=max
    yDomain = [
      Math.max(0, minPrice - domainPadding), // Ensure domain doesn't go below 0
      maxPrice + domainPadding
    ];
  }
  
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <ChartIcon className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{symbol.toUpperCase()} Stock Price</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Range: {startDate} - {endDate}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 pl-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${stockPrice?.toFixed(2) || 'N/A'}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 ? (
        <div className="h-48 md:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}> {/* Adjust left margin for Y-axis */}
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /> 
              <XAxis 
                dataKey="date" 
                fontSize={10}
                tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                domain={yDomain} 
                fontSize={10}
                tickFormatter={(value) => `$${value.toFixed(0)}`} 
                tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))', 
                  borderRadius: 'var(--radius)', // Use CSS variable if available
                  color: 'hsl(var(--foreground))' // Text color for tooltip
                }} 
                itemStyle={{ color: '#10b981' }} // Green line color
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} 
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#10b981" // Tailwind green-500
                strokeWidth={2}
                dot={false} 
                connectNulls // Connect line segments across null data points
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">Not enough data to display chart.</p>
      )}
    </div>
  );
};
