import { API_CONFIG } from '@/constants/api'
import type {
  ApiResponse,
  CreateRecipeRequest,
  PaginatedResponse,
  Recipe,
  RecipeFilters,
} from '@/types/api'
import { del, get, post, put } from './api'

export const recipesService = {
  // Buscar todas as receitas
  getAll: async (filters?: RecipeFilters): Promise<PaginatedResponse<Recipe>> => {
    const params = new URLSearchParams()

    // Suporte a múltiplas categorias - usar o novo formato
    if (filters?.categories && filters.categories.length > 0) {
      // Enviar como string separada por vírgulas: "Italiana,Jantar"
      params.append('categories', filters.categories.join(','))
    } else if (filters?.category) {
      // Compatibilidade com categoria única
      params.append('categoryId', filters.category.toString())
    }

    if (filters?.difficulty) params.append('difficulty', filters.difficulty)
    if (filters?.prepTime) params.append('prepTime', filters.prepTime.toString())
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

      // Calcular averageRating baseado nas reviews se não vier da API
      const calculateAverageRating = (reviews: any[]) => {
        if (!reviews || reviews.length === 0) return 0
        const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
        return sum / reviews.length
      }

      const calculatedAverageRating = calculateAverageRating(rawRecipe.reviews)

      // Mapear os dados da API para o formato esperado
      const mappedRecipe: Recipe = {
        id: rawRecipe.id,
        title: rawRecipe.title,
        description: rawRecipe.description,
        authorId: rawRecipe.authorId,
        author: rawRecipe.author,
        difficulty: rawRecipe.difficulty,
        prepTime: rawRecipe.prepTime,
        servings: rawRecipe.servings,
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
        averageRating:
          rawRecipe.averageRating > 0 ? rawRecipe.averageRating : calculatedAverageRating,
        totalReviews:
          rawRecipe.totalReviews > 0
            ? rawRecipe.totalReviews
            : (rawRecipe.reviews?.length ?? 0),
        totalFavorites: rawRecipe.totalFavorites ?? 0,
        totalViews: rawRecipe.totalViews ?? 0,
        image:
          rawRecipe.image ||
          rawRecipe.photos?.[0]?.url ||
          'https://via.placeholder.com/400x300',
        photos: rawRecipe.photos || [],
        ingredients:
          rawRecipe.ingredients?.map((ing: any) => ({
            id: ing.id,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            note: ing.note,
            group: ing.group,
          })) || [],
        instructions:
          (rawRecipe.instructions || rawRecipe.steps)?.map((step: any) => ({
            id: step.id,
            order: step.order,
            description: step.description,
            durationSec: step.durationSec,
          })) || [],
        categories:
          rawRecipe.categories?.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
          })) || [],
        reviews: rawRecipe.reviews || [],
        favorites: rawRecipe.favorites || [],
        views: rawRecipe.views || [],
      }

      return mappedRecipe
    } catch {
      // Dados mockados para fallback
      return {
        id: id.toString(),
        title: 'Pudim de Leite Condensado',
        description: 'Pudim cremoso e delicioso, perfeito para sobremesa',
        authorId: '1',
        author: {
          id: '1',
          email: 'joao@email.com',
          name: 'João Silva',
          photoUrl: 'https://via.placeholder.com/40',
          role: 'USER' as const,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
        difficulty: 'MEDIUM' as const,
        prepTime: 75,
        servings: 8,
        image: 'https://via.placeholder.com/400x300',
        status: 'PUBLISHED' as const,
        publishedAt: new Date('2024-01-15T10:00:00Z'),
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
        averageRating: 4.5,
        totalReviews: 23,
        totalFavorites: 45,
        totalViews: 156,
        photos: [],
        ingredients: [
          {
            id: '1',
            name: 'Leite condensado',
            amount: 1,
            unit: 'lata',
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
          },
        ],
        instructions: [
          {
            id: '1',
            order: 1,
            description:
              'Em uma panela, derreta o açúcar até ficar dourado para fazer a calda',
            durationSec: 600,
          },
          {
            id: '2',
            order: 2,
            description: 'Despeje a calda em uma forma de pudim e reserve',
            durationSec: 300,
          },
          {
            id: '3',
            order: 3,
            description: 'No liquidificador, bata o leite condensado, leite e os ovos',
            durationSec: 180,
          },
          {
            id: '4',
            order: 4,
            description: 'Despeje a mistura na forma com calda',
            durationSec: 120,
          },
          {
            id: '5',
            order: 5,
            description: 'Leve ao forno em banho-maria por 1 hora',
            durationSec: 3600,
          },
        ],
        categories: [
          {
            id: '1',
            name: 'Sobremesas',
          },
        ],
        reviews: [
          {
            id: '1',
            user: {
              id: '2',
              email: 'maria@email.com',
              name: 'Maria Santos',
              photoUrl: 'https://via.placeholder.com/32',
              role: 'USER' as const,
              createdAt: new Date('2024-01-01T00:00:00Z'),
              updatedAt: new Date('2024-01-01T00:00:00Z'),
            },
            rating: 5,
            comment: 'Ficou perfeito! Muito cremoso e saboroso.',
            createdAt: new Date('2024-01-20T14:30:00Z'),
            updatedAt: new Date('2024-01-20T14:30:00Z'),
          },
          {
            id: '2',
            user: {
              id: '3',
              email: 'pedro@email.com',
              name: 'Pedro Oliveira',
              photoUrl: 'https://via.placeholder.com/32',
              role: 'USER' as const,
              createdAt: new Date('2024-01-01T00:00:00Z'),
              updatedAt: new Date('2024-01-01T00:00:00Z'),
            },
            rating: 4,
            comment: 'Receita fácil e deliciosa. Recomendo!',
            createdAt: new Date('2024-01-18T09:15:00Z'),
            updatedAt: new Date('2024-01-18T09:15:00Z'),
          },
        ],
        favorites: [],
        views: [],
      }
    }
  },

  // Criar nova receita
  create: async (recipe: CreateRecipeRequest): Promise<{ recipe: Recipe }> => {
    // Mapear images para photos (backend espera objetos com url e order)
    const { images, ...restRecipe } = recipe
    const photos = (images || []).map((url, index) => ({
      url,
      order: index,
    }))

    const publishedData = {
      ...restRecipe,
      photos, // Converter strings em objetos { url, order }
      status: 'PUBLISHED' as const,
    }
    console.log('🚀 [RECIPES-SERVICE] Criando receita PUBLICADA:', {
      ...publishedData,
      status: 'PUBLISHED',
    })
    return post<{ recipe: Recipe }>(API_CONFIG.ENDPOINTS.RECIPES.CREATE, publishedData)
  },

  // Criar nova receita como rascunho
  createDraft: async (recipe: CreateRecipeRequest): Promise<{ recipe: Recipe }> => {
    // Mapear images para photos (backend espera objetos com url e order)
    const { images, ...restRecipe } = recipe
    const photos = (images || []).map((url, index) => ({
      url,
      order: index,
    }))

    const draftData = {
      ...restRecipe,
      photos, // Converter strings em objetos { url, order }
      status: 'DRAFT' as const,
    }
    console.log('📝 [RECIPES-SERVICE] Criando receita RASCUNHO:', {
      ...draftData,
      status: 'DRAFT',
    })
    return post<{ recipe: Recipe }>(API_CONFIG.ENDPOINTS.RECIPES.CREATE, draftData)
  },

  // Atualizar receita
  update: async (id: string | number, recipe: Partial<Recipe>): Promise<Recipe> => {
    const url = API_CONFIG.ENDPOINTS.RECIPES.UPDATE.replace(':id', id.toString())

    // Se a receita tiver images, mapear para photos com objetos { url, order }
    const { images, ...restRecipe } = recipe as any
    const updateData =
      images !== undefined
        ? {
            ...restRecipe,
            photos: images.map((url: string, index: number) => ({
              url,
              order: index,
            })),
          }
        : recipe

    return put<Recipe>(url, updateData)
  },

  // Deletar receita
  delete: async (id: string | number): Promise<ApiResponse<null>> => {
    const url = API_CONFIG.ENDPOINTS.RECIPES.DELETE.replace(':id', id.toString())
    return del<ApiResponse<null>>(url)
  },

  // Buscar receitas favoritas
  getFavorites: async (): Promise<Recipe[]> => {
    try {
      const result = await get<any>(API_CONFIG.ENDPOINTS.RECIPES.FAVORITES)

      // O backend retorna { favorites: [{ recipe: Recipe, ... }] }
      if (result.favorites && Array.isArray(result.favorites)) {
        const rawRecipes = result.favorites.map((fav: any) => fav.recipe).filter(Boolean)

        // Mapear os dados para o formato esperado
        const recipes = rawRecipes.map((rawRecipe: any) => {
          // Calcular averageRating baseado nas reviews se não vier da API
          const calculateAverageRating = (reviews: any[]) => {
            if (!reviews || reviews.length === 0) return 0
            const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
            return sum / reviews.length
          }

          const calculatedAverageRating = calculateAverageRating(rawRecipe.reviews)

          // Mapear os dados da API para o formato esperado
          const mappedRecipe: Recipe = {
            id: rawRecipe.id,
            title: rawRecipe.title,
            description: rawRecipe.description,
            authorId: rawRecipe.authorId,
            author: rawRecipe.author,
            difficulty: rawRecipe.difficulty,
            prepTime: rawRecipe.prepTime,
            servings: rawRecipe.servings,
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
            averageRating: calculatedAverageRating,
            totalReviews: rawRecipe.reviews?.length || 0,
            totalFavorites: rawRecipe._count?.favorites || 0,
            totalViews: rawRecipe._count?.views || 0,
            image: rawRecipe.photos?.[0]?.url || 'https://via.placeholder.com/400x300',
            photos: rawRecipe.photos || [],
            ingredients:
              rawRecipe.ingredients?.map((ing: any) => ({
                id: ing.ingredientId,
                name: ing.ingredient?.name || ing.name,
                amount: ing.amount,
                unit: ing.unit,
              })) || [],
            instructions:
              rawRecipe.steps?.map((step: any) => ({
                id: step.id,
                order: step.order,
                description: step.description,
                durationSec: step.durationSec,
              })) || [],
            categories:
              rawRecipe.categories?.map((cat: any) => ({
                id: cat.categoryId,
                name: cat.category?.name || cat.name,
              })) || [],
            reviews: rawRecipe.reviews || [],
            favorites: [],
            views: [],
          }

          return mappedRecipe
        })

        return recipes
      }

      // Fallback para formato antigo
      return result.recipes || result.data || []
    } catch (error) {
      console.error('❌ [RECIPES] Erro ao buscar favoritos:', error)
      return []
    }
  },

  // Adicionar favorito
  addFavorite: async (recipeId: number | string): Promise<ApiResponse<boolean>> => {
    const url = API_CONFIG.ENDPOINTS.RECIPES.FAVORITES
    try {
      const result = await post<ApiResponse<boolean>>(url, { recipeId })
      return result
    } catch (error) {
      console.error('❌ [RECIPES] Erro ao adicionar favorito:', error)
      throw error
    }
  },

  // Remover favorito
  removeFavorite: async (recipeId: number | string): Promise<ApiResponse<boolean>> => {
    const url = `${API_CONFIG.ENDPOINTS.RECIPES.FAVORITES}/${recipeId}`
    try {
      const result = await del<ApiResponse<boolean>>(url)
      return result
    } catch (error) {
      console.error('❌ [RECIPES] Erro ao remover favorito:', error)
      throw error
    }
  },

  // Adicionar/remover favorito (toggle)
  toggleFavorite: async (
    recipeId: number | string,
    isCurrentlyFavorite: boolean,
  ): Promise<ApiResponse<boolean>> => {
    if (isCurrentlyFavorite) {
      return recipesService.removeFavorite(recipeId)
    } else {
      return recipesService.addFavorite(recipeId)
    }
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

  // Buscar receitas do usuário
  getUserRecipes: async (): Promise<Recipe[]> => {
    try {
      console.log(
        '📥 getUserRecipes - Fazendo requisição para:',
        API_CONFIG.ENDPOINTS.RECIPES.USER_RECIPES,
      )
      const result = await get<any>(API_CONFIG.ENDPOINTS.RECIPES.USER_RECIPES)
      console.log('📥 getUserRecipes - Resposta bruta:', result)

      // Mapear os dados para o formato esperado
      const recipes =
        result.recipes?.map((rawRecipe: any) => {
          console.log('📥 getUserRecipes - Mapeando receita:', {
            id: rawRecipe.id,
            title: rawRecipe.title,
            status: rawRecipe.status,
          })

          // Calcular averageRating baseado nas reviews se não vier da API
          const calculateAverageRating = (reviews: any[]) => {
            if (!reviews || reviews.length === 0) return 0
            const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
            return sum / reviews.length
          }

          const calculatedAverageRating = calculateAverageRating(rawRecipe.reviews)

          // Mapear os dados da API para o formato esperado
          const mappedRecipe: Recipe = {
            id: rawRecipe.id,
            title: rawRecipe.title,
            description: rawRecipe.description,
            authorId: rawRecipe.authorId,
            author: rawRecipe.author,
            difficulty: rawRecipe.difficulty,
            prepTime: rawRecipe.prepTime,
            servings: rawRecipe.servings,
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
            averageRating: calculatedAverageRating,
            totalReviews: rawRecipe.reviews?.length || 0,
            totalFavorites: rawRecipe._count?.favorites || 0,
            totalViews: rawRecipe._count?.views || 0,
            image: rawRecipe.photos?.[0]?.url || 'https://via.placeholder.com/400x300',
            photos: rawRecipe.photos || [],
            ingredients:
              rawRecipe.ingredients?.map((ing: any) => ({
                id: ing.ingredientId,
                name: ing.ingredient?.name || ing.name,
                amount: ing.amount,
                unit: ing.unit,
              })) || [],
            instructions:
              rawRecipe.steps?.map((step: any) => ({
                id: step.id,
                order: step.order,
                description: step.description,
                durationSec: step.durationSec,
              })) || [],
            categories:
              rawRecipe.categories?.map((cat: any) => ({
                id: cat.categoryId,
                name: cat.category?.name || cat.name,
              })) || [],
            reviews: rawRecipe.reviews || [],
            favorites: [],
            views: [],
          }

          return mappedRecipe
        }) || []

      console.log('📥 getUserRecipes - Receitas mapeadas:', recipes.length)
      console.log(
        '📥 getUserRecipes - Status final das receitas:',
        recipes.map((r: Recipe) => ({ id: r.id, title: r.title, status: r.status })),
      )
      return recipes
    } catch (error) {
      console.error('❌ Erro ao buscar receitas do usuário:', error)
      return []
    }
  },

  // Publicar rascunho
  publishDraft: async (recipeId: string): Promise<ApiResponse<Recipe>> => {
    const url = `${API_CONFIG.ENDPOINTS.RECIPES.PUBLISH.replace(':id', recipeId)}`
    console.log('🔧 publishDraft - URL:', url)
    console.log('🔧 publishDraft - RecipeId:', recipeId)
    console.log('🔧 publishDraft - Payload:', {})

    try {
      const result = await put<ApiResponse<Recipe>>(url, {})
      console.log('✅ publishDraft - Sucesso:', result)
      return result
    } catch (error) {
      console.error('❌ publishDraft - Erro:', error)
      console.error('❌ publishDraft - Tipo do erro:', typeof error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        console.error('❌ publishDraft - Status:', axiosError.response?.status)
        console.error('❌ publishDraft - Data:', axiosError.response?.data)
        console.error('❌ publishDraft - Headers:', axiosError.response?.headers)
        console.error('❌ publishDraft - Config:', axiosError.config)
      }

      throw error
    }
  },
}
