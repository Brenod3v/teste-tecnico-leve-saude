import { z } from 'zod';

export const TriagemInputSchema = z.object({
  sintomas: z.string().min(10, 'Descreva os sintomas com pelo menos 10 caracteres'),
});

export type TriagemInput = z.infer<typeof TriagemInputSchema>;

export interface TriagemOutput {
  especialidadeSugerida: string;
  confianca: number;
  justificativa: string;
}
