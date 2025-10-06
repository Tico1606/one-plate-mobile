import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFavorites } from '@/contexts'
import { useRecipes } from '@/hooks'
import { useCategories } from '@/hooks/useCategories'
import type { Category, Recipe, RecipeFilters } from '@/types/api'

export type SortOption =
  | 'createdAt'
  | 'averageRating'
  | 'difficulty'
  | 'prepTime'
  | 'servings'
export type SortDirection = 'asc' | 'desc'

export function useExplorePage() {
  // Router para navegação
  const router = useRouter()

  // Estados locais
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [totalPages, setTotalPages] = useState(1)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Hooks para buscar dados
  const {
    data: categories,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories()

  // Função para remover acentos da string
  const removeAccents = useCallback((str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }, [])

  // Removido debounce automático - busca apenas quando usuário pressiona Enter ou clica na lupa

  // Construir filtros para a API com useMemo para evitar re-renders
  const filters = useMemo((): RecipeFilters => {
    const baseFilters: RecipeFilters = {
      page: currentPage,
      limit: 10, // Backend retorna 10 receitas por página
      sortBy: sortBy as any,
      sortOrder: sortDirection,
    }

    // Se há categorias selecionadas, filtrar por elas
    if (selectedCategories.length > 0) {
      // Usar o novo formato de múltiplas categorias
      baseFilters.categories = selectedCategories.map((cat) => cat.id)
    }

    if (debouncedSearchQuery.trim()) {
      baseFilters.search = debouncedSearchQuery
    }

    return baseFilters
  }, [currentPage, sortBy, sortDirection, selectedCategories, debouncedSearchQuery])

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
  } = useFavorites()

  // Extrair dados das receitas
  const recipes = recipesData?.data || []
  const pagination = recipesData?.pagination

  // Atualizar total de páginas quando os dados mudarem
  useEffect(() => {
    if (pagination) {
      setTotalPages(pagination.totalPages)
    }
  }, [pagination])

  // Usar dados da API com verificação de segurança e ordenar categorias
  const browseCategories = useMemo(() => {
    const allCategories = Array.isArray(categories) ? categories : []

    // Ordenar categorias: selecionadas primeiro, depois as não selecionadas
    const selectedIds = selectedCategories.map((cat) => cat.id)
    const selected = allCategories.filter((cat) => selectedIds.includes(cat.id))
    const unselected = allCategories.filter((cat) => !selectedIds.includes(cat.id))

    return [...selected, ...unselected]
  }, [categories, selectedCategories])

  // Estados de loading separados para evitar recarregar a tela inteira
  const isInitialLoading = categoriesLoading && !categories // Só loading inicial quando não há categorias
  const isRecipesLoading = recipesLoading // Loading específico das receitas
  const isLoadingMore = false // Não usamos mais paginação infinita

  // Função para tentar novamente
  const handleRetry = useCallback(() => {
    refetchCategories()
    refetchRecipes()
  }, [refetchCategories, refetchRecipes])

  // Handlers para eventos
  const handleSearchPress = useCallback(() => {
    // Força a busca imediata quando o usuário clica no botão de pesquisar
    const normalizedQuery = removeAccents(searchQuery)
    setDebouncedSearchQuery(normalizedQuery)
    setCurrentPage(1) // Resetar para primeira página
  }, [searchQuery, removeAccents])

  const handleFilterPress = useCallback(() => {
    // TODO: Implementar filtros
  }, [])

  const handleNotificationPress = useCallback(() => {
    // TODO: Implementar notificações
  }, [])

  const handleCategoryPress = useCallback((category: Category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.some((cat) => cat.id === category.id)

      if (isSelected) {
        // Se já está selecionada, remover
        return prev.filter((cat) => cat.id !== category.id)
      } else {
        // Se não está selecionada, adicionar
        return [...prev, category]
      }
    })

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
      setSelectedCategories([]) // Limpar categorias quando buscar
    }
    setCurrentPage(1) // Resetar para primeira página
  }, [])

  // Handler para busca automática (chamado pelo debounce)
  const handleAutoSearch = useCallback((query: string) => {
    setDebouncedSearchQuery(query)
    setCurrentPage(1) // Resetar para primeira página
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setSelectedCategories([])
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

  // Handler para mudança de direção da ordenação
  const handleSortDirectionToggle = useCallback(() => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    setCurrentPage(1) // Resetar para primeira página
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
    selectedCategories,
    sortBy,
    sortDirection,
    currentPage,
    totalPages,
    isDropdownOpen,

    // Estados de loading
    isInitialLoading,
    isRecipesLoading,
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
    onAutoSearch: handleAutoSearch,
    onClearFilters: handleClearFilters,
    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    onSortChange: handleSortChange,
    onSortDirectionToggle: handleSortDirectionToggle,
    onDropdownToggle: handleDropdownToggle,
    onDebugPress: handleDebugPress,

    // Utilitários
    isFavorite,
  }
}
