import { Medico } from '@/domain/entities/medico';
import { IAgendaRepository } from '@/domain/repositories/agenda.repository';

export class ListarAgendasUseCase {
  constructor(private agendaRepository: IAgendaRepository) {}

  async execute(): Promise<Medico[]> {
    return await this.agendaRepository.listAll();
  }
}