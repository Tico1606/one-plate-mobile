import { useCallback, useEffect, useMemo, useState } from 'react'
import { recipesService } from '@/services/recipes'
import type { PaginatedResponse, Recipe, RecipeFilters } from '@/types/api'

// Hook para buscar receitas com filtros
export function useRecipes(filters?: RecipeFilters) {
  const [data, setData] = useState<PaginatedResponse<Recipe> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoizar os filtros para evitar re-renders desnecessários
  const memoizedFilters = useMemo(
    () => filters,
    [
      filters?.page,
      filters?.limit,
      filters?.search,
      filters?.category,
      filters?.sortBy,
      filters?.sortOrder,
      filters?.difficulty,
      filters?.prepTime,
      filters?.maxCalories,
      filters?.minProtein,
      filters?.minRating,
      filters?.minFavorites,
      filters?.authorId,
      filters?.status,
      filters?.featured,
      filters,
    ],
  )

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await recipesService.getAll(memoizedFilters)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receitas')
    } finally {
      setLoading(false)
    }
  }, [memoizedFilters])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  return { data, loading, error, refetch: fetchRecipes }
}

// Hook para buscar receita por ID
export function useRecipe(id: string | number) {
  const [data, setData] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    // Verificar se o ID é válido (pode ser string ou número)
    if (typeof id === 'string' && id.trim() === '') {
      setError('ID da receita inválido')
      setLoading(false)
      return
    }

    const fetchRecipe = async () => {
      try {
        setLoading(true)
        setError(null)

        // Converter para número apenas se for um número válido
        const numericId =
          typeof id === 'string' && !Number.isNaN(Number(id)) ? Number(id) : id
        const result = await recipesService.getById(numericId)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar receita')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  return { data, loading, error, refetch: () => {} }
}

// Hook para receitas populares (comentado - método não disponível)
// export function usePopularRecipes(limit: number = 10) {
//   const [data, setData] = useState<Recipe[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchPopular = useCallback(async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const result = await recipesService.getPopular(limit)
//       setData(result)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Erro ao buscar receitas populares')
//     } finally {
//       setLoading(false)
//     }
//   }, [limit])

//   useEffect(() => {
//     fetchPopular()
//   }, [fetchPopular])

//   return { data, loading, error, refetch: fetchPopular }
// }

// Hook para receitas recentes
export function useRecentRecipes(limit: number = 10) {
  const [data, setData] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecent = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await recipesService.getRecent(limit)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receitas recentes')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchRecent()
  }, [fetchRecent])

  return { data, loading, error, refetch: fetchRecent }
}

// Hook para favoritos (comentado - método não disponível)
// export function useFavorites() {
//   const [data, setData] = useState<Recipe[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchFavorites = useCallback(async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const result = await recipesService.getFavorites()
//       setData(result)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Erro ao buscar favoritos')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const toggleFavorite = useCallback(
//     async (recipeId: number) => {
//       try {
//         await recipesService.toggleFavorite(recipeId)
//         // Atualizar a lista de favoritos
//         await fetchFavorites()
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Erro ao alterar favorito')
//       }
//     },
//     [fetchFavorites],
//   )

//   useEffect(() => {
//     fetchFavorites()
//   }, [fetchFavorites])

//   return { data, loading, error, refetch: fetchFavorites, toggleFavorite }
// }

// Hook para busca de receitas com debounce
export function useRecipeSearch(query: string, delay: number = 500) {
  const [data, setData] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchRecipes = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setData([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await recipesService.getAll({ search: searchQuery, limit: 20 })
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receitas')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce da busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRecipes(query)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [query, delay, searchRecipes])

  return { data, loading, error, refetch: () => searchRecipes(query) }
}

// Hook para paginação infinita de receitas
export function useInfiniteRecipes(filters?: Omit<RecipeFilters, 'page'>) {
  const [data, setData] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasNextPage) return

    try {
      setLoadingMore(true)
      setError(null)

      const result = await recipesService.getAll({
        ...filters,
        page: currentPage + 1,
        limit: 10,
      })

      setData((prev) => [...prev, ...result.data])
      setCurrentPage((prev) => prev + 1)
      setHasNextPage(result.pagination.page < result.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mais receitas')
    } finally {
      setLoadingMore(false)
    }
  }, [filters, currentPage, hasNextPage, loadingMore])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setCurrentPage(1)
      setHasNextPage(true)

      const result = await recipesService.getAll({
        ...filters,
        page: 1,
        limit: 10,
      })

      setData(result.data)
      setCurrentPage(1)
      setHasNextPage(result.pagination.page < result.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receitas')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    data,
    loading,
    loadingMore,
    error,
    hasNextPage,
    refetch,
    loadMore,
  }
}

// Hook para receitas por categoria com cache
export function useRecipesByCategory(
  categoryId: number,
  filters?: Omit<RecipeFilters, 'categoryId'>,
) {
  const [data, setData] = useState<PaginatedResponse<Recipe> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await recipesService.getByCategory(categoryId, filters)
      setData(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao buscar receitas da categoria',
      )
    } finally {
      setLoading(false)
    }
  }, [categoryId, filters])

  useEffect(() => {
    if (categoryId) {
      fetchRecipes()
    }
  }, [categoryId, fetchRecipes])

  return { data, loading, error, refetch: fetchRecipes }
}
