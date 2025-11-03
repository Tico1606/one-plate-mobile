import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { recipesService } from '@/services/recipes'
import type { Recipe } from '@/types/api'

export function useMyRecipesPage() {
  const router = useRouter()
  const { updated } = useLocalSearchParams<{ updated?: string }>()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtrar receitas por nome e ingredientes
  const filterRecipes = useCallback((query: string, recipesList: Recipe[]) => {
    if (!query.trim()) {
      return recipesList
    }

    const lowerQuery = query.toLowerCase()
    return recipesList.filter((recipe) => {
      // Buscar por nome da receita
      const matchesTitle = recipe.title.toLowerCase().includes(lowerQuery)

      // Buscar por ingredientes
      const matchesIngredients = recipe.ingredients.some((ingredient) =>
        ingredient.name.toLowerCase().includes(lowerQuery),
      )

      return matchesTitle || matchesIngredients
    })
  }, [])

  // Atualizar receitas filtradas quando a busca ou receitas mudarem
  useEffect(() => {
    const filtered = filterRecipes(searchQuery, recipes)
    setFilteredRecipes(filtered)
  }, [searchQuery, recipes, filterRecipes])

  // Carregar receitas do usuário
  const loadUserRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📥 Carregando receitas do usuário...')
      const userRecipes = await recipesService.getUserRecipes()
      console.log('📥 Receitas carregadas:', userRecipes.length)
      console.log(
        '📥 Status das receitas:',
        userRecipes.map((r) => ({ id: r.id, title: r.title, status: r.status })),
      )
      setRecipes(userRecipes)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar receitas'
      setError(errorMessage)
      console.error('Erro ao carregar receitas do usuário:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Publicar rascunho
  const publishRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        console.log('🚀 Iniciando publicação da receita:', recipe.id)
        console.log('📝 Dados da receita:', {
          id: recipe.id,
          title: recipe.title,
          status: recipe.status,
        })

        const result = await recipesService.publishDraft(recipe.id)
        console.log('✅ Resultado da publicação:', result)

        // Atualizar o status localmente
        setRecipes((prev) =>
          prev.map((r) =>
            r.id === recipe.id
              ? { ...r, status: 'PUBLISHED' as const, publishedAt: new Date() }
              : r,
          ),
        )

        // Aguardar um pouco e recarregar do backend para confirmar
        setTimeout(async () => {
          console.log('🔄 Recarregando receitas do backend para confirmar mudança...')
          await loadUserRecipes()
        }, 1000)

        Alert.alert('Sucesso', 'Receita publicada com sucesso!')
      } catch (err) {
        console.error('❌ Erro detalhado ao publicar receita:', err)
        console.error('❌ Tipo do erro:', typeof err)
        console.error('❌ Erro instanceof Error:', err instanceof Error)

        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as any
          console.error('❌ Status da resposta:', axiosError.response?.status)
          console.error('❌ Dados da resposta:', axiosError.response?.data)
          console.error('❌ Headers da resposta:', axiosError.response?.headers)
          console.error('❌ Config da requisição:', axiosError.config)
        }

        Alert.alert('Erro', 'Não foi possível publicar a receita')
      }
    },
    [loadUserRecipes],
  )

  // Excluir receita
  const deleteRecipe = useCallback(async (recipe: Recipe) => {
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
              await recipesService.delete(parseInt(recipe.id))

              // Remover da lista localmente
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

  // Editar receita
  const editRecipe = useCallback(
    (recipe: Recipe) => {
      router.push(`/(auth)/edit-recipe?id=${recipe.id}`)
    },
    [router],
  )

  // Voltar para o perfil
  const goBack = useCallback(() => {
    router.replace('/profile')
  }, [router])

  // Recarregar receitas
  const refreshRecipes = useCallback(() => {
    loadUserRecipes()
  }, [loadUserRecipes])

  useEffect(() => {
    loadUserRecipes()
  }, [loadUserRecipes])

  // Recarregar quando voltar da edição
  useEffect(() => {
    if (updated === 'true') {
      console.log('🔄 MyRecipes - Recarregando após edição')
      loadUserRecipes()
      // Limpar o parâmetro da URL para evitar recarregamentos desnecessários
      router.replace('/(auth)/my-recipes')
    }
  }, [updated, loadUserRecipes, router])

  return {
    // Estados
    recipes: filteredRecipes,
    allRecipes: recipes,
    loading,
    error,
    searchQuery,

    // Handlers
    publishRecipe,
    deleteRecipe,
    editRecipe,
    goBack,
    refreshRecipes,
    setSearchQuery,
  }
}
