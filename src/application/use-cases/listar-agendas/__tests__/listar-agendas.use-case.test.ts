import { ListarAgendasUseCase } from '../listar-agendas.use-case';
import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';
import { Medico } from '@/domain/entities/medico.entity';

describe('ListarAgendasUseCase', () => {
  let useCase: ListarAgendasUseCase;
  let medicoRepository: jest.Mocked<IMedicoRepository>;

  const mockMedicos: Medico[] = [
    {
      id: '1',
      nome: 'Dr. João Silva',
      especialidade: 'Cardiologista',
      agenda: [new Date('2026-06-10T09:00:00Z'), new Date('2026-06-10T10:00:00Z')],
    },
    {
      id: '2',
      nome: 'Dra. Maria Souza',
      especialidade: 'Dermatologista',
      agenda: [new Date('2026-06-11T14:00:00Z')],
    },
  ];

  beforeEach(() => {
    medicoRepository = {
      listAll: jest.fn(),
      findById: jest.fn(),
      removeHorario: jest.fn(),
    };

    useCase = new ListarAgendasUseCase(medicoRepository);
  });

  describe('execute', () => {
    it('deve retornar lista de médicos com horários formatados', async () => {
      medicoRepository.listAll.mockResolvedValue(mockMedicos);

      const result = await useCase.execute({});

      expect(result.medicos).toHaveLength(2);
      expect(result.medicos[0]).toEqual({
        id: '1',
        nome: 'Dr. João Silva',
        especialidade: 'Cardiologista',
        horarios_disponiveis: ['2026-06-10 09:00', '2026-06-10 10:00'],
      });
      expect(result.medicos[1]).toEqual({
        id: '2',
        nome: 'Dra. Maria Souza',
        especialidade: 'Dermatologista',
        horarios_disponiveis: ['2026-06-11 14:00'],
      });
    });

    it('deve retornar lista vazia quando não há médicos', async () => {
      medicoRepository.listAll.mockResolvedValue([]);

      const result = await useCase.execute({});

      expect(result.medicos).toHaveLength(0);
    });

    it('deve formatar datas corretamente em UTC', async () => {
      const medico: Medico = {
        id: '1',
        nome: 'Dr. Test',
        especialidade: 'Test',
        agenda: [new Date('2026-12-25T23:59:00Z')],
      };

      medicoRepository.listAll.mockResolvedValue([medico]);

      const result = await useCase.execute({});

      expect(result.medicos[0].horarios_disponiveis[0]).toBe('2026-12-25 23:59');
    });
  });
});
