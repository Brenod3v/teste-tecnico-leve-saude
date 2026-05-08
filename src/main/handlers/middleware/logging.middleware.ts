import { APIGatewayProxyEvent } from 'aws-lambda';
import { HttpResponse } from '../types';

export function withLogging(
  name: string,
  fn: (event: APIGatewayProxyEvent) => Promise<HttpResponse>,
): (event: APIGatewayProxyEvent) => Promise<HttpResponse> {
  return async (event: APIGatewayProxyEvent): Promise<HttpResponse> => {
    const startTime = Date.now();
    console.log(`[${name}] Iniciando...`);

    try {
      const result = await fn(event);
      const duration = Date.now() - startTime;
      console.log(`[${name}] Concluído em ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${name}] Erro após ${duration}ms:`, error);
      throw error;
    }
  };
}
