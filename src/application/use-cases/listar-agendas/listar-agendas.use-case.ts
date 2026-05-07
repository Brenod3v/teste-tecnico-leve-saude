import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';
import { ListarAgendasInput, ListarAgendasOutput } from './listar-agendas.dto';

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export class ListarAgendasUseCase {
  constructor(private medicoRepository: IMedicoRepository) {}

  async execute(input: ListarAgendasInput): Promise<ListarAgendasOutput> {
    const medicos = await this.medicoRepository.listAll();

    return {
      medicos: medicos.map(medico => ({
        id: medico.id,
        nome: medico.nome,
        especialidade: medico.especialidade,
        horarios_disponiveis: medico.agenda.map(formatDateToString),
      })),
    };
  }
}