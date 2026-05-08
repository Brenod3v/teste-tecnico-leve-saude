import { Agendamento } from '../entities/agendamento';
export interface IAgendamentoRepository {
  create(agendamento: Agendamento): Promise<void>;
  findByMedicoAndHorario(medicoId: string, data: Date): Promise<Agendamento | null>;
}
