import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number({ error: 'Id inválido' }).int('Id inválido').positive('Id inválido'),
});

export const questionBodySchema = z.object({
  optionNumber: z.coerce
    .number({ error: 'El número es obligatorio' })
    .int('Debe ser un número entero')
    .min(1, 'Debe ser mayor a 0')
    .max(65535, 'Número demasiado grande'),
  question: z
    .string({ error: 'La pregunta es obligatoria' })
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  answer: z
    .string({ error: 'La respuesta es obligatoria' })
    .trim()
    .min(1, 'La respuesta es obligatoria')
    .max(5000, 'Máximo 5000 caracteres'),
  isActive: z.boolean().default(true),
});
