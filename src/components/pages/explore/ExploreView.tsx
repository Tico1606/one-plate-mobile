import { Ionicons } from '@expo/vector-icons'
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import { Header, SearchBar } from '@/components/global'
import { Box } from '@/components/ui/box'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type { Category, Recipe } from '@/types/api'
import type { SortDirection, SortOption } from './useExplorePage'

interface ExploreViewProps {
  // Dados
  browseCategories: Category[]
  recipes: Recipe[]
  isLoading: boolean
  sortBy: SortOption
  sortDirection: SortDirection
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  isDropdownOpen: boolean

  // Handlers
  onRetry: () => void
  onSearchPress: () => void
  onFilterPress: () => void
  onNotificationPress: () => void
  onCategoryPress: (category: Category) => void
  onRecipePress: (recipe: Recipe) => void
  onRecipeLike: (recipe: Recipe) => void
  onNextPage: () => void
  onPrevPage: () => void
  onSortChange: (sort: SortOption) => void
  onSortDirectionToggle: () => void
  onDropdownToggle: () => void
}

const sortOptions = [
  { value: 'createdAt' as SortOption, label: 'Data de Criação' },
  { value: 'averageRating' as SortOption, label: 'Avaliação' },
  { value: 'difficulty' as SortOption, label: 'Dificuldade' },
  { value: 'prepTime' as SortOption, label: 'Tempo de Preparo' },
  { value: 'servings' as SortOption, label: 'Quantidade de Porções' },
]

export function ExploreView({
  browseCategories,
  recipes,
  isLoading,
  sortBy,
  sortDirection,
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  isDropdownOpen,
  onRetry,
  // onSearchPress,
  onFilterPress,
  onNotificationPress,
  onCategoryPress,
  onRecipePress,
  onRecipeLike,
  onNextPage,
  onPrevPage,
  onSortChange,
  onSortDirectionToggle,
  onDropdownToggle,
}: ExploreViewProps) {
  if (isLoading) {
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
        onPress={() => isDropdownOpen && onDropdownToggle()}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRetry}
              colors={['#8B5CF6']}
              tintColor='#8B5CF6'
            />
          }
        >
          {/* Header */}
          <Header isLoading={isLoading} onNotificationPress={onNotificationPress} />

          {/* Search Bar */}
          <SearchBar onSearchPress={() => {}} onFilterPress={onFilterPress} />

          {/* Browse by Category */}
          <VStack className='px-6 mb-4'>
            <Text className='text-xl font-bold text-gray-900 mb-4'>
              Navegar por Categoria
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack className='space-x-4 pt-4 gap-6'>
                {browseCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className='items-center min-w-[100px]'
                    onPress={() => onCategoryPress(category)}
                  >
                    <Box className='w-24 h-16 bg-white-100 rounded-lg items-center justify-center mb-2 border-2 border-purple-400'>
                      <Text className='text-sm font-semibold text-center px-2 text-purple-500'>
                        {category.name}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Recipes Grid */}
          <VStack className='px-6 my-4'>
            <HStack className='justify-between items-center mb-4'>
              <Text className='text-xl font-bold text-gray-900'>
                Receitas Publicadas
              </Text>

              {/* Sort Selector */}
              <HStack className='items-center space-x-2 gap-4'>
                <Box className='relative'>
                  <HStack className='items-center space-x-2 gap-2'>
                    {/* Botão de direção da ordenação */}
                    <TouchableOpacity
                      className='w-8 h-8 bg-white rounded-lg items-center justify-center border border-gray-200'
                      onPress={onSortDirectionToggle}
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
                    >
                      <Text className='text-sm font-medium text-gray-700'>
                        {sortOptions.find((option) => option.value === sortBy)?.label}
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
                        {sortOptions.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            className={`px-4 py-3 ${
                              sortBy === option.value ? 'bg-purple-50' : ''
                            }`}
                            onPress={() => onSortChange(option.value)}
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
                    onPress={() => onRecipePress(recipe)}
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
                            onPress={() => onRecipeLike(recipe)}
                          >
                            <Ionicons name='heart-outline' size={16} color='#6B7280' />
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
                            <Text
                              className='text-xs text-gray-600 flex-1'
                              numberOfLines={1}
                            >
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
            {recipes.length > 0 && totalPages > 1 && (
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
                      className={`font-medium ${
                        hasPrevPage ? 'text-white' : 'text-gray-500'
                      }`}
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
                      className={`font-medium ${
                        hasNextPage ? 'text-white' : 'text-gray-500'
                      }`}
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
        </ScrollView>
      </TouchableOpacity>
    </Box>
  )
}
