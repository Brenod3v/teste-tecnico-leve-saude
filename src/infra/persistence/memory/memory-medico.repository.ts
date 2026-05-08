import { Medico } from '@/domain/entities/medico';
import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';

export class MemoryMedicoRepository implements IMedicoRepository {
  private static instance: MemoryMedicoRepository;
  private medicos: Medico[] = [
    {
      id: '1',
      nome: 'Dr. João Silva',
      especialidade: 'Cardiologista',
      agenda: [
        new Date('2026-06-10T09:00:00Z'),
        new Date('2026-06-10T10:00:00Z'),
        new Date('2026-06-10T11:00:00Z'),
        new Date('2026-06-10T14:00:00Z'),
        new Date('2026-06-10T15:00:00Z'),
        new Date('2026-06-11T09:00:00Z'),
        new Date('2026-06-11T10:00:00Z'),
      ],
    },
    {
      id: '2',
      nome: 'Dra. Maria Souza',
      especialidade: 'Dermatologista',
      agenda: [
        new Date('2026-06-11T14:00:00Z'),
        new Date('2026-06-11T15:00:00Z'),
        new Date('2026-06-11T16:00:00Z'),
        new Date('2026-06-12T09:00:00Z'),
        new Date('2026-06-12T10:00:00Z'),
        new Date('2026-06-12T11:00:00Z'),
      ],
    },
    {
      id: '3',
      nome: 'Dr. Pedro Oliveira',
      especialidade: 'Oftalmologista',
      agenda: [
        new Date('2026-06-09T08:00:00Z'),
        new Date('2026-06-09T09:00:00Z'),
        new Date('2026-06-09T10:00:00Z'),
        new Date('2026-06-13T14:00:00Z'),
        new Date('2026-06-13T15:00:00Z'),
      ],
    },
  ];

  private constructor() {}

  static getInstance(): MemoryMedicoRepository {
    if (!MemoryMedicoRepository.instance) {
      MemoryMedicoRepository.instance = new MemoryMedicoRepository();
    }
    return MemoryMedicoRepository.instance;
  }

  async listAll(): Promise<Medico[]> {
    return this.medicos;
  }

  async findById(id: string): Promise<Medico | null> {
    return this.medicos.find((m) => m.id === id) || null;
  }

  async removeHorario(medicoId: string, data: Date): Promise<void> {
    const medico = this.medicos.find((m) => m.id === medicoId);
    if (medico) {
      medico.agenda = medico.agenda.filter((horario) => horario.getTime() !== data.getTime());
    }
  }
}
