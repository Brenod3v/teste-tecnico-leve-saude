import '@/config/env';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { createUseCaseFactory } from '@/main/factories/useCase.factory';
import { CriarAgendamentoSchema } from '@/application/use-cases/criar-agendamento/criar-agendamento.dto';
import { TriagemInputSchema } from '@/application/use-cases/triagem/triagem.dto';
import { AppError } from '@/application/errors/base-error';
import { z } from 'zod';
import { HttpResponse, ErrorResponse } from '@/main/handlers/types';

function withErrorHandling(
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

function withLogging(
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

async function handleListarAgendas(_event: APIGatewayProxyEvent): Promise<HttpResponse> {
  const factory = createUseCaseFactory();
  const useCase = factory.makeListarAgendasUseCase();
  const result = await useCase.execute({});

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}

async function handleCriarAgendamento(event: APIGatewayProxyEvent): Promise<HttpResponse> {
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

  const validatedData = CriarAgendamentoSchema.parse(rawData);

  const factory = createUseCaseFactory();
  const useCase = factory.makeCriarAgendamentoUseCase();
  const result = await useCase.execute(validatedData);

  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
}

async function handleTriagem(event: APIGatewayProxyEvent): Promise<HttpResponse> {
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
}

export const listarAgendasHandler = withLogging(
  'ListarAgendas',
  withErrorHandling(handleListarAgendas),
);

export const criarAgendamentoHandler = withLogging(
  'CriarAgendamento',
  withErrorHandling(handleCriarAgendamento),
);

export const triagemHandler = withLogging('Triagem', withErrorHandling(handleTriagem));
