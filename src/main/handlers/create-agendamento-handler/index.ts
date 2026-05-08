import '@/config/env';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createUseCaseFactory } from '../../factories/agendamento-factory';
import { CriarAgendamentoSchema } from '@/application/use-cases/criar-agendamento/criar-agendamento.dto';
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
    } catch (parseError) {
      const response: ErrorResponse = {
        message: 'JSON inválido no corpo da requisição',
      };
      return {
        statusCode: 400,
        body: JSON.stringify(response),
      };
    }

    const validatedData = CriarAgendamentoSchema.parse(rawData);

    const factory = createUseCaseFactory();
    const useCase = factory.makeCriarAgendamentoUseCase();
    const result = await useCase.execute(validatedData);

    return {
      statusCode: 201,
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

    console.error('[Create Agendamento Error]:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor' }),
    };
  }
};
