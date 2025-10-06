import { API_CONFIG } from '@/constants/api'
import { get, post } from './api'

// Interface para ingrediente
export interface Ingredient {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Interface para criar ingrediente
export interface CreateIngredientRequest {
  name: string
}

// Interface para resposta de criação
export interface CreateIngredientResponse {
  ingredient: Ingredient
}

export const ingredientsService = {
  // Buscar todos os ingredientes
  getAll: async (): Promise<Ingredient[]> => {
    return get<Ingredient[]>(API_CONFIG.ENDPOINTS.INGREDIENTS.LIST)
  },

  // Buscar ingrediente por ID
  getById: async (id: string): Promise<Ingredient> => {
    return get<Ingredient>(`${API_CONFIG.ENDPOINTS.INGREDIENTS.LIST}/${id}`)
  },

  // Criar novo ingrediente
  create: async (
    ingredient: CreateIngredientRequest,
  ): Promise<CreateIngredientResponse> => {
    return post<CreateIngredientResponse>(API_CONFIG.ENDPOINTS.INGREDIENTS.CREATE, ingredient)
  },

  // Buscar ou criar ingrediente por nome
  findOrCreate: async (name: string): Promise<Ingredient> => {
    try {
      // Primeiro tenta buscar ingredientes existentes
      const ingredients = await ingredientsService.getAll()

      // Verificar se ingredients é um array
      if (!Array.isArray(ingredients)) {
        console.warn('getAll() não retornou um array, criando ingrediente diretamente')
        const response = await ingredientsService.create({ name: name.trim() })
        return response.ingredient
      }

      const existing = ingredients.find(
        (ing) => ing.name.toLowerCase().trim() === name.toLowerCase().trim(),
      )

      if (existing) {
        return existing
      }

      // Se não encontrou, cria um novo
      const response = await ingredientsService.create({ name: name.trim() })
      return response.ingredient
    } catch (error) {
      console.error('Erro ao buscar/criar ingrediente:', error)
      // Se falhar ao buscar, tenta criar diretamente
      try {
        const response = await ingredientsService.create({ name: name.trim() })
        return response.ingredient
      } catch (createError) {
        console.error('Erro ao criar ingrediente:', createError)
        throw createError
      }
    }
  },

  // Criar múltiplos ingredientes
  createMultiple: async (names: string[]): Promise<Ingredient[]> => {
    const ingredients: Ingredient[] = []

    for (const name of names) {
      if (name.trim()) {
        try {
          const ingredient = await ingredientsService.findOrCreate(name.trim())
          ingredients.push(ingredient)
        } catch (error) {
          console.error(`Erro ao criar ingrediente "${name}":`, error)
          // Continua com os outros ingredientes mesmo se um falhar
        }
      }
    }

    return ingredients
  },
}
