import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { useFavorites } from '@/contexts'
import type { Recipe } from '@/types/api'

export type SortOption =
  | 'createdAt'
  | 'averageRating'
  | 'difficulty'
  | 'prepTime'
  | 'servings'
export type SortDirection = 'asc' | 'desc'

export function useFavoritesPage() {
  // Router para navegação
  const router = useRouter()

  // Estados locais
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Hook para gerenciar favoritos
  const {
    favoriteRecipes,
    loading: favoritesLoading,
    refetch: refetchFavorites,
  } = useFavorites()

  // Filtrar e ordenar receitas favoritas
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = [...favoriteRecipes]

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((recipe) => {
        const titleMatch = recipe.title.toLowerCase().includes(query)
        const ingredientMatch = recipe.ingredients.some((ingredient) =>
          ingredient.name.toLowerCase().includes(query),
        )
        return titleMatch || ingredientMatch
      })
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'averageRating':
          aValue = a.averageRating || 0
          bValue = b.averageRating || 0
          break
        case 'difficulty':
          aValue = a.difficulty || 0
          bValue = b.difficulty || 0
          break
        case 'prepTime':
          aValue = a.prepTime || 0
          bValue = b.prepTime || 0
          break
        case 'servings':
          aValue = a.servings || 0
          bValue = b.servings || 0
          break
        default:
          return 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [favoriteRecipes, searchQuery, sortBy, sortDirection])

  // Estados de loading
  const isLoading = favoritesLoading

  // Função para tentar novamente
  const handleRetry = useCallback(() => {
    refetchFavorites()
  }, [refetchFavorites])

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

  const handleRecipePress = useCallback(
    (recipe: Recipe) => {
      router.push(`/(auth)/recipe-[id]?id=${recipe.id}`)
    },
    [router],
  )

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Handler para busca automática (chamado pelo debounce)
  const handleAutoSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleSortChange = useCallback((option: SortOption) => {
    setSortBy(option)
    setIsDropdownOpen(false)
  }, [])

  const handleSortDirectionToggle = useCallback(() => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }, [sortDirection])

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen)
  }, [isDropdownOpen])

  const handleDebugPress = useCallback(() => {
    // TODO: Implementar navegação para tela de debug
  }, [])

  return {
    // Dados
    recipes: filteredAndSortedRecipes,
    searchQuery,
    sortBy,
    sortDirection,
    isDropdownOpen,

    // Estados de loading
    isLoading,

    // Handlers
    onRetry: handleRetry,
    onSearchPress: handleSearchPress,
    onFilterPress: handleFilterPress,
    onNotificationPress: handleNotificationPress,
    onRecipePress: handleRecipePress,
    onSearchChange: handleSearchChange,
    onAutoSearch: handleAutoSearch,
    onClearFilters: handleClearFilters,
    onSortChange: handleSortChange,
    onSortDirectionToggle: handleSortDirectionToggle,
    onDropdownToggle: handleDropdownToggle,
    onDebugPress: handleDebugPress,
  }
}
