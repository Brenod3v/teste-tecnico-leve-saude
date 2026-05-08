import { APIGatewayProxyEvent } from 'aws-lambda';
import { createUseCaseFactory } from '@/main/factories/useCase.factory';
import { CriarAgendamentoSchema } from '@/application/use-cases/criar-agendamento/criar-agendamento.dto';
import { HttpResponse, ErrorResponse } from '../types';

export async function handleCriarAgendamento(event: APIGatewayProxyEvent): Promise<HttpResponse> {
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
