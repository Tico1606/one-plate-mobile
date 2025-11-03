import { z } from 'zod'

export const createReviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Avaliação deve ser de no mínimo 1 estrela')
    .max(5, 'Avaliação deve ser de no máximo 5 estrelas')
    .int('Avaliação deve ser um número inteiro'),
  comment: z
    .string()
    .max(500, 'Comentário muito longo (máximo 500 caracteres)')
    .optional(),
})

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Avaliação deve ser de no mínimo 1 estrela')
    .max(5, 'Avaliação deve ser de no máximo 5 estrelas')
    .int('Avaliação deve ser um número inteiro')
    .optional(),
  comment: z
    .string()
    .max(500, 'Comentário muito longo (máximo 500 caracteres)')
    .optional(),
})

export type CreateReviewFormData = z.infer<typeof createReviewSchema>
export type UpdateReviewFormData = z.infer<typeof updateReviewSchema>
