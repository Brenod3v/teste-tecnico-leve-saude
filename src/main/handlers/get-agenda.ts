import { APIGatewayProxyHandler } from 'aws-lambda';
import { makeListarAgendasUseCase } from '../factories/agendamento-factory';

export const handler: APIGatewayProxyHandler = async () => {
  const useCase = makeListarAgendasUseCase();
  const agendas = await useCase.execute();

  return {
    statusCode: 200,
    body: JSON.stringify(agendas),
  };
};