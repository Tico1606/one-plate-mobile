import { Ionicons } from '@expo/vector-icons'
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Header } from '@/components/global/Header'
import { SearchBar } from '@/components/global/SearchBar'
import { Box } from '@/components/ui/box'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type { Recipe } from '@/types/api'
import type { SortDirection, SortOption } from './useFavoritesPage'

// Constante para opções de ordenação
const SORT_OPTIONS = [
  { value: 'createdAt' as SortOption, label: 'Data de Criação' },
  { value: 'averageRating' as SortOption, label: 'Avaliação' },
  { value: 'difficulty' as SortOption, label: 'Dificuldade' },
  { value: 'prepTime' as SortOption, label: 'Tempo de Preparo' },
  { value: 'servings' as SortOption, label: 'Quantidade de Porções' },
] as const

interface FavoritesViewProps {
  // Dados
  recipes: Recipe[]
  searchQuery?: string
  sortBy: SortOption
  sortDirection: SortDirection
  isDropdownOpen: boolean

  // Estados
  isLoading: boolean

  // Handlers
  onRetry: () => void
  onSearchPress: () => void
  onNotificationPress: () => void
  onRecipePress: (recipe: Recipe) => void
  onSearchChange?: (query: string) => void
  onAutoSearch?: (query: string) => void
  onSortChange: (option: SortOption) => void
  onSortDirectionToggle: () => void
  onDropdownToggle: () => void
}

export function FavoritesView({
  recipes,
  searchQuery,
  sortBy,
  sortDirection,
  isDropdownOpen,
  isLoading,
  onRetry,
  onSearchPress,
  onNotificationPress,
  onRecipePress,
  onSearchChange,
  onAutoSearch,
  onSortChange,
  onSortDirectionToggle,
  onDropdownToggle,
}: FavoritesViewProps) {
  // Loading state
  if (isLoading) {
    return (
      <Box className='flex-1 bg-zinc-100 justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
        <Text className='mt-4 text-gray-600'>Carregando favoritos...</Text>
      </Box>
    )
  }

  return (
    <Box className='flex-1 bg-zinc-100'>
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
        <SearchBar
          placeholder='Buscar receitas favoritas por nome, ingredientes...'
          value={searchQuery}
          onChangeText={onSearchChange || (() => {})}
          onSearchPress={onSearchPress}
          onSearchChange={onAutoSearch}
          debounceMs={800}
        />

        {/* Favorites List */}
        <VStack className='px-6 my-4'>
          <HStack className='justify-between items-center mb-4'>
            <Text className='text-xl font-bold text-gray-900'>Receitas Favoritas</Text>

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
                      {SORT_OPTIONS.find((option) => option.value === sortBy)?.label ||
                        'Data de Criação'}
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

          <VStack className='space-y-5 py-2 gap-4'>
            {recipes.length === 0 ? (
              <Box className='items-center py-8'>
                <Ionicons name='heart-outline' size={48} color='#9CA3AF' />
                <Text className='mt-4 text-gray-500 text-center'>
                  {searchQuery
                    ? 'Nenhuma receita encontrada'
                    : 'Nenhuma receita favoritada'}
                </Text>
                <Text className='text-sm text-gray-400 text-center mt-1'>
                  {searchQuery
                    ? 'Tente ajustar os filtros de busca'
                    : 'Que tal favoritar algumas receitas?'}
                </Text>
              </Box>
            ) : (
              recipes.map((recipe) => (
                <TouchableOpacity key={recipe.id} onPress={() => onRecipePress(recipe)}>
                  <Card className='overflow-hidden'>
                    <HStack className='space-x-4'>
                      <Image
                        source={{ uri: recipe.image }}
                        className='w-24 h-24 rounded-lg border border-gray-200'
                        resizeMode='cover'
                      />
                      <VStack className='flex-1 py-2 space-y-1'>
                        <HStack className='justify-between items-start'>
                          <VStack className='flex-1 space-y-1 px-4 gap-1'>
                            <HStack className='items-center space-x-2'>
                              <Box className='w-6 h-6 bg-blue-100 rounded-full items-center justify-center'>
                                <Ionicons name='person' size={12} color='#3B82F6' />
                              </Box>
                              <Text className='text-xs text-gray-600 px-2'>
                                by {recipe.author.name || 'Autor desconhecido'}
                              </Text>
                            </HStack>
                            <Text className='font-semibold text-gray-900'>
                              {recipe.title}
                            </Text>
                            <HStack className='items-center space-x-3 gap-2'>
                              <HStack className='items-center space-x-1'>
                                <Ionicons name='star' size={14} color='#F59E0B' />
                                <Text className='text-xs text-gray-600 px-1'>
                                  {recipe.averageRating || '0'}
                                </Text>
                              </HStack>
                              <HStack className='items-center space-x-1'>
                                <Ionicons name='time' size={14} color='#6B7280' />
                                <Text className='text-xs text-gray-600 px-1'>
                                  {recipe.prepTime}min
                                </Text>
                              </HStack>
                            </HStack>
                          </VStack>
                          <VStack className='items-center space-y-2'>
                            <Box className='w-10 h-10 bg-red-100 rounded-full items-center justify-center'>
                              <Ionicons name='heart' size={20} color='#EF4444' />
                            </Box>
                          </VStack>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  )
}
