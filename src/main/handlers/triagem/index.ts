import '@/config/env';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createUseCaseFactory } from '../../factories/useCase.factory';
import { TriagemInputSchema } from '@/application/use-cases/triagem/triagem.dto';
import { AppError } from '@/application/errors/base-error';
import { z } from 'zod';
import { HttpResponse, ErrorResponse } from '../types';

export const handler: APIGatewayProxyHandler = async (event): Promise<HttpResponse> => {
  try {
    if (!event.body) {
      const response: ErrorResponse = {
        message: 'O corpo da requisição é obrigatório',
      };
      return {
        statusCode: 400,
        body: JSON.stringify(response),
      };
    }

    let rawData: unknown;
    try {
      rawData = JSON.parse(event.body);
    } catch {
      const response: ErrorResponse = {
        message: 'JSON inválido no corpo da requisição',
      };
      return {
        statusCode: 400,
        body: JSON.stringify(response),
      };
    }

    const validatedData = TriagemInputSchema.parse(rawData);

    const factory = createUseCaseFactory();
    const useCase = factory.makeTriagemUseCase();
    const result = await useCase.execute(validatedData);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
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

    console.error('[Triagem Error]:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor' }),
    };
  }
};
