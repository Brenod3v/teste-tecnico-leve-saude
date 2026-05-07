import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';
import { ListarAgendasInput, ListarAgendasOutput } from './listar-agendas.dto';

export class ListarAgendasUseCase {
  constructor(private medicoRepository: IMedicoRepository) {}

  async execute(input: ListarAgendasInput): Promise<ListarAgendasOutput[]> {
    const medicos = await this.medicoRepository.listAll();

    return medicos.map(medico => ({
      id: medico.id,
      nome: medico.nome,
      especialidade: medico.especialidade,
      agenda: medico.agenda
    }));
  }
}