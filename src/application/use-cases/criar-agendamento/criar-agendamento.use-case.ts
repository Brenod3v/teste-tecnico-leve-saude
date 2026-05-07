import { Agendamento } from '@/domain/entities/agendamento';
import { IAgendamentoRepository } from '@/domain/repositories/IAgendamentoRepository.interface';
import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';
import { 
  MedicoNotFoundError, 
  HorarioIndisponivelError, 
  AgendamentoConflictError 
} from '@/application/errors/business-errors';
import { CriarAgendamentoInput, CriarAgendamentoOutput } from './criar-agendamento.dto';
import { v4 as uuidv4 } from 'uuid';

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function parseStringToDate(dateString: string): Date {
  return new Date(dateString.replace(' ', 'T'));
}

export class CriarAgendamentoUseCase {
  constructor(
    private agendamentoRepository: IAgendamentoRepository,
    private medicoRepository: IMedicoRepository,
  ) {}

  async execute(input: CriarAgendamentoInput): Promise<CriarAgendamentoOutput> {
    const medicoId = input.agendamento.medico_id;
    const pacienteNome = input.agendamento.paciente;
    const dataHorarioString = input.agendamento.data_horario;
    const dataHorario = parseStringToDate(dataHorarioString);

    const medico = await this.medicoRepository.findById(medicoId);
    if (!medico) throw new MedicoNotFoundError();

    const horarioDisponivel = medico.agenda.some(
      (data) => data.getTime() === dataHorario.getTime(),
    );
    if (!horarioDisponivel) throw new HorarioIndisponivelError();

    const conflito = await this.agendamentoRepository.findByMedicoAndHorario(
      medicoId,
      dataHorario,
    );
    if (conflito) throw new AgendamentoConflictError();

    const newAgendamento: Agendamento = {
      id: uuidv4(),
      medicoId,
      pacienteNome,
      dataHorario,
    };

    await this.agendamentoRepository.create(newAgendamento);

    return {
      mensagem: 'Agendamento realizado com sucesso',
      agendamento: {
        id: newAgendamento.id,
        medico: medico.nome,
        paciente: pacienteNome,
        data_horario: formatDateToString(dataHorario),
      },
    };
  }
}