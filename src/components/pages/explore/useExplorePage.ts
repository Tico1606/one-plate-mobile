import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecipeFavorites, useRecipes } from '@/hooks'
import { useCategories } from '@/hooks/useCategories'
import type { Category, Recipe, RecipeFilters } from '@/types/api'

export type SortOption = 'recent' | 'oldest' | 'most_favorites' | 'least_favorites'

export function useExplorePage() {
  // Router para navegação
  const router = useRouter()

  // Estados locais
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [totalPages, setTotalPages] = useState(1)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Hooks para buscar dados
  const {
    data: categories,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories()

  // Hook para busca com debounce (removido - usando filtros diretos)

  // Construir filtros para a API com useMemo para evitar re-renders
  const filters = useMemo((): RecipeFilters => {
    let sortByField: string
    let sortOrder: 'asc' | 'desc'

    switch (sortBy) {
      case 'recent':
        sortByField = 'createdAt'
        sortOrder = 'desc'
        break
      case 'oldest':
        sortByField = 'createdAt'
        sortOrder = 'asc'
        break
      case 'most_favorites':
        sortByField = 'favorites'
        sortOrder = 'desc'
        break
      case 'least_favorites':
        sortByField = 'favorites'
        sortOrder = 'asc'
        break
      default:
        sortByField = 'createdAt'
        sortOrder = 'desc'
    }

    const baseFilters: RecipeFilters = {
      page: currentPage,
      limit: 10, // Backend retorna 10 receitas por página
      sortBy: sortByField as any,
      sortOrder,
    }

    if (selectedCategory) {
      baseFilters.category = selectedCategory.id
    }

    if (searchQuery.trim()) {
      baseFilters.search = searchQuery
    }

    return baseFilters
  }, [currentPage, sortBy, selectedCategory, searchQuery])

  // Hook para buscar receitas com paginação
  const {
    data: recipesData,
    loading: recipesLoading,
    refetch: refetchRecipes,
  } = useRecipes(filters)

  // Hook para gerenciar favoritos
  const {
    isFavorite,
    toggleFavorite,
    favoriteRecipes,
    loading: favoritesLoading,
  } = useRecipeFavorites()

  // Extrair dados das receitas
  const recipes = recipesData?.data || []
  const pagination = recipesData?.pagination

  // Atualizar total de páginas quando os dados mudarem
  useEffect(() => {
    if (pagination) {
      setTotalPages(pagination.totalPages)
    }
  }, [pagination])

  // Usar dados da API com verificação de segurança
  const browseCategories = Array.isArray(categories) ? categories : []

  // Estados de loading
  const isLoading = categoriesLoading || recipesLoading
  const isLoadingMore = false // Não usamos mais paginação infinita

  // Função para tentar novamente
  const handleRetry = useCallback(() => {
    refetchCategories()
    refetchRecipes()
  }, [refetchCategories, refetchRecipes])

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
    setCurrentPage(1) // Resetar para primeira página
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
    setCurrentPage(1) // Resetar para primeira página
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory(null)
    setCurrentPage(1)
  }, [])

  // Handlers para paginação
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [currentPage, totalPages])

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [currentPage])

  // Handler para mudança de ordenação
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort)
    setCurrentPage(1) // Resetar para primeira página
    setIsDropdownOpen(false) // Fechar dropdown
  }, [])

  // Handler para abrir/fechar dropdown
  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev)
  }, [])

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
    sortBy,
    currentPage,
    totalPages,
    isDropdownOpen,

    // Estados de loading
    isLoading,
    isLoadingMore,
    favoritesLoading,

    // Estados de paginação
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,

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
    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    onSortChange: handleSortChange,
    onDropdownToggle: handleDropdownToggle,
    onDebugPress: handleDebugPress,

    // Utilitários
    isFavorite,
  }
}
