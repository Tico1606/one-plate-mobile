import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { useFavorites } from '@/contexts'
import { useRecipe } from '@/hooks'

interface UseRecipeDetailProps {
  recipeId: string
}

export function useRecipeDetail({ recipeId }: UseRecipeDetailProps) {
  const router = useRouter()
  const [isAddingReview, setIsAddingReview] = useState(false)

  // Hook para buscar dados da receita
  const { data: recipe, loading, error, refetch } = useRecipe(recipeId)

  // Hook para gerenciar favoritos
  const { isFavorite, toggleFavorite } = useFavorites()

  // Handlers
  const handleLike = useCallback(() => {
    if (recipe) {
      toggleFavorite(recipe)
    }
  }, [recipe, toggleFavorite])

  const handleAddReview = useCallback(
    async (_rating: number, _comment: string) => {
      if (!recipe) return

      try {
        setIsAddingReview(true)
        // TODO: Implementar chamada para API de adicionar review

        // Simular delay da API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Recarregar dados da receita para incluir o novo review
        refetch()
      } catch (err) {
        console.error('Erro ao adicionar review:', err)
      } finally {
        setIsAddingReview(false)
      }
    },
    [recipe, refetch],
  )

  const handleToggleHelpful = useCallback(
    async (_reviewId: string) => {
      try {
        // TODO: Implementar chamada para API de marcar review como útil

        // Simular delay da API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Recarregar dados da receita para atualizar contadores
        refetch()
      } catch (err) {
        console.error('Erro ao marcar review como útil:', err)
      }
    },
    [refetch],
  )

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  return {
    // Dados
    recipe,
    isLoading: loading,
    error,

    // Estados
    isAddingReview,
    isLiked: recipe ? isFavorite(recipe.id) : false,

    // Handlers
    onLike: handleLike,
    onAddReview: handleAddReview,
    onToggleHelpful: handleToggleHelpful,
    onBack: handleBack,
    onRefetch: refetch,
  }
}
