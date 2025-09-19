import { useCallback, useEffect, useState } from 'react'
import { recipesService } from '@/services/recipes'
import type { PaginatedResponse, Recipe, RecipeFilters } from '@/types/api'

// Hook para buscar receitas com filtros
export function useRecipes(filters?: RecipeFilters) {
  const [data, setData] = useState<PaginatedResponse<Recipe> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await recipesService.getAll(filters)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receitas')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  return { data, loading, error, refetch: fetchRecipes }
}

// Hook para buscar receita por ID
export function useRecipe(id: number) {
  const [data, setData] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipe = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await recipesService.getById(id)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receita')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchRecipe()
    }
  }, [id, fetchRecipe])

  return { data, loading, error, refetch: fetchRecipe }
}

// Hook para receitas populares
export function usePopularRecipes(limit: number = 10) {
  const [data, setData] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPopular = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await recipesService.getPopular(limit)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar receitas populares')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchPopular()
  }, [fetchPopular])

  return { data, loading, error, refetch: fetchPopular }
}

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

// Hook para favoritos
export function useFavorites() {
  const [data, setData] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await recipesService.getFavorites()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar favoritos')
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleFavorite = useCallback(
    async (recipeId: number) => {
      try {
        await recipesService.toggleFavorite(recipeId)
        // Atualizar a lista de favoritos
        await fetchFavorites()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao alterar favorito')
      }
    },
    [fetchFavorites],
  )

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return { data, loading, error, refetch: fetchFavorites, toggleFavorite }
}
