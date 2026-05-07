import { Medico } from '@/domain/entities/medico';
import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';

export class ListarAgendasUseCase {
  constructor(private medicoRepository: IMedicoRepository) {}

  async execute(): Promise<Medico[]> {
    return await this.medicoRepository.listAll();
  }
}