import { z } from 'zod'

// Schema para ingrediente
const ingredientSchema = z.object({
  name: z.string().min(1, 'Nome do ingrediente é obrigatório'),
  amount: z.string().min(1, 'Quantidade é obrigatória'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
})

// Schema para ingrediente individual (para validação de campos específicos)
export const ingredientFieldSchema = z.object({
  name: z.string().min(1, 'Nome do ingrediente é obrigatório'),
  amount: z.string().min(1, 'Quantidade é obrigatória'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
})

// Schema para instrução
const instructionSchema = z.object({
  description: z.string().min(1, 'Descrição da instrução é obrigatória'),
})

// Schema para criação de receita
export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'], {
    errorMap: () => ({ message: 'Dificuldade é obrigatória' }),
  }),
  preparationTime: z.number().min(1, 'Tempo de preparo deve ser maior que 0'),
  servings: z.number().min(1, 'Número de porções deve ser maior que 0'),
  calories: z.number().optional(),
  proteinGrams: z.number().optional(),
  carbGrams: z.number().optional(),
  fatGrams: z.number().optional(),
  videoUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, 'Pelo menos um ingrediente é obrigatório'),
  instructions: z
    .array(instructionSchema)
    .min(1, 'Pelo menos uma instrução é obrigatória'),
  categoryIds: z.array(z.string()).min(1, 'Pelo menos uma categoria é obrigatória'),
})

// Schema para rascunho (validação mais flexível)
export const createDraftSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('EASY'),
  preparationTime: z.number().default(0),
  servings: z.number().default(1),
  calories: z.number().optional(),
  proteinGrams: z.number().optional(),
  carbGrams: z.number().optional(),
  fatGrams: z.number().optional(),
  videoUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  ingredients: z.array(ingredientSchema).optional(),
  instructions: z.array(instructionSchema).optional(),
  categoryIds: z.array(z.string()).optional(),
})

export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>
export type CreateDraftFormData = z.infer<typeof createDraftSchema>
export type IngredientFormData = z.infer<typeof ingredientSchema>
export type IngredientFieldFormData = z.infer<typeof ingredientFieldSchema>
export type InstructionFormData = z.infer<typeof instructionSchema>
