import { APIGatewayProxyHandler } from 'aws-lambda';
import { createUseCaseFactory } from '../../factories/agendamento-factory';
import { ListarAgendasInputSchema } from '@/application/use-cases/listar-agendas/listar-agendas.dto';
import { AppError } from '@/application/errors/base-error';
import { z } from 'zod';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const factory = createUseCaseFactory();
    const useCase = factory.makeListarAgendasUseCase();
    const result = await useCase.execute({});

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };

  } catch (error: any) {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({ message: error.message }),
      };
    }

    console.error('[List Agendas Error]:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};