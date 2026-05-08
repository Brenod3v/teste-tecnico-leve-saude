import { handler } from '../triagem-handler/index';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

describe('POST /triagem Handler', () => {
  const createEvent = (body: unknown): APIGatewayProxyEvent => ({
    httpMethod: 'POST',
    path: '/triagem',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    isBase64Encoded: false,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    multiValueHeaders: {},
    requestContext: {} as unknown,
    resource: '',
    stageVariables: null,
  });

  it('deve retornar triagem com especialidade sugerida', async () => {
    const event = createEvent({
      sintomas: 'Sinto dor no peito e palpitações',
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('especialidadeSugerida');
    expect(body).toHaveProperty('confianca');
    expect(body).toHaveProperty('justificativa');
  });

  it('deve retornar 400 quando sintomas estão vazios', async () => {
    const event = createEvent({
      sintomas: '',
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('details');
  });

  it('deve retornar 400 quando sintomas têm menos de 10 caracteres', async () => {
    const event = createEvent({
      sintomas: 'Dor',
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
  });

  it('deve retornar 400 quando body está vazio', async () => {
    const event = createEvent({});
    event.body = null;

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
  });

  it('deve retornar 400 quando JSON é inválido', async () => {
    const event = createEvent({});
    event.body = 'invalid json';

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
  });

  it('deve sugerir Cardiologia para sintomas cardíacos', async () => {
    const event = createEvent({
      sintomas: 'Tenho dor no peito, palpitações e falta de ar',
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.especialidadeSugerida).toBe('Cardiologia');
  });
});
