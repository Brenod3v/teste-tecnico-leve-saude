import { AppError } from './base-error';

export class MedicoNotFoundError extends AppError {
  constructor() {
    super('Médico não encontrado.', 404);
  }
}

export class HorarioIndisponivelError extends AppError {
  constructor() {
    super(
      'Horário indisponível',
      409,
      'O horário solicitado não está mais disponível para este médico.'
    );
  }
}

export class AgendamentoConflictError extends AppError {
  constructor() {
    super(
      'Horário indisponível',
      409,
      'O horário solicitado não está mais disponível para este médico.'
    );
  }
}
