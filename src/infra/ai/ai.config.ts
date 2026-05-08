export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'mock';
  apiKey: string;
  model?: string;
  timeout: number;
  maxSymptomsLength: number;
  debugAI: boolean;
}

export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || 'mock') as 'openai' | 'anthropic' | 'mock';
  const apiKey = process.env.AI_API_KEY || '';
  const model = process.env.AI_MODEL;
  const timeout = parseInt(process.env.AI_TIMEOUT || '30000', 10);
  const maxSymptomsLength = parseInt(process.env.MAX_SYMPTOMS_LENGTH || '1000', 10);
  const debugAI = process.env.DEBUG_AI === 'true';

  return { provider, apiKey, model, timeout, maxSymptomsLength, debugAI };
}

export function getServerConfig() {
  const port = parseInt(process.env.SERVER_PORT || '3000', 10);
  const stage = process.env.STAGE || 'dev';
  const logLevel = process.env.LOG_LEVEL || 'info';

  return { port, stage, logLevel };
}
