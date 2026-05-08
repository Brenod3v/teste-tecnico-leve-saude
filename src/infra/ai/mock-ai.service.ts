import { IAIService } from '@/domain/services/ai.service.interface';
import { Triagem } from '@/domain/entities/triagem';

interface EspecialidadeMatch {
  especialidade: string;
  palavrasChave: string[];
  confianca: number;
}

export class MockAIService implements IAIService {
  private especialidades: EspecialidadeMatch[] = [
    {
      especialidade: 'Cardiologia',
      palavrasChave: ['coração', 'peito', 'pressão', 'arritmia', 'palpitação', 'infarto'],
      confianca: 0.9,
    },
    {
      especialidade: 'Dermatologia',
      palavrasChave: ['pele', 'acne', 'alergia', 'coceira', 'mancha', 'ferida'],
      confianca: 0.85,
    },
    {
      especialidade: 'Oftalmologia',
      palavrasChave: ['olho', 'visão', 'vista', 'óculos', 'catarata', 'miopia'],
      confianca: 0.88,
    },
    {
      especialidade: 'Pneumologia',
      palavrasChave: ['pulmão', 'tosse', 'respiração', 'asma', 'bronquite', 'falta de ar'],
      confianca: 0.87,
    },
    {
      especialidade: 'Gastroenterologia',
      palavrasChave: ['estômago', 'digestão', 'dor abdominal', 'diarreia', 'náusea', 'refluxo'],
      confianca: 0.86,
    },
  ];

  async analisarSintomas(sintomas: string): Promise<Triagem> {
    const sintomasLower = sintomas.toLowerCase();

    let melhorMatch: EspecialidadeMatch | null = null;
    let palavrasEncontradas: string[] = [];

    for (const especialidade of this.especialidades) {
      const encontradas = especialidade.palavrasChave.filter((palavra) =>
        sintomasLower.includes(palavra)
      );

      if (encontradas.length > 0 && (!melhorMatch || encontradas.length > palavrasEncontradas.length)) {
        melhorMatch = especialidade;
        palavrasEncontradas = encontradas;
      }
    }

    if (!melhorMatch) {
      return {
        sintomas,
        especialidadeSugerida: 'Clínica Geral',
        confianca: 0.5,
        justificativa: 'Sintomas genéricos. Recomenda-se consulta com clínico geral para avaliação inicial.',
      };
    }

    const confiancaAjustada = Math.min(
      melhorMatch.confianca * (1 + palavrasEncontradas.length * 0.05),
      0.99
    );

    return {
      sintomas,
      especialidadeSugerida: melhorMatch.especialidade,
      confianca: Math.round(confiancaAjustada * 100) / 100,
      justificativa: `Detectados sintomas relacionados a ${melhorMatch.especialidade}: ${palavrasEncontradas.join(', ')}.`,
    };
  }
}
