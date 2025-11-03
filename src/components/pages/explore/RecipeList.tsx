import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useMemo } from 'react'
import { Image, TouchableOpacity } from 'react-native'

import { Box } from '@/components/ui/box'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type { Recipe } from '@/types/api'
import type { SortDirection, SortOption } from './useExplorePage'

interface RecipeListProps {
  recipes: Recipe[]
  isLoading: boolean
  sortBy: SortOption
  sortDirection: SortDirection
  isDropdownOpen: boolean
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onRecipePress: (recipe: Recipe) => void
  onRecipeLike: (recipe: Recipe) => void
  onSortChange: (sort: SortOption) => void
  onSortDirectionToggle: () => void
  onDropdownToggle: () => void
  onNextPage: () => void
  onPrevPage: () => void
  isFavorite: (recipeId: string) => boolean
  title?: string
}

// Constante movida para fora do componente para evitar recriação
const SORT_OPTIONS = [
  { value: 'createdAt' as SortOption, label: 'Data de Criação' },
  { value: 'averageRating' as SortOption, label: 'Avaliação' },
  { value: 'difficulty' as SortOption, label: 'Dificuldade' },
  { value: 'prepTime' as SortOption, label: 'Tempo de Preparo' },
  { value: 'servings' as SortOption, label: 'Quantidade de Porções' },
] as const

