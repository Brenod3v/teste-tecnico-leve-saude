import '@/config/env';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { listarAgendasHandler } from '../handler-service';

export const handler: APIGatewayProxyHandler = async (event) => listarAgendasHandler(event);
