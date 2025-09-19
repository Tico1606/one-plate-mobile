import { API_CONFIG } from '@/constants/api'
import type { Category } from '@/types/api'
import { get } from './api'

export const categoriesService = {
  // Buscar todas as categorias
  getAll: async (): Promise<Category[]> => {
    return get<Category[]>(API_CONFIG.ENDPOINTS.CATEGORIES.LIST)
  },

  // Buscar categoria por ID
  getById: async (id: number): Promise<Category> => {
    return get<Category>(`${API_CONFIG.ENDPOINTS.CATEGORIES.LIST}/${id}`)
  },
}
