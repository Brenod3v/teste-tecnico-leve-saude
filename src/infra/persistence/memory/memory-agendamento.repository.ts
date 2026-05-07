import { Agendamento } from "@/domain/entities/agendamento";
import { IAgendamentoRepository } from "@/domain/repositories/IAgendamentoRepository.interface";


export class MemoryAgendamentoRepository implements IAgendamentoRepository {
  private static instance: MemoryAgendamentoRepository;
  private agendamentos: Agendamento[] = [];

  private constructor() {}

  static getInstance(): MemoryAgendamentoRepository {
    if (!MemoryAgendamentoRepository.instance) {
      MemoryAgendamentoRepository.instance = new MemoryAgendamentoRepository();
    }
    return MemoryAgendamentoRepository.instance;
  }

  async create(agendamento: Agendamento): Promise<void> {
    this.agendamentos.push(agendamento);
  }

  async findByMedicoAndHorario(medicoId: string, data: Date): Promise<Agendamento | null> {
    const agendamento = this.agendamentos.find(
      (a) => a.medicoId === medicoId && a.dataHorario.getTime() === data.getTime(),
    );
    return agendamento || null;
  }
}
