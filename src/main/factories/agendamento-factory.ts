import { CriarAgendamentoUseCase } from '@/application/use-cases/criar-agendamento/criar-agendamento.use-case';
import { ListarAgendasUseCase } from '@/application/use-cases/listar-agendas/listar-agendas.use-case';
import { TriagemUseCase } from '@/application/use-cases/triagem/triagem.use-case';
import { IAgendamentoRepository } from '@/domain/repositories/IAgendamentoRepository.interface';
import { IMedicoRepository } from '@/domain/repositories/IMedicoRepository.interface';
import { IAIService } from '@/domain/services/ai.service.interface';
import { MemoryAgendamentoRepository } from '@/infra/persistence/memory/memory-agendamento.repository';
import { MemoryMedicoRepository } from '@/infra/persistence/memory/memory-medico.repository';
import { MockAIService } from '@/infra/ai/mock-ai.service';
import { OpenAIService } from '@/infra/ai/openai-ai.service';
import { AnthropicService } from '@/infra/ai/anthropic-ai.service';
import { getAIConfig } from '@/infra/ai/ai.config';

export class UseCaseFactory {
  constructor(
    private agendamentoRepository: IAgendamentoRepository,
    private medicoRepository: IMedicoRepository,
    private aiService: IAIService,
  ) {}

  makeListarAgendasUseCase(): ListarAgendasUseCase {
    return new ListarAgendasUseCase(this.medicoRepository);
  }

  makeCriarAgendamentoUseCase(): CriarAgendamentoUseCase {
    return new CriarAgendamentoUseCase(this.agendamentoRepository, this.medicoRepository);
  }

  makeTriagemUseCase(): TriagemUseCase {
    return new TriagemUseCase(this.aiService);
  }
}

function createAIService(): IAIService {
  const config = getAIConfig();

  switch (config.provider) {
    case 'openai':
      if (!config.apiKey) {
        console.warn('[Factory] OpenAI API key não configurada, usando Mock');
        return new MockAIService();
      }
      return new OpenAIService(config.apiKey, config.model);

    case 'anthropic':
      if (!config.apiKey) {
        console.warn('[Factory] Anthropic API key não configurada, usando Mock');
        return new MockAIService();
      }
      return new AnthropicService(config.apiKey, config.model);

    case 'mock':
    default:
      return new MockAIService();
  }
}

export function createUseCaseFactory(): UseCaseFactory {
  return new UseCaseFactory(
    MemoryAgendamentoRepository.getInstance(),
    MemoryMedicoRepository.getInstance(),
    createAIService(),
  );
}
