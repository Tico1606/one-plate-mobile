import { API_CONFIG } from '@/constants/api'
import type { Category } from '@/types/api'
import { get } from './api'

export const categoriesService = {
  // Buscar todas as categorias
  getAll: async (): Promise<Category[]> => {
    console.log('🔍 DEBUG categoriesService.getAll:', {
      endpoint: API_CONFIG.ENDPOINTS.CATEGORIES.LIST,
      fullUrl: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES.LIST}`,
    })
    try {
      const result = await get<any>(API_CONFIG.ENDPOINTS.CATEGORIES.LIST)
      console.log('✅ DEBUG categoriesService.getAll success:', result)
      console.log('🔍 DEBUG categoriesService.getAll - result.data:', result.data)
      console.log(
        '🔍 DEBUG categoriesService.getAll - result.data.categories:',
        result.data?.categories,
      )
      console.log(
        '🔍 DEBUG categoriesService.getAll - result.categories:',
        result.categories,
      )

      // Verificar se result.data existe ou se result já é o array
      let categories = []
      if (result.data?.categories) {
        categories = result.data.categories
      } else if (result.categories) {
        categories = result.categories
      } else if (Array.isArray(result)) {
        categories = result
      }

      console.log('🔍 DEBUG categoriesService.getAll - categories finais:', categories)
      return categories
    } catch (error) {
      console.error('❌ DEBUG categoriesService.getAll error:', error)
      throw error
    }
  },

  // Buscar categoria por ID
  getById: async (id: number): Promise<Category> => {
    return get<Category>(`${API_CONFIG.ENDPOINTS.CATEGORIES.LIST}/${id}`)
  },
}
