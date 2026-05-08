import { Triagem } from '../entities/triagem';

export interface IAIService {
  analisarSintomas(sintomas: string): Promise<Triagem>;
}
