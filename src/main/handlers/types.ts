export interface HttpResponse {
  statusCode: number;
  body: string;
}

export interface ErrorResponse {
  erro?: string;
  mensagem?: string;
  message?: string;
  details?: Record<string, unknown>;
}
