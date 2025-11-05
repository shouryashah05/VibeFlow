import type { ChatMessage } from '../types';

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekChoice {
  message?: {
    content?: string;
  };
}

interface DeepSeekResponse {
  choices?: DeepSeekChoice[];
}

export const sendToDeepSeek = async (
  messages: ChatMessage[],
): Promise<string> => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DeepSeek API key missing. Set VITE_DEEPSEEK_API_KEY in your env.');
  }

  const payload = {
    model: 'deepseek-chat',
    messages: messages.map(({ role, content }) => ({ role, content })),
  };

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`DeepSeek error: ${response.status} ${message}`);
  }

  const data = (await response.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('DeepSeek returned an empty response.');
  }

  return content.trim();
};
