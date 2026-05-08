import { APIGatewayProxyEvent } from 'aws-lambda';
import { createUseCaseFactory } from '@/main/factories/useCase.factory';
import { HttpResponse } from '../types';

export async function handleListarAgendas(_event: APIGatewayProxyEvent): Promise<HttpResponse> {
  const factory = createUseCaseFactory();
  const useCase = factory.makeListarAgendasUseCase();
  const result = await useCase.execute({});

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}
