import { MockAIService } from '../mock-ai.service';

describe('MockAIService', () => {
  let service: MockAIService;

  beforeEach(() => {
    service = new MockAIService();
  });

  describe('analisarSintomas', () => {
    it('deve sugerir Cardiologia para sintomas cardíacos', async () => {
      const result = await service.analisarSintomas('Sinto dor no peito e palpitações');

      expect(result.especialidadeSugerida).toBe('Cardiologia');
      expect(result.confianca).toBeGreaterThan(0.8);
      expect(result.justificativa).toContain('Cardiologia');
    });

    it('deve sugerir Dermatologia para sintomas de pele', async () => {
      const result = await service.analisarSintomas('Tenho acne e coceira na pele');

      expect(result.especialidadeSugerida).toBe('Dermatologia');
      expect(result.confianca).toBeGreaterThan(0.8);
    });

    it('deve sugerir Oftalmologia para sintomas de visão', async () => {
      const result = await service.analisarSintomas(
        'Minha visão está embaçada e tenho dificuldade para enxergar',
      );

      expect(result.especialidadeSugerida).toBe('Oftalmologia');
      expect(result.confianca).toBeGreaterThan(0.8);
    });

    it('deve sugerir Clínica Geral para sintomas genéricos', async () => {
      const result = await service.analisarSintomas('Não me sinto bem');

      expect(result.especialidadeSugerida).toBe('Clínica Geral');
      expect(result.confianca).toBe(0.5);
    });

    it('deve aumentar confiança com múltiplas palavras-chave', async () => {
      const result = await service.analisarSintomas('Tosse, falta de ar e bronquite');

      expect(result.especialidadeSugerida).toBe('Pneumologia');
      expect(result.confianca).toBeGreaterThan(0.87);
    });

    it('deve retornar confiança máxima de 0.99', async () => {
      const result = await service.analisarSintomas(
        'Tosse, falta de ar, bronquite, asma, pulmão inflamado',
      );

      expect(result.confianca).toBeLessThanOrEqual(0.99);
    });
  });
});
