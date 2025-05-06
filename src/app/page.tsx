'use client';

import { Suspense } from 'react';
import { useChat } from '@ai-sdk/react';
import { Weather } from '@/components/weather';
import { StockChart } from '@/components/stockChart';
import { SearchResults } from '@/components/searchResults';
import { ThemeToggle } from '@/components/theme-toggle';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, CircleCheck } from 'lucide-react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 md:px-10">
        <h1 className="text-2xl font-bold">Generative UI Chat</h1>
        <ThemeToggle />
      </div>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 mb-14" >
        <div className="flex-1 overflow-y-auto p-4 space-y-4 container mx-auto max-w-3xl">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-3 rounded-lg shadow ${message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
              >
                <div className="mb-2 prose prose-sm dark:prose-invert max-w-none">
                  {message.role === 'user' ? (
                    message.content
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  )}
                </div>

                <div>
                  {message.parts.map((part, index) => {
                    if (part.type === 'tool-invocation') {
                      const { toolInvocation } = part;
                      const { toolName, state, args } = toolInvocation;

                      const renderToolCallIndicator = (toolDisplayName: string, isLoading: boolean) => (
                        <div key={`${index}-indicator`} className="flex items-center space-x-2 mt-2 text-xs text-gray-600 dark:text-gray-400 p-2 rounded bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50">
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          ) : (
                            <CircleCheck className="h-4 w-4 text-green-500" />
                          )}
                          <span>
                            {isLoading
                              ? `Calling ${toolDisplayName}...`
                              : `Called ${toolDisplayName}`}
                          </span>
                        </div>
                      );

                      let toolDisplayName = toolName;
                      let resultComponent = null;
                      const isLoading = state !== 'result';

                      //  displayWeatherSF
                      if (toolName === 'displayWeatherSF') {
                        toolDisplayName = 'San Francisco Weather tool';
                        if (state === 'result') {
                          const toolResult = toolInvocation.result;
                          if (toolResult) {
                            resultComponent = (
                              <div key={`${index}-result`} className="mt-2">
                                <Weather {...toolResult} />
                              </div>
                            );
                          }
                        }
                      }

                      // displayStockPrice
                      if (toolName === 'displayStockPrice') {
                        toolDisplayName = `stock price tool`;
                        if (state === 'result') {
                          const toolResult = toolInvocation.result;
                          if (toolResult) {
                            resultComponent = (
                              <div key={`${index}-result`} className="mt-2">
                                <StockChart {...toolResult} />
                              </div>
                            );
                          }
                        }
                      }

                      // MCP weather tool
                      if (toolName === 'get_weather') {
                        toolDisplayName = `mcp weather tool`;
                      }

                      // mcp-search-server
                      if (toolName === 'search_web') {
                        const query = args?.query || 'search';
                        toolDisplayName = `MCP Web Search Tool for \"${query}\"`;
                        if (state === 'result') {
                          const toolResult = toolInvocation.result;

                          // Access the 'content' array within the result object
                          const rawResultsArray = toolResult?.content;
                          let searchResults = [];

                          // Check if it's an array and parse each item's text property
                          if (Array.isArray(rawResultsArray)) {
                            searchResults = rawResultsArray.reduce((acc, item) => {
                              if (item.type === 'text' && typeof item.text === 'string') {
                                try {
                                  const parsedItem = JSON.parse(item.text);
                                  // Ensure parsed item has expected properties
                                  if (parsedItem && typeof parsedItem === 'object') {
                                    acc.push({
                                      title: parsedItem.title,
                                      url: parsedItem.url,
                                      content: parsedItem.content
                                    });
                                  }
                                } catch (e) {
                                  console.error("Failed to parse search result item:", item.text, e);
                                }
                              }
                              return acc;
                            }, []);
                          } else {
                            console.warn("Search result content is not an array:", rawResultsArray);
                          }

                          console.log("Parsed search results:", searchResults);

                          resultComponent = (
                            <div key={`${index}-result`}>
                              <SearchResults results={searchResults} />
                            </div>
                          );
                        }
                      }

                      return (
                        <div key={index}>
                          {resultComponent}
                          {renderToolCallIndicator(toolDisplayName, isLoading)}
                        </div>
                      );
                    }
                    if (part.type === "source") {
                      const { source } = part;
                      return (
                        <div key={index} className="mt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-300/50 dark:border-gray-700/50 pt-1">
                          Source: {source.title || 'Untitled'} ({source.url})
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 w-full">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 container mx-auto max-w-3xl">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:ring-offset-gray-800"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
}