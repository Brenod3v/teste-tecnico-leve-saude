import { Medico } from "@/domain/entities/medico";
import { IMedicoRepository } from "@/domain/repositories/IMedicoRepository.interface";


export class MemoryMedicoRepository implements IMedicoRepository {
  private medicos: Medico[] = [
    {
      id: '1',
      nome: 'Dra. Ana Paula',
      especialidade: 'Cardiologia',
      agenda: [
        new Date('2026-05-10T09:00:00Z'),
        new Date('2026-05-10T10:00:00Z'),
      ],
    },
    {
      id: '2',
      nome: 'Dr. Rodrigo Silva',
      especialidade: 'Dermatologia',
      agenda: [
        new Date('2026-05-11T14:00:00Z'),
        new Date('2026-05-11T15:00:00Z'),
      ],
    },
  ];

  async listAll(): Promise<Medico[]> {
    return this.medicos;
  }

  async findById(id: string): Promise<Medico | null> {
    return this.medicos.find((m) => m.id === id) || null;
  }
}