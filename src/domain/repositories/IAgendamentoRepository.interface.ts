import { Agendamento } from '../entities/agendamento';
import { Medico } from '../entities/medico';

export interface IAgendamentoRepository {
  create(agendamento: Agendamento): Promise<void>;
  findByMedicoAndHorario(medicoId: string, data: Date): Promise<Agendamento | null>;
}