import '@/config/env';
import { withLogging, withErrorHandling } from './middleware';
import { handleListarAgendas, handleCriarAgendamento, handleTriagem } from './implementations';

export const listarAgendasHandler = withLogging(
  'ListarAgendas',
  withErrorHandling(handleListarAgendas),
);

export const criarAgendamentoHandler = withLogging(
  'CriarAgendamento',
  withErrorHandling(handleCriarAgendamento),
);

export const triagemHandler = withLogging('Triagem', withErrorHandling(handleTriagem));
