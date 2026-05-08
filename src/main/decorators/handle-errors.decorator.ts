import { AppError } from '@/application/errors/base-error';
import { z } from 'zod';
import { HttpResponse, ErrorResponse } from '../handlers/types';

export function HandleErrors(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: unknown[]): Promise<HttpResponse> {
    try {
      return await originalMethod.apply(this, args);
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

      console.error(`[${propertyKey}] Erro não tratado:`, error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Erro interno do servidor' }),
      };
    }
  };

  return descriptor;
}
