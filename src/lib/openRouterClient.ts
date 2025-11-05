import type { ChatMessage } from '../types';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/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/completions';

interface OpenRouterChoice {
  message?: {
    content?: string;
  };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
}

const buildHeaders = (apiKey: string) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'X-Title': 'VibeFlow',
  };

  if (typeof window !== 'undefined' && window.location) {
    headers['HTTP-Referer'] = window.location.origin;
  }

  return headers;
};

export const sendToOpenRouter = async (
  messages: ChatMessage[],
): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenRouter API key missing. Set VITE_OPENROUTER_API_KEY in your env.');
  }

  const model = import.meta.env.VITE_OPENROUTER_MODEL || 'openrouter/auto';

  const payload = {
    model,
    messages: messages.map(({ role, content }) => ({ role, content })),
  };

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: buildHeaders(apiKey),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenRouter error: ${response.status} ${message}`);
  }

  const data = (await response.json()) as OpenRouterResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenRouter returned an empty response.');
  }

  return content.trim();
};
