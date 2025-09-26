import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  useInfiniteRecipes,
  useRecentRecipes,
  useRecipeFavorites,
  useRecipeSearch,
} from '@/hooks'
import { useCategories } from '@/hooks/useCategories'
import type { Category, Recipe } from '@/types/api'

export function useHomePage() {
  // Router para navegação
  const router = useRouter()

  // Estados locais
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Hooks para buscar dados
  const {
    data: categories,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories()
  const {
    data: recentRecipes,
    loading: recentLoading,
    refetch: refetchRecent,
  } = useRecentRecipes(4)
  // const {
  //   data: popularRecipes,
  //   loading: popularLoading,
  //   error: popularError,
  //   refetch: refetchPopular,
  // } = usePopularRecipes(5)

  // Hook para busca com debounce
  const { data: searchResults, loading: searchLoading } = useRecipeSearch(searchQuery)

  // Hook para paginação infinita (usado quando há filtros)
  const {
    data: infiniteRecipes,
    loadingMore,
    hasNextPage,
    loadMore,
  } = useInfiniteRecipes(selectedCategory ? { category: selectedCategory.id } : undefined)

  // Hook para gerenciar favoritos
  const {
    isFavorite,
    toggleFavorite,
    favoriteRecipes,
    loading: favoritesLoading,
  } = useRecipeFavorites()

  // Determinar quais receitas mostrar
  const getDisplayRecipes = () => {
    if (searchQuery.trim()) {
      return Array.isArray(searchResults) ? searchResults : []
    }

    if (selectedCategory) {
      return Array.isArray(infiniteRecipes) ? infiniteRecipes : []
    }

    return Array.isArray(recentRecipes) ? recentRecipes : []
  }

  // Usar dados da API com verificação de segurança
  const browseCategories = Array.isArray(categories) ? categories : []
  const recipes = getDisplayRecipes()

  // Estados de loading
  const isLoading =
    categoriesLoading || recentLoading || (searchQuery ? searchLoading : false)
  const isLoadingMore = loadingMore

  // Função para tentar novamente
  const handleRetry = useCallback(() => {
    refetchCategories()
    refetchRecent()
  }, [refetchCategories, refetchRecent])

  // Handlers para eventos
  const handleSearchPress = useCallback(() => {
    // TODO: Implementar navegação para tela de busca
  }, [])

  const handleFilterPress = useCallback(() => {
    // TODO: Implementar filtros
  }, [])

  const handleNotificationPress = useCallback(() => {
    // TODO: Implementar notificações
  }, [])

  const handleCategoryPress = useCallback((category: Category) => {
    setSelectedCategory(category)
    setSearchQuery('') // Limpar busca quando selecionar categoria
  }, [])

  const handleRecipePress = useCallback(
    (recipe: Recipe) => {
      router.push(`/(auth)/recipe-[id]?id=${recipe.id}`)
    },
    [router],
  )

  const handleViewAllRecipes = useCallback(() => {
    // TODO: Implementar navegação para todas as receitas
  }, [])

  const handleRecipeLike = useCallback(
    (recipe: Recipe) => {
      toggleFavorite(recipe)
    },
    [toggleFavorite],
  )

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setSelectedCategory(null) // Limpar categoria quando buscar
    }
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory(null)
  }, [])

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      loadMore()
    }
  }, [hasNextPage, isLoadingMore, loadMore])

  const handleDebugPress = useCallback(() => {
    // TODO: Implementar navegação para tela de debug
  }, [])

  return {
    // Dados
    browseCategories,
    recipes,
    popularRecipes: [],
    favoriteRecipes: Array.isArray(favoriteRecipes) ? favoriteRecipes : [],
    searchQuery,
    selectedCategory,

    // Estados de loading
    isLoading,
    isLoadingMore,
    searchLoading,
    favoritesLoading,

    // Estados de paginação
    hasNextPage,

    // Handlers
    onRetry: handleRetry,
    onSearchPress: handleSearchPress,
    onFilterPress: handleFilterPress,
    onNotificationPress: handleNotificationPress,
    onCategoryPress: handleCategoryPress,
    onRecipePress: handleRecipePress,
    onViewAllRecipes: handleViewAllRecipes,
    onRecipeLike: handleRecipeLike,
    onSearchChange: handleSearchChange,
    onClearFilters: handleClearFilters,
    onLoadMore: handleLoadMore,
    onDebugPress: handleDebugPress,

    // Utilitários
    isFavorite,
  }
}
