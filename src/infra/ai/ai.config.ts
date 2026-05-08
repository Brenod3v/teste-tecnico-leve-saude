export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'mock';
  apiKey: string;
  model?: string;
}

export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || 'mock') as 'openai' | 'anthropic' | 'mock';
  const apiKey = process.env.AI_API_KEY || '';
  const model = process.env.AI_MODEL;

  return { provider, apiKey, model };
}
