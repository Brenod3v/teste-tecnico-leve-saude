import '@/config/env';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { triagemHandler } from '../handler-service';

export const handler: APIGatewayProxyHandler = async (event) => triagemHandler(event);
