import { z } from 'zod';

export const ListarAgendasInputSchema = z.object({
  especialidade: z.string().optional(),
});

export type ListarAgendasInput = z.infer<typeof ListarAgendasInputSchema>;

export const ListarAgendasOutputSchema = z.object({
  id: z.string(),
  nome: z.string(),
  especialidade: z.string(),
  agenda: z.array(z.date()),
});

export type ListarAgendasOutput = z.infer<typeof ListarAgendasOutputSchema>;