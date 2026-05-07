
import { CriarAgendamentoUseCase } from '@/application/use-cases/criar-agendamento/criar-agendamento.use-case';
import { ListarAgendasUseCase } from '@/application/use-cases/listar-agendas/listar-agendas.use-case';
import { MemoryAgendamentoRepository } from '@/infra/persistence/memory/memory-agendamento.repository';
import { MemoryMedicoRepository } from '@/infra/persistence/memory/memory-medico.repository';

const medicoRepo = new MemoryMedicoRepository();
const agendamentoRepo = new MemoryAgendamentoRepository();

export const makeListarAgendasUseCase = () => new ListarAgendasUseCase(medicoRepo);

export const makeCriarAgendamentoUseCase = () => 
  new CriarAgendamentoUseCase(agendamentoRepo, medicoRepo);
