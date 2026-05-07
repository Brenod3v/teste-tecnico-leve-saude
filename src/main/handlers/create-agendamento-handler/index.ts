import { APIGatewayProxyHandler } from 'aws-lambda';
import { createUseCaseFactory } from '../../factories/agendamento-factory';
import { CriarAgendamentoSchema } from '@/application/use-cases/criar-agendamento/criar-agendamento.dto';
import { AppError } from '@/application/errors/base-error';
import { z } from 'zod';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'O corpo da requisição é obrigatório' }) 
      };
    }
    const rawData = JSON.parse(event.body);

    const validatedData = CriarAgendamentoSchema.parse(rawData);

    const factory = createUseCaseFactory();
    const useCase = factory.makeCriarAgendamentoUseCase();
    const result = await useCase.execute(validatedData);

    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Erro de validação nos dados enviados',
          details: error.flatten().fieldErrors,
        }),
      };
    }

    if (error instanceof AppError) {
      const response: any = {
        statusCode: error.statusCode,
        erro: error.message,
      };
      if ((error as any).details) {
        response.mensagem = (error as any).details;
      }
      return {
        statusCode: error.statusCode,
        body: JSON.stringify(response),
      };
    }

    console.error('[Unexpected Error]:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor' }),
    };
  }
};