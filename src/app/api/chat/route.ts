import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
// import { openai } from '@ai-sdk/openai';
import { experimental_createMCPClient as createMCPClient, streamText } from 'ai';
import { localTools } from './tools';

export async function POST(request: Request) {
  const { messages } = await request.json();
  try {
    const pythonMcpClient = await createMCPClient({
      transport: {
        type: 'sse',
        url: process.env.PYTHON_MCP_SERVER_URL || 'http://localhost:8051/sse',
      },
    });
    const pythonMcpTools = await pythonMcpClient.tools();

    const denoMcpClient = await createMCPClient({
      transport: {
        type: 'sse',
        url: process.env.DENO_MCP_SERVER_URL || 'http://localhost:3001/sse',
      },
    });
    const denoMcpTools = await denoMcpClient.tools();

    const allTools = {
      ...localTools,
      ...pythonMcpTools,
      ...denoMcpTools,
    };

    const result = await streamText({
      model: google('gemini-2.5-flash-preview-04-17'),
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 4096,
          },
        } satisfies GoogleGenerativeAIProviderOptions,
      },
      // model: openai('o4-mini'),
      // providerOptions: {
      //   openai: {
      //     reasoningEffort: 'low',
      //   },
      // },
      system: 'You are a friendly assistant! Please format your responses in Markdown. Also you have to reason about the user\'s question before answering.',
      messages,
      maxSteps: 5,
      tools: allTools,
      toolChoice: 'auto',
      onFinish: async () => {
        await pythonMcpClient.close();
        await denoMcpClient.close();
      }
    });
    return result.toDataStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Error processing request', details: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
