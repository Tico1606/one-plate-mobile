import { API_CONFIG } from '@/constants/api'
import type { ApiResponse, PaginatedResponse, Recipe, RecipeFilters } from '@/types/api'
import { del, get, post, put } from './api'

export const recipesService = {
  // Buscar todas as receitas
  getAll: async (filters?: RecipeFilters): Promise<PaginatedResponse<Recipe>> => {
    const params = new URLSearchParams()

    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString())
    if (filters?.difficulty) params.append('difficulty', filters.difficulty)
    if (filters?.time) params.append('time', filters.time)
    if (filters?.rating) params.append('rating', filters.rating.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const url = queryString
      ? `${API_CONFIG.ENDPOINTS.RECIPES.LIST}?${queryString}`
      : API_CONFIG.ENDPOINTS.RECIPES.LIST

    return get<PaginatedResponse<Recipe>>(url)
  },

  // Buscar receita por ID
  getById: async (id: number): Promise<Recipe> => {
    const url = API_CONFIG.ENDPOINTS.RECIPES.DETAIL.replace(':id', id.toString())
    return get<Recipe>(url)
  },

  // Criar nova receita
  create: async (
    recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'authorId'>,
  ): Promise<Recipe> => {
    return post<Recipe>(API_CONFIG.ENDPOINTS.RECIPES.CREATE, recipe)
  },

  // Atualizar receita
  update: async (id: number, recipe: Partial<Recipe>): Promise<Recipe> => {
    const url = API_CONFIG.ENDPOINTS.RECIPES.UPDATE.replace(':id', id.toString())
    return put<Recipe>(url, recipe)
  },

  // Deletar receita
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const url = API_CONFIG.ENDPOINTS.RECIPES.DELETE.replace(':id', id.toString())
    return del<ApiResponse<null>>(url)
  },

  // Buscar receitas favoritas
  // getFavorites: async (): Promise<Recipe[]> => {
  //   return get<Recipe[]>(API_CONFIG.ENDPOINTS.RECIPES.FAVORITES)
  // },

  // Adicionar/remover favorito
  toggleFavorite: async (recipeId: number): Promise<ApiResponse<boolean>> => {
    return post<ApiResponse<boolean>>(
      `${API_CONFIG.ENDPOINTS.RECIPES.FAVORITES}/${recipeId}`,
    )
  },

  // Buscar receitas por categoria
  getByCategory: async (
    categoryId: number,
    filters?: Omit<RecipeFilters, 'categoryId'>,
  ): Promise<PaginatedResponse<Recipe>> => {
    return recipesService.getAll({ ...filters, categoryId })
  },

  // Buscar receitas populares
  // getPopular: async (limit: number = 10): Promise<Recipe[]> => {
  //   return get<Recipe[]>(`${API_CONFIG.ENDPOINTS.RECIPES.LIST}/popular?limit=${limit}`)
  // },

  // Buscar receitas recentes
  getRecent: async (limit: number = 10): Promise<Recipe[]> => {
    // Usar o endpoint de listagem com ordenação por data de criação
    const url = `${API_CONFIG.ENDPOINTS.RECIPES.LIST}?limit=${limit}&sortBy=createdAt&sortOrder=desc`
    console.log('🔍 DEBUG recipesService.getRecent:', {
      url,
      fullUrl: `${API_CONFIG.BASE_URL}${url}`,
    })
    try {
      const result = await get<any>(url)
      console.log('✅ DEBUG recipesService.getRecent success:', result)
      console.log('🔍 DEBUG recipesService.getRecent - result.data:', result.data)
      console.log('🔍 DEBUG recipesService.getRecent - result.recipes:', result.recipes)
      // O backend retorna { data: { recipes: [...] } } diretamente
      // Mas result já é o objeto data, então acessamos result.recipes
      const recipes = result.recipes || []
      console.log('🔍 DEBUG recipesService.getRecent - recipes finais:', recipes)
      return recipes
    } catch (error) {
      console.error('❌ DEBUG recipesService.getRecent error:', error)
      // Se falhar, retornar array vazio em vez de lançar erro
      return []
    }
  },
}
