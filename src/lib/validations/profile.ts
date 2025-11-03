import { z } from 'zod'

// Schema para edição de perfil
export const editProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>
