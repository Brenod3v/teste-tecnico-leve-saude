import { Agendamento } from '@/domain/entities/agendamento';
import { IAgendamentoRepository } from '@/domain/repositories/IAgendamentoRepository.interface';
import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';
import { 
  MedicoNotFoundError, 
  HorarioIndisponivelError, 
  AgendamentoConflictError 
} from '@/application/errors/business-errors';
import { CriarAgendamentoInput, CriarAgendamentoOutput } from './criar-agendamento.dto';

export class CriarAgendamentoUseCase {
  constructor(
    private agendamentoRepository: IAgendamentoRepository,
    private medicoRepository: IMedicoRepository,
  ) {}

  async execute(input: CriarAgendamentoInput): Promise<CriarAgendamentoOutput> {
    const medico = await this.medicoRepository.findById(input.medicoId);
    if (!medico) throw new MedicoNotFoundError();

    const horarioDisponivel = medico.agenda.some(
      (data) => data.getTime() === input.dataHorario.getTime(),
    );
    if (!horarioDisponivel) throw new HorarioIndisponivelError();

    const conflito = await this.agendamentoRepository.findByMedicoAndHorario(
      input.medicoId,
      input.dataHorario,
    );
    if (conflito) throw new AgendamentoConflictError();

    const newAgendamento: Agendamento = {
      id: Math.random().toString(36).substring(7),
      medicoId: input.medicoId,
      pacienteNome: input.pacienteNome,
      dataHorario: input.dataHorario,
    };

    await this.agendamentoRepository.create(newAgendamento);

    return {
      id: newAgendamento.id,
      medicoId: newAgendamento.medicoId,
      pacienteNome: newAgendamento.pacienteNome,
      dataHorario: newAgendamento.dataHorario,
    };
  }
}