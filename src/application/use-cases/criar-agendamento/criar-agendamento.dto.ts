import { Agendamento } from "@/domain/entities/agendamento";

export interface CriarAgendamentoInput {
  medicoId: string;
  pacienteNome: string;
  dataHorario: Date;
}

export type CriarAgendamentoOutput = Agendamento;