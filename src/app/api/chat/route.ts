import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { tools } from './tools';

export async function POST(request: Request) {
  const { messages } = await request.json();
  try {
    const result = streamText({
      model: google('gemini-2.0-flash', {
        // useSearchGrounding: true,
        // dynamicRetrievalConfig: {
        //   mode: 'MODE_DYNAMIC',
        //   dynamicThreshold: 0.5
        // }
      }),
      system: 'You are a friendly assistant!',
      messages,
      maxSteps: 5,
      tools,
      toolChoice: 'auto'
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
