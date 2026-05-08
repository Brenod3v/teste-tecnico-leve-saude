import { handler } from '../create-agendamento-handler/index';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('POST /agendamento Handler', () => {
  const createEvent = (body: unknown): APIGatewayProxyEvent => ({
    httpMethod: 'POST',
    path: '/agendamento',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    isBase64Encoded: false,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    multiValueHeaders: {},
    requestContext: {} as any,
    resource: '',
    stageVariables: null,
  });

  it('deve criar agendamento com sucesso e retornar 201', async () => {
    const event = createEvent({
      agendamento: {
        medico_id: '2',
        paciente: 'João Silva',
        data_horario: '2026-06-11 14:00',
      },
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('mensagem');
    expect(body).toHaveProperty('agendamento');
    expect(body.agendamento).toHaveProperty('id');
    expect(body.agendamento).toHaveProperty('medico');
    expect(body.agendamento).toHaveProperty('paciente');
    expect(body.agendamento).toHaveProperty('data_horario');
  });

  it('deve retornar 400 quando body está vazio', async () => {
    const event = createEvent({});
    event.body = null;

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('message');
  });

  it('deve retornar 400 quando JSON é inválido', async () => {
    const event = createEvent({});
    event.body = 'invalid json';

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
  });

  it('deve retornar 400 quando validação falha', async () => {
    const event = createEvent({
      agendamento: {
        medico_id: '1',
        paciente: 'AB',
        data_horario: '2026-06-10 09:00',
      },
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('details');
  });

  it('deve retornar 404 quando médico não existe', async () => {
    const event = createEvent({
      agendamento: {
        medico_id: '999',
        paciente: 'João Silva',
        data_horario: '2026-06-10 09:00',
      },
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(404);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('erro');
  });

  it('deve retornar 409 quando horário não está disponível', async () => {
    const event = createEvent({
      agendamento: {
        medico_id: '3',
        paciente: 'João Silva',
        data_horario: '2026-06-10 15:00',
      },
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(409);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('erro');
    expect(body).toHaveProperty('mensagem');
  });
});
