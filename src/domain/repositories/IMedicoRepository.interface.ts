import { Medico } from '../entities/medico';

export interface IMedicoRepository {
  listAll(): Promise<Medico[]>;
  findById(id: string): Promise<Medico | null>;
  removeHorario(medicoId: string, data: Date): Promise<void>;
}
