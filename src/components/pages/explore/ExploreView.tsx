import { Ionicons } from '@expo/vector-icons'
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import { Box } from '@/components/ui/box'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type { Category, Recipe } from '@/types/api'
import type { SortOption } from './useExplorePage'

interface ExploreViewProps {
  // Dados
  browseCategories: Category[]
  recipes: Recipe[]
  isLoading: boolean
  sortBy: SortOption
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
  onDropdownToggle: () => void
}

const sortOptions = [
  { value: 'recent' as SortOption, label: 'Mais Recentes' },
  { value: 'oldest' as SortOption, label: 'Menos Antigas' },
  { value: 'most_liked' as SortOption, label: 'Mais Favoritadas' },
  { value: 'least_liked' as SortOption, label: 'Menos Favoritadas' },
]

export function ExploreView({
  browseCategories,
  recipes,
  isLoading,
  sortBy,
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  isDropdownOpen,
  onRetry,
  onSearchPress,
  onFilterPress,
  onNotificationPress,
  onCategoryPress,
  onRecipePress,
  onRecipeLike,
  onNextPage,
  onPrevPage,
  onSortChange,
  onDropdownToggle,
}: ExploreViewProps) {
  // Loading state
  if (isLoading) {
    return (
      <Box className='flex-1 bg-white justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
        <Text className='mt-4 text-gray-600'>Carregando...</Text>
      </Box>
    )
  }

  return (
    <Box className='flex-1 bg-white'>
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
          <HStack className='justify-between items-center px-6 py-10'>
            <HStack className='items-center space-x-3'>
              <Box className='w-8 h-8 bg-purple-500 rounded-lg items-center justify-center'>
                <Ionicons name='restaurant' size={20} color='white' />
              </Box>
              <Text className='text-xl font-bold pl-4 text-gray-900'>One Plate</Text>
            </HStack>
            <HStack className='space-x-5 gap-4'>
              <TouchableOpacity onPress={onSearchPress}>
                <Ionicons name='search' size={24} color='#374151' />
              </TouchableOpacity>
              <TouchableOpacity onPress={onNotificationPress}>
                <Ionicons name='notifications' size={24} color='#374151' />
              </TouchableOpacity>
              {isLoading && <ActivityIndicator size='small' color='#8B5CF6' />}
            </HStack>
          </HStack>

          {/* Search Bar */}
          <Box className='mx-6 mb-6'>
            <HStack className='bg-gray-100 rounded-xl px-4 py-3 items-center space-x-3'>
              <Ionicons name='search' size={22} color='#8B5CF6' />
              <Box className='flex-1'>
                <Text className='text-gray-500 text-base' numberOfLines={1}>
                  Buscar receitas, ingredientes...
                </Text>
              </Box>
              <TouchableOpacity onPress={onFilterPress}>
                <Ionicons name='options-outline' size={22} color='#6B7280' />
              </TouchableOpacity>
            </HStack>
          </Box>

          {/* Browse by Category */}
          <VStack className='px-6 mb-4'>
            <Text className='text-lg font-bold text-gray-900 mb-4'>
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
                    <Box
                      className={`w-24 h-16 ${category.color || 'bg-gray-400'} rounded-lg items-center justify-center mb-2 border-2 border-black`}
                    >
                      <Text className='text-sm font-semibold text-center px-2 text-white'>
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
              <Text className='text-lg font-bold text-gray-900'>Receitas</Text>

              {/* Sort Selector */}
              <HStack className='items-center space-x-2 gap-4'>
                <Box className='relative'>
                  <TouchableOpacity
                    className='flex-row items-center space-x-1 px-3 py-2 bg-gray-100 rounded-lg'
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

                  {/* Dropdown - Posicionado abaixo do seletor */}
                  {isDropdownOpen && (
                    <Box className='absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px] z-50'>
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
                    <Card className='overflow-hidden'>
                      <VStack className='space-y-2'>
                        <Image
                          source={{ uri: recipe.image }}
                          className='w-full h-32 rounded-lg border-2 border-black'
                          resizeMode='cover'
                        />
                        <VStack className='px-2 pb-2 space-y-1'>
                          <HStack className='items-center space-x-2'>
                            <Text
                              className='text-xs text-gray-600 flex-1'
                              numberOfLines={1}
                            >
                              Por {recipe.author.name || 'Autor desconhecido'}
                            </Text>
                          </HStack>
                          <Text
                            className='font-semibold text-gray-900 text-sm'
                            numberOfLines={2}
                          >
                            {recipe.title}
                          </Text>
                          <HStack className='items-center justify-between'>
                            <HStack className='items-center space-x-2'>
                              <HStack className='items-center space-x-1'>
                                <Ionicons name='heart' size={12} color='#EF4444' />
                                <Text className='text-xs text-gray-600'>
                                  {recipe.likes || 0}
                                </Text>
                              </HStack>
                              <HStack className='items-center space-x-1'>
                                <Ionicons name='time' size={12} color='#6B7280' />
                                <Text className='text-xs text-gray-600'>
                                  {recipe.cookMinutes}min
                                </Text>
                              </HStack>
                            </HStack>
                            <TouchableOpacity onPress={() => onRecipeLike(recipe)}>
                              <Box className='w-8 h-8 bg-gray-100 rounded-full items-center justify-center'>
                                <Ionicons
                                  name='heart-outline'
                                  size={16}
                                  color='#6B7280'
                                />
                              </Box>
                            </TouchableOpacity>
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
