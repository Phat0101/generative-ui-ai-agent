'use client';

import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

// Define a type for search result items
interface SearchResultItem {
  title?: string;
  url?: string;
  content?: string;
}

interface SearchResultsProps {
  results: SearchResultItem[];
}

export const SearchResults = ({ results }: SearchResultsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-1 border border-gray-200 dark:border-gray-600/50 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 cursor-pointer"
        onClick={toggleExpanded}
      >
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Web Search Results ({results.length})</h4>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      
      {isExpanded && (
        <div className="p-2 text-xs space-y-2 bg-white dark:bg-gray-800">
          {results.length > 0 ? (
            results.map((item: SearchResultItem, itemIndex: number) => (
              <div key={itemIndex} className="p-1 border-b border-gray-200 dark:border-gray-700/50 last:border-b-0">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-words flex items-center gap-1"
                >
                  {item.title || 'Untitled Result'}
                  <ExternalLink size={12} className="inline flex-shrink-0" />
                </a>
                <p className="text-gray-700 dark:text-gray-300 text-xs mt-0.5 line-clamp-2">
                  {item.content || 'No content preview available.'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No results found or failed to parse results.</p>
          )}
        </div>
      )}
    </div>
  );
}; 