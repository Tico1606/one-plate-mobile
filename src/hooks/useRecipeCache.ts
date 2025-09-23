import { useCallback, useEffect, useState } from 'react'
import { recipesService } from '@/services/recipes'
import type { Recipe, RecipeFilters } from '@/types/api'

// Cache simples em memória
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Função para gerar chave de cache
const getCacheKey = (endpoint: string, params?: any) => {
  return `${endpoint}:${JSON.stringify(params || {})}`
}

// Função para verificar se o cache é válido
const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION
}

// Hook para gerenciar cache de receitas
export function useRecipeCache() {
  const [cacheStatus, setCacheStatus] = useState<Map<string, boolean>>(new Map())

  // Função para invalidar cache
  const invalidateCache = useCallback((pattern?: string) => {
    if (pattern) {
      // Invalidar cache específico
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key)
        }
      }
    } else {
      // Limpar todo o cache
      cache.clear()
    }
    setCacheStatus(new Map())
  }, [])

  // Função para buscar dados com cache
  const getCachedData = useCallback(
    async <T>(endpoint: string, fetcher: () => Promise<T>, params?: any): Promise<T> => {
      const key = getCacheKey(endpoint, params)
      const cached = cache.get(key)

      // Se existe cache válido, retornar
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.data
      }

      // Buscar dados
      const data = await fetcher()

      // Salvar no cache
      cache.set(key, {
        data,
        timestamp: Date.now(),
      })

      return data
    },
    [],
  )

  // Função para pré-carregar dados
  const preloadData = useCallback(
    async (endpoint: string, fetcher: () => Promise<any>, params?: any) => {
      const key = getCacheKey(endpoint, params)

      if (!cache.has(key)) {
        try {
          const data = await fetcher()
          cache.set(key, {
            data,
            timestamp: Date.now(),
          })
        } catch (error) {
          console.warn('Erro ao pré-carregar dados:', error)
        }
      }
    },
    [],
  )

  return {
    invalidateCache,
    getCachedData,
    preloadData,
    cacheStatus,
  }
}

// Hook para receitas com cache otimizado
export function useCachedRecipes(filters?: RecipeFilters) {
  const { getCachedData, invalidateCache } = useRecipeCache()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getCachedData(
        'recipes',
        () => recipesService.getAll(filters),
        filters,
      )

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receitas')
    } finally {
      setLoading(false)
    }
  }, [filters, getCachedData])

  const refetch = useCallback(async () => {
    // Invalidar cache antes de buscar novamente
    invalidateCache('recipes')
    await fetchRecipes()
  }, [fetchRecipes, invalidateCache])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  return { data, loading, error, refetch }
}

// Hook para receita individual com cache
export function useCachedRecipe(id: number) {
  const { getCachedData, invalidateCache } = useRecipeCache()
  const [data, setData] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipe = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const result = await getCachedData(
        `recipe-${id}`,
        () => recipesService.getById(id),
        { id },
      )

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receita')
    } finally {
      setLoading(false)
    }
  }, [id, getCachedData])

  const refetch = useCallback(async () => {
    invalidateCache(`recipe-${id}`)
    await fetchRecipe()
  }, [fetchRecipe, invalidateCache, id])

  useEffect(() => {
    fetchRecipe()
  }, [fetchRecipe])

  return { data, loading, error, refetch }
}

// Hook para pré-carregar receitas relacionadas
export function useRecipePreloader() {
  const { preloadData } = useRecipeCache()

  const preloadRelatedRecipes = useCallback(
    async (recipe: Recipe) => {
      // Pré-carregar receitas da mesma categoria
      if (recipe.categoryId) {
        preloadData(
          'recipes-by-category',
          () => recipesService.getByCategory(recipe.categoryId),
          { categoryId: recipe.categoryId },
        )
      }

      // Pré-carregar receitas populares
      preloadData('popular-recipes', () => recipesService.getPopular(5), { limit: 5 })

      // Pré-carregar receitas recentes
      preloadData('recent-recipes', () => recipesService.getRecent(5), { limit: 5 })
    },
    [preloadData],
  )

  return { preloadRelatedRecipes }
}
