# Generative UI Chat Demo

This is a [Next.js](https://nextjs.org) project demonstrating the power of the [Vercel AI SDK](https://sdk.vercel.ai/) to create generative user interfaces within a chat application.

## Overview

This application showcases how Large Language Models (LLMs) can go beyond text responses by dynamically generating and rendering relevant UI components based on the conversation context. Ask the chat for:

*   Weather information (e.g., "What's the weather like in San Francisco?")
*   Stock price information and charts (e.g., "Show me the stock price for AAPL over the last year")

The AI determines when to use specialized tools, fetches the necessary data, and returns the results. The frontend UI then iterates through the `message.parts` array provided by the Vercel AI SDK's `useChat` hook. When a part with `type === 'tool-invocation'` is found and its `state` is `'result'`, the corresponding UI component (`Weather` card or `StockChart`) is rendered directly within the chat flow, displaying the tool's output.

## Key Technologies

*   **Framework:** [Next.js](https://nextjs.org) (App Router)
*   **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) (using `@ai-sdk/react`, `useChat` hook, tool calling, and `message.parts` for tool results)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **UI Components:** Custom React components (`Weather`, `StockChart`)
*   **Theme:** [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your AI provider API key (e.g., Google AI API Key):
    ```
    GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Remember to configure your environment variables in the Vercel project settings.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
