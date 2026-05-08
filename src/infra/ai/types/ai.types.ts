export interface TriagemResponse {
  especialidadeSugerida: string;
  confianca: number;
  justificativa: string;
}

export interface AnthropicApiResponse {
  content: Array<{ type: string; text: string }>;
}

export interface EspecialidadeMatch {
  especialidade: string;
  palavrasChave: string[];
  confianca: number;
}
