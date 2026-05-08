import { APIGatewayProxyEvent } from 'aws-lambda';
import { AppError } from '@/application/errors/base-error';
import { z } from 'zod';
import { HttpResponse, ErrorResponse } from '../types';

export function withErrorHandling(
  fn: (event: APIGatewayProxyEvent) => Promise<HttpResponse>,
): (event: APIGatewayProxyEvent) => Promise<HttpResponse> {
  return async (event: APIGatewayProxyEvent): Promise<HttpResponse> => {
    try {
      return await fn(event);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const response: ErrorResponse = {
          message: 'Erro de validação nos dados enviados',
          details: error.flatten().fieldErrors,
        };
        return {
          statusCode: 400,
          body: JSON.stringify(response),
        };
      }

      if (error instanceof AppError) {
        const response: ErrorResponse = {
          erro: error.message,
        };
        if (error.details) {
          response.mensagem = error.details;
        }
        return {
          statusCode: error.statusCode,
          body: JSON.stringify(response),
        };
      }

      console.error('[Handler Error]:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Erro interno do servidor' }),
      };
    }
  };
}
