import { API_CONFIG } from '@/constants/api'
import type { Category } from '@/types/api'
import { get } from './api'

export const categoriesService = {
  // Buscar todas as categorias
  getAll: async (): Promise<Category[]> => {
    try {
      const result = await get<any>(API_CONFIG.ENDPOINTS.CATEGORIES.LIST)

      // Verificar se result.data existe ou se result já é o array
      let categories = []
      if (result.data?.categories) {
        categories = result.data.categories
      } else if (result.categories) {
        categories = result.categories
      } else if (Array.isArray(result)) {
        categories = result
      }

      return categories
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error)
      throw error
    }
  },

  // Buscar categoria por ID
  getById: async (id: number): Promise<Category> => {
    return get<Category>(`${API_CONFIG.ENDPOINTS.CATEGORIES.LIST}/${id}`)
  },
}
