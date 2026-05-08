import { IAIService } from '@/domain/services/ai.service.interface';
import { Triagem } from '@/domain/entities/triagem';
import { OpenAI } from 'openai';
import { TRIAGEM_PROMPT } from './prompts/triagem.prompt';
import { TriagemResponse } from './types/ai.types';

export class OpenAIService implements IAIService {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async analisarSintomas(sintomas: string): Promise<Triagem> {
    const prompt = TRIAGEM_PROMPT(sintomas);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 200,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Resposta vazia da API OpenAI');
      }

      const parsed: TriagemResponse = JSON.parse(content);

      return {
        sintomas,
        especialidadeSugerida: parsed.especialidadeSugerida || 'Clínica Geral',
        confianca: Math.min(Math.max(parsed.confianca || 0.5, 0), 0.99),
        justificativa: parsed.justificativa || 'Análise realizada pela IA',
      };
    } catch (error) {
      console.error('[OpenAI Error]:', error);
      throw new Error('Erro ao analisar sintomas com OpenAI');
    }
  }
}
