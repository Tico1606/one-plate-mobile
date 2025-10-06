import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { recipesService } from '@/services/recipes'
import type { Recipe } from '@/types/api'

interface FavoritesContextData {
  favorites: Set<string>
  favoriteRecipes: Recipe[]
  loading: boolean
  error: string | null
  isFavorite: (recipeId: string) => boolean
  toggleFavorite: (recipe: Recipe) => Promise<void>
  addToFavorites: (recipe: Recipe) => Promise<void>
  removeFromFavorites: (recipe: Recipe) => Promise<void>
  clearFavorites: () => void
  refetch: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextData | undefined>(undefined)

interface FavoritesProviderProps {
  children: React.ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar favoritos iniciais
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const recipes = await recipesService.getFavorites()
      const favoriteIds = new Set(recipes.map((recipe: Recipe) => recipe.id))

      setFavorites(favoriteIds)
      setFavoriteRecipes(recipes)
    } catch (err) {
      console.error('❌ [FAVORITES-CONTEXT] Erro ao buscar favoritos:', err)
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
        // Enviar o ID como string (formato do backend) com o estado atual
        await recipesService.toggleFavorite(recipe.id, isCurrentlyFavorite)
      } catch (err: any) {
        console.error('❌ [FAVORITES-CONTEXT] Erro ao alterar favorito no backend:', err)

        // Se for erro 409 (Conflict), significa que o estado local está desatualizado
        if (err?.response?.status === 409) {
          // Recarregar favoritos do backend para sincronizar
          await fetchFavorites()
          return
        }

        // Para outros erros, reverter mudanças locais
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
    [favorites, fetchFavorites],
  )

  // Verificar se uma receita é favorita
  const isFavorite = useCallback(
    (recipeId: string) => favorites.has(recipeId),
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
    // Aguardar um pouco para garantir que o token foi salvo
    const delayedCheck = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Aguardar 1 segundo
      await fetchFavorites()
    }

    delayedCheck()
  }, [fetchFavorites])

  const value: FavoritesContextData = {
    favorites,
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

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
