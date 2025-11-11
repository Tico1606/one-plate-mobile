import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { useLocale } from '@/contexts'
import { recipesService } from '@/services/recipes'
import type { Recipe } from '@/types/api'

export function useManageRecipesPage() {
  const router = useRouter()
  const { updated } = useLocalSearchParams<{ updated?: string }>()
  const { t } = useLocale()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filterRecipes = useCallback((query: string, recipesList: Recipe[]) => {
    if (!query.trim()) {
      return recipesList
    }

    const lowerQuery = query.toLowerCase()
    return recipesList.filter((recipe) => {
      const matchesTitle = recipe.title.toLowerCase().includes(lowerQuery)
      const matchesIngredients = recipe.ingredients.some((ingredient) =>
        ingredient.name.toLowerCase().includes(lowerQuery),
      )
      const matchesAuthor =
        recipe.author?.name?.toLowerCase().includes(lowerQuery) ?? false

      return matchesTitle || matchesIngredients || matchesAuthor
    })
  }, [])

  useEffect(() => {
    const filtered = filterRecipes(searchQuery, recipes)
    setFilteredRecipes(filtered)
  }, [searchQuery, recipes, filterRecipes])

  const loadPublishedRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await recipesService.getAll({
        status: 'PUBLISHED',
        limit: 100,
      })
      setRecipes(response.data ?? [])
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('manage_recipes.error_loading')
      setError(errorMessage)
      console.error('Erro ao carregar receitas publicadas:', err)
    } finally {
      setLoading(false)
    }
  }, [t])

  const publishRecipe = useCallback((_recipe: Recipe) => {
    // Admins só visualizam receitas publicadas aqui.
  }, [])

  const deleteRecipe = useCallback((recipe: Recipe) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir a receita "${recipe.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await recipesService.delete(recipe.id)
              setRecipes((prev) => prev.filter((r) => r.id !== recipe.id))
              Alert.alert('Sucesso', 'Receita excluída com sucesso!')
            } catch (err) {
              console.error('Erro ao excluir receita:', err)
              Alert.alert('Erro', 'Não foi possível excluir a receita')
            }
          },
        },
      ],
    )
  }, [])

  const editRecipe = useCallback(
    (recipe: Recipe) => {
      router.push(`/(auth)/edit-recipe?id=${recipe.id}&returnTo=manage`)
    },
    [router],
  )

  const goBack = useCallback(() => {
    router.back()
  }, [router])

  const refreshRecipes = useCallback(() => {
    loadPublishedRecipes()
  }, [loadPublishedRecipes])

  useEffect(() => {
    loadPublishedRecipes()
  }, [loadPublishedRecipes])

  useEffect(() => {
    if (updated === 'true') {
      loadPublishedRecipes()
      router.replace('/(auth)/manage-recipes')
    }
  }, [updated, loadPublishedRecipes, router])

  return {
    recipes: filteredRecipes,
    allRecipes: recipes,
    loading,
    error,
    searchQuery,
    publishRecipe,
    deleteRecipe,
    editRecipe,
    goBack,
    refreshRecipes,
    setSearchQuery,
    title: t('manage_recipes.title'),
    searchPlaceholder: t('manage_recipes.search_placeholder'),
    emptyStateNoResultsTitle: t('manage_recipes.empty_no_results_title'),
    emptyStateNoResultsSubtitle: t('manage_recipes.empty_no_results_subtitle'),
    emptyStateNoDataTitle: t('manage_recipes.empty_no_data_title'),
    emptyStateNoDataSubtitle: t('manage_recipes.empty_no_data_subtitle'),
    showAuthorName: true,
  }
}
