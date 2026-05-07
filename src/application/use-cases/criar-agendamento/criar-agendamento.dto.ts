import { z } from 'zod';

export const CriarAgendamentoSchema = z.object({
  medicoId: z.string().min(1, "O ID do médico é obrigatório"),
  pacienteNome: z.string().min(3, "O nome do paciente deve ter pelo menos 3 caracteres"),
  dataHorario: z.coerce.date().refine((date) => date > new Date(), {
    message: "A data do agendamento deve ser no futuro",
  }),
});

export type CriarAgendamentoInput = z.infer<typeof CriarAgendamentoSchema>;

export interface CriarAgendamentoOutput {
  id: string;
  medicoId: string;
  pacienteNome: string;
  dataHorario: Date;
}