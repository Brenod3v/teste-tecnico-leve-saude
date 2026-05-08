import { Agendamento } from '../entities/agendamento.entity';
export interface IAgendamentoRepository {
  create(agendamento: Agendamento): Promise<void>;
  findByMedicoAndHorario(medicoId: string, data: Date): Promise<Agendamento | null>;
}
