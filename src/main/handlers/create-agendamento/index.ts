import '@/config/env';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { criarAgendamentoHandler } from '../handler-service';

export const handler: APIGatewayProxyHandler = async (event) => criarAgendamentoHandler(event);
