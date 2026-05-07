import { MemoryMedicoRepository } from '../memory-medico.repository';

describe('MemoryMedicoRepository', () => {
  let repository: MemoryMedicoRepository;

  beforeEach(() => {
    repository = MemoryMedicoRepository.getInstance();
  });

  describe('listAll', () => {
    it('deve retornar lista de médicos', async () => {
      const medicos = await repository.listAll();

      expect(medicos.length).toBeGreaterThan(0);
      expect(medicos[0]).toHaveProperty('id');
      expect(medicos[0]).toHaveProperty('nome');
      expect(medicos[0]).toHaveProperty('especialidade');
      expect(medicos[0]).toHaveProperty('agenda');
    });
  });

  describe('findById', () => {
    it('deve encontrar médico por ID', async () => {
      const medico = await repository.findById('1');

      expect(medico).not.toBeNull();
      expect(medico?.id).toBe('1');
      expect(medico?.nome).toBe('Dr. João Silva');
    });

    it('deve retornar null quando médico não existe', async () => {
      const medico = await repository.findById('999');

      expect(medico).toBeNull();
    });
  });

  describe('removeHorario', () => {
    it('deve remover horário da agenda do médico', async () => {
      const medico = await repository.findById('1');
      const initialCount = medico?.agenda.length || 0;

      const horarioParaRemover = medico?.agenda[0];
      if (horarioParaRemover) {
        await repository.removeHorario('1', horarioParaRemover);
      }

      const medicoAtualizado = await repository.findById('1');
      const finalCount = medicoAtualizado?.agenda.length || 0;

      expect(finalCount).toBe(initialCount - 1);
    });

    it('não deve remover horário se médico não existe', async () => {
      const horario = new Date('2026-06-10T09:00:00Z');
      await repository.removeHorario('999', horario);

      const medico = await repository.findById('1');
      const initialCount = medico?.agenda.length || 0;

      expect(initialCount).toBeGreaterThan(0);
    });
  });
});
