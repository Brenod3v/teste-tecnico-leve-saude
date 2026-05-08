import {
  MedicoNotFoundError,
  HorarioIndisponivelError,
  AgendamentoConflictError,
} from '../business-errors';

describe('Business Errors', () => {
  describe('MedicoNotFoundError', () => {
    it('deve ter mensagem correta', () => {
      const error = new MedicoNotFoundError();

      expect(error.message).toBe('Médico não encontrado.');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('HorarioIndisponivelError', () => {
    it('deve ter mensagem correta', () => {
      const error = new HorarioIndisponivelError();

      expect(error.message).toBe('Horário indisponível');
      expect(error.statusCode).toBe(409);
      expect(error.details).toBe('O horário solicitado não está mais disponível para este médico.');
    });
  });

  describe('AgendamentoConflictError', () => {
    it('deve ter mensagem correta', () => {
      const error = new AgendamentoConflictError();

      expect(error.message).toBe('Horário indisponível');
      expect(error.statusCode).toBe(409);
      expect(error.details).toBe('O horário solicitado não está mais disponível para este médico.');
    });
  });
});
