import { IAIService } from '@/domain/services/ai.service.interface';
import { Triagem } from '@/domain/entities/triagem.entity';
import { TRIAGEM_PROMPT } from './prompts/triagem.prompt';
import { TriagemResponse, AnthropicApiResponse } from './types/ai.types';

export class AnthropicService implements IAIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-3-haiku-20240307') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analisarSintomas(sintomas: string): Promise<Triagem> {
    const prompt = TRIAGEM_PROMPT(sintomas);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${response.status} - ${error}`);
      }

      const data = (await response.json()) as AnthropicApiResponse;
      const content = data.content[0]?.text;

      if (!content) throw new Error('Resposta vazia da API Anthropic');

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Resposta não contém JSON válido');

      const parsed: TriagemResponse = JSON.parse(jsonMatch[0]);

      return {
        sintomas,
        especialidadeSugerida: parsed.especialidadeSugerida || 'Clínica Geral',
        confianca: Math.min(Math.max(parsed.confianca || 0.5, 0), 0.99),
        justificativa: parsed.justificativa || 'Análise realizada pela IA',
      };
    } catch (error) {
      console.error('[Anthropic Error]:', error);
      throw new Error('Erro ao analisar sintomas com Anthropic');
    }
  }
}
