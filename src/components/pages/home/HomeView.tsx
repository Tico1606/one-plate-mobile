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
import type { Category, Recipe } from '@/types/api'

interface HomeViewProps {
  // Dados
  browseCategories: Category[]
  recipes: Recipe[]
  isLoading: boolean
  searchQuery?: string
  unreadNotificationsCount?: number

  // Handlers
  onRetry: () => void
  onSearchPress: () => void
  onNotificationPress: () => void
  onCategoryPress: (category: Category) => void
  onRecipePress: (recipe: Recipe) => void
  onViewAllRecipes: () => void
  onRecipeLike: (recipe: Recipe) => void
  onSearchChange?: (query: string) => void
  onAutoSearch?: (query: string) => void
  isFavorite: (recipeId: string) => boolean
}

export function HomeView({
  recipes,
  isLoading,
  searchQuery,
  unreadNotificationsCount = 0,
  onRetry,
  onSearchPress,
  onNotificationPress,
  onRecipePress,
  onViewAllRecipes,
  onRecipeLike,
  onSearchChange,
  onAutoSearch,
  isFavorite,
}: HomeViewProps) {
  // Loading state
  if (isLoading) {
    return (
      <Box className='flex-1 bg-zinc-100 justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
        <Text className='mt-4 text-gray-600'>Carregando...</Text>
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
        <Header
          isLoading={isLoading}
          unreadCount={unreadNotificationsCount}
          onNotificationPress={onNotificationPress}
        />

        {/* Search Bar */}
        <SearchBar
          placeholder='Buscar receitas por nome, ingredientes...'
          value={searchQuery}
          onChangeText={onSearchChange || (() => {})}
          onSearchPress={onSearchPress}
          onSearchChange={onAutoSearch}
          debounceMs={800}
        />

        {/* Recent Recipes */}
        <VStack className='px-6 my-4'>
          <HStack className='justify-between items-center mb-4'>
            <Text className='text-xl font-bold text-gray-900'>Receitas Recentes</Text>
            <TouchableOpacity onPress={onViewAllRecipes}>
              <Text className='text-purple-500 font-bold px-2'>Ver Todas</Text>
            </TouchableOpacity>
          </HStack>

          <VStack className='space-y-5 py-2 gap-4'>
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
                            <TouchableOpacity
                              onPress={() => onRecipeLike(recipe)}
                              activeOpacity={1}
                            >
                              <Box className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center'>
                                <Ionicons
                                  name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
                                  size={20}
                                  color={isFavorite(recipe.id) ? '#EF4444' : '#6B7280'}
                                />
                              </Box>
                            </TouchableOpacity>
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
