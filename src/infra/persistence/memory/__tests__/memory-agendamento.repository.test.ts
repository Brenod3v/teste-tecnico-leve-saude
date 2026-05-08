import { MemoryAgendamentoRepository } from '../memory-agendamento.repository';
import { Agendamento } from '@/domain/entities/agendamento';

describe('MemoryAgendamentoRepository', () => {
  let repository: MemoryAgendamentoRepository;

  beforeEach(() => {
    repository = MemoryAgendamentoRepository.getInstance();
  });

  describe('create', () => {
    it('deve criar um agendamento', async () => {
      const agendamento: Agendamento = {
        id: '1',
        medicoId: '1',
        pacienteNome: 'Carlos Almeida',
        dataHorario: new Date('2026-06-10T09:00:00Z'),
      };

      await repository.create(agendamento);

      const found = await repository.findByMedicoAndHorario('1', new Date('2026-06-10T09:00:00Z'));
      expect(found).toEqual(agendamento);
    });
  });

  describe('findByMedicoAndHorario', () => {
    it('deve encontrar agendamento por médico e horário', async () => {
      const agendamento: Agendamento = {
        id: '1',
        medicoId: '1',
        pacienteNome: 'Carlos Almeida',
        dataHorario: new Date('2026-06-10T09:00:00Z'),
      };

      await repository.create(agendamento);

      const found = await repository.findByMedicoAndHorario('1', new Date('2026-06-10T09:00:00Z'));
      expect(found).toEqual(agendamento);
    });

    it('deve retornar null quando agendamento não existe', async () => {
      const found = await repository.findByMedicoAndHorario(
        '999',
        new Date('2026-06-10T09:00:00Z'),
      );
      expect(found).toBeNull();
    });

    it('deve retornar null quando horário não corresponde', async () => {
      const agendamento: Agendamento = {
        id: '1',
        medicoId: '1',
        pacienteNome: 'Carlos Almeida',
        dataHorario: new Date('2026-06-10T09:00:00Z'),
      };

      await repository.create(agendamento);

      const found = await repository.findByMedicoAndHorario('1', new Date('2026-06-10T10:00:00Z'));
      expect(found).toBeNull();
    });
  });
});
