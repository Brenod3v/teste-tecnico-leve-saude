import { z } from 'zod';

export const ListarAgendasInputSchema = z.object({}).strict();

export type ListarAgendasInput = z.infer<typeof ListarAgendasInputSchema>;

export const ListarAgendasOutputSchema = z.object({
  medicos: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      especialidade: z.string(),
      horarios_disponiveis: z.array(z.string()),
    })
  ),
});

export type ListarAgendasOutput = z.infer<typeof ListarAgendasOutputSchema>;