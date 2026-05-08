import { Triagem } from '../entities/triagem.entity';

export interface IAIService {
  analisarSintomas(sintomas: string): Promise<Triagem>;
}
