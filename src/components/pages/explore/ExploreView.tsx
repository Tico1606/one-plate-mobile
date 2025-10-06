import React, { useCallback } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'

import { CategoryFilter, Header, SearchBar } from '@/components/global'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import type { Category, Recipe } from '@/types/api'
import { RecipeList } from './RecipeList'
import type { SortDirection, SortOption } from './useExplorePage'

interface ExploreViewProps {
  // Dados
  browseCategories: Category[]
  recipes: Recipe[]
  selectedCategories: Category[]
  searchQuery: string
  isInitialLoading: boolean
  isRecipesLoading: boolean
  sortBy: SortOption
  sortDirection: SortDirection
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  isDropdownOpen: boolean

  // Handlers
  onRetry: () => void
  onSearchChange: (query: string) => void
  onSearchPress: () => void
  onNotificationPress: () => void
  onCategoryPress: (category: Category) => void
  onRecipePress: (recipe: Recipe) => void
  onRecipeLike: (recipe: Recipe) => void
  onNextPage: () => void
  onPrevPage: () => void
  onSortChange: (sort: SortOption) => void
  onSortDirectionToggle: () => void
  onDropdownToggle: () => void
  onAutoSearch?: (query: string) => void
  isFavorite: (recipeId: string) => boolean
}

// Componente otimizado com React.memo para evitar re-renderizações desnecessárias
const ExploreViewComponent = React.memo<ExploreViewProps>(
  ({
    browseCategories,
    recipes,
    selectedCategories,
    searchQuery,
    isInitialLoading,
    isRecipesLoading,
    sortBy,
    sortDirection,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    isDropdownOpen,
    onSearchChange,
    onSearchPress,
    onNotificationPress,
    onCategoryPress,
    onRecipePress,
    onRecipeLike,
    onNextPage,
    onPrevPage,
    onSortChange,
    onSortDirectionToggle,
    onDropdownToggle,
    onAutoSearch,
    isFavorite,
  }) => {
    // useCallback para estabilizar o handler de fechar dropdown
    const handleCloseDropdown = useCallback(() => {
      if (isDropdownOpen) {
        onDropdownToggle()
      }
    }, [isDropdownOpen, onDropdownToggle])

    // useMemo para RefreshControl - só recria quando isRecipesLoading ou onRetry mudam
    // const refreshControl = useMemo(
    //   () => (
    //     <RefreshControl
    //       refreshing={isRecipesLoading}
    //       onRefresh={onRetry}
    //       colors={['#8B5CF6']}
    //       tintColor='#8B5CF6'
    //     />
    //   ),
    //   [isRecipesLoading, onRetry],
    // )

    // Só mostra loading inicial quando não há categorias carregadas
    if (isInitialLoading) {
      return (
        <Box className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#8B5CF6' />
          <Text className='mt-4 text-gray-600'>Carregando...</Text>
        </Box>
      )
    }

    return (
      <Box className='flex-1'>
        <TouchableOpacity
          className='flex-1'
          activeOpacity={1}
          onPress={handleCloseDropdown}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            // refreshControl={refreshControl}
          >
            {/* Header */}
            <Header
              isLoading={isRecipesLoading}
              onNotificationPress={onNotificationPress}
            />

            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChangeText={onSearchChange}
              onSearchPress={onSearchPress}
              onSearchChange={onAutoSearch}
              debounceMs={800}
            />

            {/* Browse by Category */}
            <CategoryFilter
              categories={browseCategories}
              selectedCategories={selectedCategories}
              onCategoryPress={onCategoryPress}
              title='Filtrar por Categoria'
            />

            {/* Recipes List */}
            <RecipeList
              recipes={recipes}
              isLoading={isRecipesLoading}
              sortBy={sortBy}
              sortDirection={sortDirection}
              isDropdownOpen={isDropdownOpen}
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onRecipePress={onRecipePress}
              onRecipeLike={onRecipeLike}
              onSortChange={onSortChange}
              onSortDirectionToggle={onSortDirectionToggle}
              onDropdownToggle={onDropdownToggle}
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
              isFavorite={isFavorite}
              title='Receitas Publicadas'
            />
          </ScrollView>
        </TouchableOpacity>
      </Box>
    )
  },
)

// Definir displayName para facilitar debugging
ExploreViewComponent.displayName = 'ExploreView'

export { ExploreViewComponent as ExploreView }
