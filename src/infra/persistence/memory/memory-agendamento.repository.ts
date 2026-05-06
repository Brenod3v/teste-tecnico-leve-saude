import { Agendamento } from "@/domain/entities/agendamento";
import { IAgendamentoRepository } from "@/domain/repositories/IAgendamentoRepository.interface";


export class MemoryAgendamentoRepository implements IAgendamentoRepository {
  private static agendamentos: Agendamento[] = [];

  async create(agendamento: Agendamento): Promise<void> {
    MemoryAgendamentoRepository.agendamentos.push(agendamento);
  }

  async findByMedicoAndHorario(medicoId: string, data: Date): Promise<Agendamento | null> {
    const agendamento = MemoryAgendamentoRepository.agendamentos.find(
      (a) => a.medicoId === medicoId && a.dataHorario.getTime() === data.getTime(),
    );
    return agendamento || null;
  }
}