import { IAIService } from '@/domain/services/ai.service.interface';
import { TriagemInput, TriagemOutput } from './triagem.dto';

export class TriagemUseCase {
  constructor(private aiService: IAIService) {}

  async execute(input: TriagemInput): Promise<TriagemOutput> {
    const triagem = await this.aiService.analisarSintomas(input.sintomas);

    return {
      especialidadeSugerida: triagem.especialidadeSugerida,
      confianca: triagem.confianca,
      justificativa: triagem.justificativa,
    };
  }
}
