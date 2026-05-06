import { Agendamento } from '@/domain/entities/agendamento';
import { MemoryAgendamentoRepository } from '@/infra/persistence/memory/memory-agendamento.repository';
import { MemoryMedicoRepository } from '@/infra/persistence/memory/memory-medico.repository';

export interface CriarAgendamentoInput {
  medicoId: string;
  pacienteNome: string;
  dataHorario: Date;
}

export class CriarAgendamentoUseCase {
  constructor(
    private agendamentoRepository: MemoryAgendamentoRepository,
    private agendaRepository: MemoryMedicoRepository,
  ) {}

  async execute(input: CriarAgendamentoInput): Promise<Agendamento> {

    const medico = await this.agendaRepository.findById(input.medicoId);
    if (!medico) {
      throw new Error('MedicoNotFoundError');
    }

    const horarioDisponivel = medico.agenda.some(
      (data) => data.getTime() === input.dataHorario.getTime(),
    );

    if (!horarioDisponivel) {
      throw new Error('HorarioInvalidoError');
    }

    const conflito = await this.agendamentoRepository.findByMedicoAndHorario(
      input.medicoId,
      input.dataHorario,
    );

    if (conflito) {
      throw new Error('AgendamentoConflictError');
    }

    const newAgendamento: Agendamento = {
      id: Math.random().toString(36).substring(7),
      ...input,
    };

    await this.agendamentoRepository.create(newAgendamento);

    return newAgendamento;
  }
}