import { APIGatewayProxyHandler } from 'aws-lambda';
import { makeCriarAgendamentoUseCase } from '../factories/agendamento-factory';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Body is required' }) };
    }

    const data = JSON.parse(event.body);
    const useCase = makeCriarAgendamentoUseCase();

    const result = await useCase.execute({
      medicoId: data.medicoId,
      pacienteNome: data.pacienteNome,
      dataHorario: new Date(data.dataHorario),
    });

    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};