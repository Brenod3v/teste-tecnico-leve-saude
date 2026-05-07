import { z } from 'zod';

const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

export const CriarAgendamentoSchema = z.object({
  agendamento: z.object({
    medico_id: z.string().min(1, "O ID do médico é obrigatório"),
    paciente: z.string().min(3, "O nome do paciente deve ter pelo menos 3 caracteres"),
    data_horario: z.string().regex(dateTimeRegex, "Formato deve ser YYYY-MM-DD HH:mm"),
  }),
});

export type CriarAgendamentoInput = z.infer<typeof CriarAgendamentoSchema>;

export interface CriarAgendamentoOutput {
  mensagem: string;
  agendamento: {
    id: string;
    medico: string;
    paciente: string;
    data_horario: string;
  };
}