// Componente otimizado com React.memo para evitar re-renderizações desnecessárias
const RecipeListComponent = React.memo<RecipeListProps>(
  ({
    recipes,
    sortBy,
    sortDirection,
    isDropdownOpen,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onRecipePress,
    onRecipeLike,
    onSortChange,
    onSortDirectionToggle,
    onDropdownToggle,
    onNextPage,
    onPrevPage,
    isFavorite,
    title = 'Receitas Publicadas',
  }) => {
    // useMemo para encontrar o label do sort atual - só recalcula quando sortBy muda
    const currentSortLabel = useMemo(
      () =>
        SORT_OPTIONS.find((option) => option.value === sortBy)?.label ||
        'Data de Criação',
      [sortBy],
    )

    // useCallback para estabilizar handlers e evitar recriação de funções
    const handleRecipePress = useCallback(
      (recipe: Recipe) => {
        onRecipePress(recipe)
      },
      [onRecipePress],
    )

    const handleRecipeLike = useCallback(
      (recipe: Recipe) => {
        onRecipeLike(recipe)
      },
      [onRecipeLike],
    )

    const handleSortChange = useCallback(
      (newSort: SortOption) => {
        onSortChange(newSort)
      },
      [onSortChange],
    )

    // useMemo para calcular se deve mostrar controles de paginação
    const showPagination = useMemo(
      () => recipes.length > 0 && totalPages > 1,
      [recipes.length, totalPages],
    )

    return (
      <VStack className='px-6 my-4'>
        <HStack className='justify-between items-center mb-4'>
          <Text className='text-xl font-bold text-gray-900'>{title}</Text>

          {/* Sort Selector */}
          <HStack className='items-center space-x-2 gap-4'>
            <Box className='relative'>
              <HStack className='items-center space-x-2 gap-2'>
                {/* Botão de direção da ordenação */}
                <TouchableOpacity
                  className='w-8 h-8 bg-white rounded-lg items-center justify-center border border-gray-200'
                  onPress={onSortDirectionToggle}
                  activeOpacity={1.0}
                >
                  <Ionicons
                    name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    color='#6B7280'
                  />
                </TouchableOpacity>

                {/* Botão de seleção de ordenação */}
                <TouchableOpacity
                  className='flex-row items-center space-x-1 px-3 py-2 bg-white rounded-lg gap-1'
                  onPress={onDropdownToggle}
                  activeOpacity={1.0}
                >
                  <Text className='text-sm font-medium text-gray-700'>
                    {currentSortLabel}
                  </Text>
                  <Ionicons
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color='#6B7280'
                  />
                </TouchableOpacity>
              </HStack>

              {/* Dropdown - Posicionado abaixo do seletor */}
              {isDropdownOpen && (
                <Box className='absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px] z-50'>
                  <VStack className='py-2'>
                    {SORT_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        className={`px-4 py-3 ${
                          sortBy === option.value ? 'bg-purple-50' : ''
                        }`}
                        onPress={() => handleSortChange(option.value)}
                      >
                        <HStack className='items-center justify-between'>
                          <Text
                            className={`text-sm ${
                              sortBy === option.value
                                ? 'text-purple-600 font-medium'
                                : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </Text>
                          {sortBy === option.value && (
                            <Ionicons name='checkmark' size={16} color='#8B5CF6' />
                          )}
                        </HStack>
                      </TouchableOpacity>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>
          </HStack>
        </HStack>

        {/* Loading state para receitas */}
        {/* {isLoading ? (
          <Box className='items-center py-8'>
            <ActivityIndicator size='large' color='#8B5CF6' />
            <Text className='mt-4 text-gray-600'>Carregando receitas...</Text>
          </Box>
        ) : */}
        {recipes.length === 0 ? (
          <Box className='items-center py-8'>
            <Ionicons name='restaurant-outline' size={48} color='#9CA3AF' />
            <Text className='mt-4 text-gray-500 text-center'>
              Nenhuma receita encontrada
            </Text>
            <Text className='text-sm text-gray-400 text-center mt-1'>
              Que tal adicionar uma nova receita?
            </Text>
          </Box>
        ) : (
          <Box className='flex-row flex-wrap justify-between'>
            {recipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                className='w-[48%] mb-4'
                onPress={() => handleRecipePress(recipe)}
              >
                <Card className='overflow-hidden bg-white rounded-lg border border-gray-200'>
                  <VStack className='space-y-2'>
                    {/* Container da imagem com overlays */}
                    <Box className='relative'>
                      <Image
                        source={{ uri: recipe.image }}
                        className='w-full h-32 rounded-lg border border-gray-200'
                        resizeMode='cover'
                      />

                      {/* Overlay do tempo de preparo (canto inferior esquerdo) */}
                      <Box className='absolute bottom-2 left-2 bg-gray-50/80 rounded-xl px-2 py-1 m-1 border border-gray-200'>
                        <Text className='text-xs font-medium text-gray-800'>
                          {recipe.prepTime} min
                        </Text>
                      </Box>

                      {/* Botão de coração (canto superior direito) */}
                      <TouchableOpacity
                        className='absolute top-2 right-2 w-8 h-8 bg-gray-50/80 rounded-full items-center justify-center border border-gray-200'
                        onPress={() => handleRecipeLike(recipe)}
                        activeOpacity={1}
                      >
                        <Ionicons
                          name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
                          size={16}
                          color={isFavorite(recipe.id) ? '#EF4444' : '#6B7280'}
                        />
                      </TouchableOpacity>
                    </Box>

                    <VStack className='py-2 space-y-1'>
                      <Text
                        className='font-semibold text-gray-900 text-sm'
                        numberOfLines={2}
                      >
                        {recipe.title}
                      </Text>

                      {/* Nota e categoria */}
                      <HStack className='items-center space-x-2 px-1 pt-1 gap-12'>
                        <HStack className='items-center space-x-1 gap-1'>
                          <Ionicons name='star' size={12} color='#F59E0B' />
                          <Text className='text-xs text-gray-600'>
                            {recipe.averageRating || '1'}
                          </Text>
                        </HStack>
                        <Text className='text-xs text-gray-600 flex-1' numberOfLines={1}>
                          Por{' '}
                          {recipe.author.name
                            ? (() => {
                                const parts = recipe.author.name.trim().split(' ')
                                const firstName = parts[0]
                                const lastInitial = parts[1]?.[0]
                                  ? ` ${parts[1][0]}.`
                                  : ''
                                return firstName + lastInitial
                              })()
                            : 'Autor desconhecido'}
                        </Text>
                      </HStack>

                      <HStack className='flex-wrap gap-2 pt-2'>
                        {recipe.categories && recipe.categories.length > 0 && (
                          // biome-ignore lint/complexity/noUselessFragments: mandatory by React Native
                          <>
                            {recipe.categories.slice(0, 2).map((category) => (
                              <Box
                                key={category.id}
                                className='bg-gray-100 px-2 py-1 rounded-full'
                              >
                                <Text className='text-xs text-gray-800 font-medium'>
                                  {category.name}
                                </Text>
                              </Box>
                            ))}
                          </>
                        )}
                      </HStack>
                    </VStack>
                  </VStack>
                </Card>
              </TouchableOpacity>
            ))}
          </Box>
        )}

        {/* Pagination Controls */}
        {showPagination && (
          <HStack className='justify-between items-center mt-6 mb-4'>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                hasPrevPage ? 'bg-purple-500' : 'bg-gray-300'
              }`}
              onPress={onPrevPage}
              disabled={!hasPrevPage}
            >
              <HStack className='items-center space-x-2'>
                <Ionicons
                  name='chevron-back'
                  size={16}
                  color={hasPrevPage ? 'white' : '#9CA3AF'}
                />
                <Text
                  className={`font-medium ${hasPrevPage ? 'text-white' : 'text-gray-500'}`}
                >
                  Anterior
                </Text>
              </HStack>
            </TouchableOpacity>

            <Text className='text-sm text-gray-600'>
              Página {currentPage} de {totalPages}
            </Text>

            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                hasNextPage ? 'bg-purple-500' : 'bg-gray-300'
              }`}
              onPress={onNextPage}
              disabled={!hasNextPage}
            >
              <HStack className='items-center space-x-2'>
                <Text
                  className={`font-medium ${hasNextPage ? 'text-white' : 'text-gray-500'}`}
                >
                  Próxima
                </Text>
                <Ionicons
                  name='chevron-forward'
                  size={16}
                  color={hasNextPage ? 'white' : '#9CA3AF'}
                />
              </HStack>
            </TouchableOpacity>
          </HStack>
        )}
      </VStack>
    )
  },
)

// Definir displayName para facilitar debugging
RecipeListComponent.displayName = 'RecipeList'

export { RecipeListComponent as RecipeList }
