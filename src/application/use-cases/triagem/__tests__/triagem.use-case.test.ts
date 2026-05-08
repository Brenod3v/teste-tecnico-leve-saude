import { TriagemUseCase } from '../triagem.use-case';
import { IAIService } from '@/domain/services/ai.service.interface';
import { Triagem } from '@/domain/entities/triagem';

describe('TriagemUseCase', () => {
  let useCase: TriagemUseCase;
  let aiService: jest.Mocked<IAIService>;

  beforeEach(() => {
    aiService = {
      analisarSintomas: jest.fn(),
    };

    useCase = new TriagemUseCase(aiService);
  });

  describe('execute', () => {
    it('deve retornar triagem com especialidade sugerida', async () => {
      const mockTriagem: Triagem = {
        sintomas: 'Dor no peito e falta de ar',
        especialidadeSugerida: 'Cardiologia',
        confianca: 0.95,
        justificativa: 'Sintomas indicam possível problema cardíaco',
      };

      aiService.analisarSintomas.mockResolvedValue(mockTriagem);

      const result = await useCase.execute({ sintomas: 'Dor no peito e falta de ar' });

      expect(result.especialidadeSugerida).toBe('Cardiologia');
      expect(result.confianca).toBe(0.95);
      expect(result.justificativa).toBe('Sintomas indicam possível problema cardíaco');
      expect(aiService.analisarSintomas).toHaveBeenCalledWith('Dor no peito e falta de ar');
    });

    it('deve retornar triagem com confiança baixa para sintomas genéricos', async () => {
      const mockTriagem: Triagem = {
        sintomas: 'Não me sinto bem',
        especialidadeSugerida: 'Clínica Geral',
        confianca: 0.5,
        justificativa: 'Sintomas genéricos',
      };

      aiService.analisarSintomas.mockResolvedValue(mockTriagem);

      const result = await useCase.execute({ sintomas: 'Não me sinto bem' });

      expect(result.especialidadeSugerida).toBe('Clínica Geral');
      expect(result.confianca).toBe(0.5);
    });
  });
});
