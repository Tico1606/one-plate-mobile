import { API_CONFIG } from '@/constants/api'
import type { ApiResponse, PaginatedResponse, Recipe, RecipeFilters } from '@/types/api'
import { del, get, post, put } from './api'

export const recipesService = {
  // Buscar todas as receitas
  getAll: async (filters?: RecipeFilters): Promise<PaginatedResponse<Recipe>> => {
    const params = new URLSearchParams()

    if (filters?.category) params.append('categoryId', filters.category.toString())
    if (filters?.difficulty) params.append('difficulty', filters.difficulty)
    if (filters?.maxTime) params.append('maxTime', filters.maxTime.toString())
    if (filters?.minRating) params.append('minRating', filters.minRating.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const url = queryString
      ? `${API_CONFIG.ENDPOINTS.RECIPES.LIST}?${queryString}`
      : API_CONFIG.ENDPOINTS.RECIPES.LIST

    try {
      const result = await get<any>(url)

      // Verificar se a resposta tem a estrutura esperada
      if (result.data?.recipes) {
        return result.data
      } else if (result.recipes) {
        // Se retornar diretamente as receitas, criar estrutura de paginação
        const currentPage = filters?.page || 1
        const limit = filters?.limit || 10
        const totalRecipes = result.total || result.recipes.length
        const totalPages = Math.ceil(totalRecipes / limit)

        return {
          data: result.recipes,
          pagination: {
            page: currentPage,
            limit,
            total: totalRecipes,
            totalPages,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
          },
        }
      } else {
        console.error('❌ Estrutura de resposta inesperada:', result)
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar receitas:', error)
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    }
  },

  // Buscar receita por ID
  getById: async (id: string | number): Promise<Recipe> => {
    const url = API_CONFIG.ENDPOINTS.RECIPES.DETAIL.replace(':id', id.toString())
    try {
      const result = await get<any>(url)
      // A API retorna a receita dentro de um objeto 'recipe'
      const rawRecipe = result.recipe || result

      // Mapear os dados da API para o formato esperado
      const mappedRecipe: Recipe = {
        id: rawRecipe.id,
        title: rawRecipe.title,
        description: rawRecipe.description,
        author: rawRecipe.author,
        difficulty: rawRecipe.difficulty,
        prepMinutes: rawRecipe.prepMinutes,
        cookMinutes: rawRecipe.cookMinutes,
        totalMinutes: rawRecipe.prepMinutes + rawRecipe.cookMinutes,
        servings: rawRecipe.servings,
        image: rawRecipe.photos?.[0] || 'https://via.placeholder.com/400x300',
        images: rawRecipe.photos || [],
        videoUrl: rawRecipe.videoUrl,
        source: rawRecipe.source,
        calories: rawRecipe.calories,
        proteinGrams: rawRecipe.proteinGrams,
        carbGrams: rawRecipe.carbGrams,
        fatGrams: rawRecipe.fatGrams,
        status: rawRecipe.status,
        publishedAt: rawRecipe.publishedAt,
        createdAt: rawRecipe.createdAt,
        updatedAt: rawRecipe.updatedAt,
        rating: 0, // Valor padrão
        totalRatings: 0, // Valor padrão
        likes: rawRecipe._count?.favorites || 0,
        views: rawRecipe._count?.views || 0,
        isLiked: false, // Valor padrão
        isViewed: false, // Valor padrão
        ingredients:
          rawRecipe.ingredients?.map((ing: any) => ({
            id: ing.ingredientId,
            name: ing.ingredient?.name || 'Ingrediente',
            amount: ing.amount,
            unit: ing.unit,
            note: ing.note,
          })) || [],
        instructions:
          rawRecipe.steps?.map((step: any) => ({
            id: step.id,
            order: step.order,
            description: step.description,
            durationMinutes: Math.round(step.durationSec / 60),
          })) || [],
        categories:
          rawRecipe.categories?.map((cat: any) => ({
            id: cat.categoryId,
            name: cat.category?.name || 'Categoria',
            icon: cat.category?.icon,
            color: cat.category?.color,
            recipeCount: 0, // Valor padrão
          })) || [],
        reviews: rawRecipe.reviews || [],
      }

      return mappedRecipe
    } catch {
      // Dados mockados para fallback
      return {
        id: id.toString(),
        title: 'Pudim de Leite Condensado',
        description: 'Pudim cremoso e delicioso, perfeito para sobremesa',
        author: {
          id: '1',
          email: 'joao@email.com',
          name: 'João Silva',
          avatar: 'https://via.placeholder.com/40',
          role: 'USER' as const,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        difficulty: 'MEDIUM' as const,
        prepMinutes: 15,
        cookMinutes: 60,
        totalMinutes: 75,
        servings: 8,
        image: 'https://via.placeholder.com/400x300',
        images: ['https://via.placeholder.com/400x300'],
        status: 'PUBLISHED' as const,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        rating: 4.5,
        totalRatings: 23,
        likes: 45,
        views: 156,
        isLiked: false,
        isViewed: false,
        ingredients: [
          {
            id: '1',
            name: 'Leite condensado',
            amount: 1,
            unit: 'lata',
            note: '395g',
          },
          {
            id: '2',
            name: 'Leite',
            amount: 2,
            unit: 'xícaras',
          },
          {
            id: '3',
            name: 'Ovos',
            amount: 3,
            unit: 'unidades',
          },
          {
            id: '4',
            name: 'Açúcar',
            amount: 1,
            unit: 'xícara',
            note: 'Para a calda',
          },
        ],
        instructions: [
          {
            id: '1',
            order: 1,
            description:
              'Em uma panela, derreta o açúcar até ficar dourado para fazer a calda',
            durationMinutes: 10,
          },
          {
            id: '2',
            order: 2,
            description: 'Despeje a calda em uma forma de pudim e reserve',
            durationMinutes: 5,
          },
          {
            id: '3',
            order: 3,
            description: 'No liquidificador, bata o leite condensado, leite e os ovos',
            durationMinutes: 3,
          },
          {
            id: '4',
            order: 4,
            description: 'Despeje a mistura na forma com calda',
            durationMinutes: 2,
          },
          {
            id: '5',
            order: 5,
            description: 'Leve ao forno em banho-maria por 1 hora',
            durationMinutes: 60,
          },
        ],
        categories: [
          {
            id: '1',
            name: 'Sobremesas',
            icon: 'ice-cream',
            color: 'bg-pink-500',
            recipeCount: 5,
          },
        ],
        reviews: [
          {
            id: '1',
            user: {
              id: '2',
              email: 'maria@email.com',
              name: 'Maria Santos',
              avatar: 'https://via.placeholder.com/32',
              role: 'USER' as const,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
            rating: 5,
            comment: 'Ficou perfeito! Muito cremoso e saboroso.',
            helpfulCount: 8,
            createdAt: '2024-01-20T14:30:00Z',
            isHelpful: false,
          },
          {
            id: '2',
            user: {
              id: '3',
              email: 'pedro@email.com',
              name: 'Pedro Oliveira',
              avatar: 'https://via.placeholder.com/32',
              role: 'USER' as const,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
            rating: 4,
            comment: 'Receita fácil e deliciosa. Recomendo!',
            helpfulCount: 5,
            createdAt: '2024-01-18T09:15:00Z',
            isHelpful: true,
          },
        ],
      }
    }
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
    filters?: Omit<RecipeFilters, 'category'>,
  ): Promise<PaginatedResponse<Recipe>> => {
    return recipesService.getAll({ ...filters, category: categoryId.toString() })
  },

  // Buscar receitas populares
  // getPopular: async (limit: number = 10): Promise<Recipe[]> => {
  //   return get<Recipe[]>(`${API_CONFIG.ENDPOINTS.RECIPES.LIST}/popular?limit=${limit}`)
  // },

  // Buscar receitas recentes
  getRecent: async (limit: number = 10): Promise<Recipe[]> => {
    // Usar o endpoint de listagem com ordenação por data de criação
    const url = `${API_CONFIG.ENDPOINTS.RECIPES.LIST}?limit=${limit}&sortBy=createdAt&sortOrder=desc`
    try {
      const result = await get<any>(url)
      // O backend retorna { data: { recipes: [...] } } diretamente
      // Mas result já é o objeto data, então acessamos result.recipes
      const recipes = result.recipes || []
      return recipes
    } catch (error) {
      console.error('❌ Erro ao buscar receitas recentes:', error)
      // Se falhar, retornar array vazio em vez de lançar erro
      return []
    }
  },
}
