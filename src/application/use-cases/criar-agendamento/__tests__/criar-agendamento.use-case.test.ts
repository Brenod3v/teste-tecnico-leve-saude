import { CriarAgendamentoUseCase } from '../criar-agendamento.use-case';
import { IAgendamentoRepository } from '@/domain/repositories/IAgendamentoRepository.interface';
import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';
import { Medico } from '@/domain/entities/medico';
import {
  MedicoNotFoundError,
  HorarioIndisponivelError,
  AgendamentoConflictError,
} from '@/application/errors/business-errors';

describe('CriarAgendamentoUseCase', () => {
  let useCase: CriarAgendamentoUseCase;
  let agendamentoRepository: jest.Mocked<IAgendamentoRepository>;
  let medicoRepository: jest.Mocked<IMedicoRepository>;

  const mockMedico: Medico = {
    id: '1',
    nome: 'Dr. João Silva',
    especialidade: 'Cardiologista',
    agenda: [new Date('2026-06-10T09:00:00Z'), new Date('2026-06-10T10:00:00Z')],
  };

  beforeEach(() => {
    agendamentoRepository = {
      create: jest.fn(),
      findByMedicoAndHorario: jest.fn(),
    };

    medicoRepository = {
      listAll: jest.fn(),
      findById: jest.fn(),
      removeHorario: jest.fn(),
    };

    useCase = new CriarAgendamentoUseCase(agendamentoRepository, medicoRepository);
  });

  describe('execute', () => {
    it('deve criar agendamento com sucesso', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedico);
      agendamentoRepository.findByMedicoAndHorario.mockResolvedValue(null);

      const input = {
        agendamento: {
          medico_id: '1',
          paciente: 'Carlos Almeida',
          data_horario: '2026-06-10 09:00',
        },
      };

      const result = await useCase.execute(input);

      expect(result.mensagem).toBe('Agendamento realizado com sucesso');
      expect(result.agendamento.medico).toBe('Dr. João Silva');
      expect(result.agendamento.paciente).toBe('Carlos Almeida');
      expect(result.agendamento.data_horario).toBe('2026-06-10 09:00');
      expect(agendamentoRepository.create).toHaveBeenCalled();
      expect(medicoRepository.removeHorario).toHaveBeenCalled();
    });

    it('deve lançar erro quando médico não existe', async () => {
      medicoRepository.findById.mockResolvedValue(null);

      const input = {
        agendamento: {
          medico_id: '999',
          paciente: 'Carlos Almeida',
          data_horario: '2026-06-10 09:00',
        },
      };

      await expect(useCase.execute(input)).rejects.toThrow(MedicoNotFoundError);
    });

    it('deve lançar erro quando horário não está disponível', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedico);

      const input = {
        agendamento: {
          medico_id: '1',
          paciente: 'Carlos Almeida',
          data_horario: '2026-06-10 15:00',
        },
      };

      await expect(useCase.execute(input)).rejects.toThrow(HorarioIndisponivelError);
    });

    it('deve lançar erro quando horário já está agendado', async () => {
      medicoRepository.findById.mockResolvedValue(mockMedico);
      agendamentoRepository.findByMedicoAndHorario.mockResolvedValue({
        id: 'existing-id',
        medicoId: '1',
        pacienteNome: 'Outro Paciente',
        dataHorario: new Date('2026-06-10T09:00:00Z'),
      });

      const input = {
        agendamento: {
          medico_id: '1',
          paciente: 'Carlos Almeida',
          data_horario: '2026-06-10 09:00',
        },
      };

      await expect(useCase.execute(input)).rejects.toThrow(AgendamentoConflictError);
    });
  });
});
