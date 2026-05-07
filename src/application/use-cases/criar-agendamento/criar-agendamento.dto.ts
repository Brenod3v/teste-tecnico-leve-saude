import { Agendamento } from "@/domain/entities/agendamento";

export interface CriarAgendamentoInput {
  medicoId: string;
  pacienteNome: string;
  dataHorario: Date;
}

export interface CriarAgendamentoOutput {
  id: string;
  medicoId: string;
  pacienteNome: string;
  dataHorario: Date;
}