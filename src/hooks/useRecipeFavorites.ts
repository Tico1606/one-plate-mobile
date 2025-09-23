import { useCallback, useEffect, useState } from 'react'
import { recipesService } from '@/services/recipes'
import type { Recipe } from '@/types/api'

// Hook para gerenciar favoritos com otimização
export function useRecipeFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar favoritos iniciais
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const recipes = await recipesService.getFavorites()
      const favoriteIds = new Set(recipes.map((recipe) => recipe.id))

      setFavorites(favoriteIds)
      setFavoriteRecipes(recipes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar favoritos')
    } finally {
      setLoading(false)
    }
  }, [])

  // Alternar favorito com otimização local
  const toggleFavorite = useCallback(
    async (recipe: Recipe) => {
      const isCurrentlyFavorite = favorites.has(recipe.id)

      // Otimização: atualizar estado local imediatamente
      setFavorites((prev) => {
        const newFavorites = new Set(prev)
        if (isCurrentlyFavorite) {
          newFavorites.delete(recipe.id)
        } else {
          newFavorites.add(recipe.id)
        }
        return newFavorites
      })

      // Atualizar lista de receitas favoritas
      setFavoriteRecipes((prev) => {
        if (isCurrentlyFavorite) {
          return prev.filter((fav) => fav.id !== recipe.id)
        } else {
          return [...prev, recipe]
        }
      })

      try {
        // Fazer requisição para o backend
        await recipesService.toggleFavorite(recipe.id)
      } catch (err) {
        // Em caso de erro, reverter mudanças locais
        setFavorites((prev) => {
          const newFavorites = new Set(prev)
          if (isCurrentlyFavorite) {
            newFavorites.add(recipe.id)
          } else {
            newFavorites.delete(recipe.id)
          }
          return newFavorites
        })

        setFavoriteRecipes((prev) => {
          if (isCurrentlyFavorite) {
            return [...prev, recipe]
          } else {
            return prev.filter((fav) => fav.id !== recipe.id)
          }
        })

        setError(err instanceof Error ? err.message : 'Erro ao alterar favorito')
      }
    },
    [favorites],
  )

  // Verificar se uma receita é favorita
  const isFavorite = useCallback(
    (recipeId: number) => favorites.has(recipeId),
    [favorites],
  )

  // Adicionar receita aos favoritos
  const addToFavorites = useCallback(
    async (recipe: Recipe) => {
      if (!favorites.has(recipe.id)) {
        await toggleFavorite(recipe)
      }
    },
    [favorites, toggleFavorite],
  )

  // Remover receita dos favoritos
  const removeFromFavorites = useCallback(
    async (recipe: Recipe) => {
      if (favorites.has(recipe.id)) {
        await toggleFavorite(recipe)
      }
    },
    [favorites, toggleFavorite],
  )

  // Limpar todos os favoritos
  const clearFavorites = useCallback(() => {
    setFavorites(new Set())
    setFavoriteRecipes([])
  }, [])

  // Buscar favoritos novamente
  const refetch = useCallback(async () => {
    await fetchFavorites()
  }, [fetchFavorites])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return {
    favorites: Array.from(favorites),
    favoriteRecipes,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    refetch,
  }
}

// Hook para gerenciar favoritos de uma receita específica
export function useRecipeFavorite(recipe: Recipe) {
  const { isFavorite, toggleFavorite } = useRecipeFavorites()

  const isRecipeFavorite = isFavorite(recipe.id)

  const handleToggle = useCallback(() => {
    toggleFavorite(recipe)
  }, [recipe, toggleFavorite])

  return {
    isFavorite: isRecipeFavorite,
    toggle: handleToggle,
  }
}
