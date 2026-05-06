import { Medico } from '@/domain/entities/medico';
import { MemoryMedicoRepository } from '@/infra/persistence/memory/memory-medico.repository';

export class ListarAgendasUseCase {
  constructor(private medicoRepository: MemoryMedicoRepository) {}

  async execute(): Promise<Medico[]> {
    return await this.medicoRepository.listAll();
  }
}