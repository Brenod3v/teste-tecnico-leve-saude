import '@/config/env';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createUseCaseFactory } from '../../factories/agendamento-factory';
import { AppError } from '@/application/errors/base-error';
import { z } from 'zod';
import { HttpResponse, ErrorResponse } from '../types';

export const handler: APIGatewayProxyHandler = async (_event): Promise<HttpResponse> => {
  try {
    const factory = createUseCaseFactory();
    const useCase = factory.makeListarAgendasUseCase();
    const result = await useCase.execute({});

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const response: ErrorResponse = {
        message: 'Parâmetros de busca inválidos',
        details: error.flatten().fieldErrors,
      };
      return {
        statusCode: 400,
        body: JSON.stringify(response),
      };
    }

    if (error instanceof AppError) {
      const response: ErrorResponse = {
        message: error.message,
      };
      if (error.details) {
        response.mensagem = error.details;
      }
      return {
        statusCode: error.statusCode,
        body: JSON.stringify(response),
      };
    }

    console.error('[List Agendas Error]:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
