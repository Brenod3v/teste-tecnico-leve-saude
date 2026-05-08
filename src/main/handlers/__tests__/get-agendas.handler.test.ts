import { handler } from '../get-agendas/index';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('GET /agendas Handler', () => {
  const createEvent = (): APIGatewayProxyEvent => ({
    httpMethod: 'GET',
    path: '/agendas',
    headers: {},
    body: null,
    isBase64Encoded: false,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    multiValueHeaders: {},
    requestContext: {} as any,
    resource: '',
    stageVariables: null,
  });

  it('deve retornar lista de médicos com status 200', async () => {
    const event = createEvent();
    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('medicos');
    expect(Array.isArray(body.medicos)).toBe(true);
    expect(body.medicos.length).toBeGreaterThan(0);
  });

  it('deve retornar médicos com estrutura correta', async () => {
    const event = createEvent();
    const result = (await handler(event)) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    const medico = body.medicos[0];

    expect(medico).toHaveProperty('id');
    expect(medico).toHaveProperty('nome');
    expect(medico).toHaveProperty('especialidade');
    expect(medico).toHaveProperty('horarios_disponiveis');
    expect(Array.isArray(medico.horarios_disponiveis)).toBe(true);
  });

  it('deve formatar horários corretamente', async () => {
    const event = createEvent();
    const result = (await handler(event)) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    const horario = body.medicos[0].horarios_disponiveis[0];

    expect(horario).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });
});
