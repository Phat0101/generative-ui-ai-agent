'use client';

import { Suspense } from 'react';
import { useChat } from '@ai-sdk/react';
import { Weather } from '@/components/weather';
import { StockChart } from '@/components/stockChart';
import { SearchResults } from '@/components/searchResults';
import { ThemeToggle } from '@/components/theme-toggle';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, CircleCheck, Brain, SendHorizonal } from 'lucide-react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat();

  const isSubmitting = status === 'submitted';
  const isStreaming = status === 'streaming';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 md:px-10 sticky top-0 w-full">
        <h1 className="text-2xl font-bold">Generative UI Chat</h1>
        <ThemeToggle />
      </div>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 mb-14" >
        <div className="flex-1 overflow-y-auto p-4 space-y-4 container mx-auto max-w-5xl">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl ${message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-lg p-3'
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
                          {renderToolCallIndicator(toolDisplayName, isLoading)}
                          {resultComponent}
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
                    if (part.type === "reasoning") {
                      return (
                        <div key={index} className="mt-2 p-2 text-xs text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-gray-700/30 border border-yellow-200 dark:border-gray-700 rounded-md">
                          <div className="flex items-center gap-1 font-medium mb-1">
                            <Brain className="h-3 w-3" />
                            <span>Reasoning</span>
                          </div>
                          <div className="text-xs whitespace-pre-wrap">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {part.reasoning}
                            </ReactMarkdown>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}
          {/* Display AI thinking indicator */}
          {(isSubmitting || isStreaming) && (
            <div className="flex justify-start">
              <div className="max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-3 rounded-lg shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>AI 👨‍🍳 is cooking ...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-transparent fixed bottom-0 w-full">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 container mx-auto max-w-5xl">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
              disabled={isSubmitting || isStreaming} // Disable input while AI is responding
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:ring-offset-gray-800 flex items-center justify-center"
              disabled={!input.trim() || isSubmitting || isStreaming} // Disable button while AI is responding
            >
              {isSubmitting || isStreaming ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizonal className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
}