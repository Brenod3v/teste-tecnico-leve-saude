import { Medico } from '../entities/medico';

export interface IAgendaRepository {
  listAll(): Promise<Medico[]>;
  findById(id: string): Promise<Medico | null>;
}