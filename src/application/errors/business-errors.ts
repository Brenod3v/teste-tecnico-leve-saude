import { AppError } from './base-error';

export class MedicoNotFoundError extends AppError {
  constructor() {
    super('Médico não encontrado.', 404);
  }
}

export class HorarioIndisponivelError extends AppError {
  constructor() {
    super('O horário selecionado não está na agenda deste médico.', 400);
  }
}

export class AgendamentoConflictError extends AppError {
  constructor() {
    super('Este horário já está reservado para este médico.', 409);
  }
}