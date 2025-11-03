import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { useFavorites } from '@/contexts'
import { useRecipe } from '@/hooks'
import type { CreateReviewFormData } from '@/lib/validations/review'
import { reviewsService } from '@/services'

interface UseRecipeDetailProps {
  recipeId: string
}

export function useRecipeDetail({ recipeId }: UseRecipeDetailProps) {
  const router = useRouter()
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)

  // Hook para buscar dados da receita
  const { data: recipe, loading, error, refetch } = useRecipe(recipeId)

  // Hook para gerenciar favoritos
  const { isFavorite, toggleFavorite } = useFavorites()

  // Hook para obter usuário atual
  const { user } = useUser()

  // Verificar se o usuário já avaliou esta receita
  const hasUserReviewed = useMemo(() => {
    if (!recipe?.reviews || !user?.id) return false

    return recipe.reviews.some((review) => review.user.id === user.id)
  }, [recipe?.reviews, user?.id])

  // Handlers
  const handleLike = useCallback(async () => {
    // Prevenir múltiplos cliques
    if (isTogglingFavorite) return

    if (recipe) {
      try {
        setIsTogglingFavorite(true)
        await toggleFavorite(recipe)
      } finally {
        setIsTogglingFavorite(false)
      }
    }
  }, [recipe, toggleFavorite, isTogglingFavorite])

  const handleOpenReviewModal = useCallback(() => {
    // Não permitir abrir modal se usuário já avaliou
    if (hasUserReviewed) return
    setShowReviewModal(true)
  }, [hasUserReviewed])

  const handleCloseReviewModal = useCallback(() => {
    setShowReviewModal(false)
    setEditingReview(null)
  }, [])

  const handleEditReview = useCallback((review: any) => {
    setEditingReview(review)
    setShowReviewModal(true)
  }, [])

  const handleAddReview = useCallback(
    async (data: CreateReviewFormData) => {
      if (!recipe) return

      try {
        setIsAddingReview(true)

        if (editingReview) {
          // Editar avaliação existente
          await reviewsService.update(editingReview.id, {
            rating: data.rating,
            comment: data.comment,
          })
        } else {
          // Criar nova avaliação
          await reviewsService.create({
            recipeId,
            rating: data.rating,
            comment: data.comment,
          })
        }

        // Recarregar dados da receita para incluir as mudanças
        await refetch()

        // Fechar modal após sucesso
        setShowReviewModal(false)
        setEditingReview(null)
      } catch (err: any) {
        const message =
          err?.response?.data?.message || 'Erro ao enviar avaliação. Tente novamente.'
        console.log('Erro ao adicionar/editar review:', message)
        // Não fechar modal em caso de erro para permitir nova tentativa
      } finally {
        setIsAddingReview(false)
      }
    },
    [recipe, recipeId, refetch, editingReview],
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
    isTogglingFavorite,
    showReviewModal,
    isLiked: recipe ? isFavorite(recipe.id) : false,
    hasUserReviewed,
    editingReview,
    user,

    // Handlers
    onLike: handleLike,
    onOpenReviewModal: handleOpenReviewModal,
    onCloseReviewModal: handleCloseReviewModal,
    onAddReview: handleAddReview,
    onEditReview: handleEditReview,
    onToggleHelpful: handleToggleHelpful,
    onBack: handleBack,
    onRefetch: refetch,
  }
}
