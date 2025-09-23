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

interface HomeViewProps {
  // Dados
  browseCategories: Category[]
  recipes: Recipe[]
  isLoading: boolean

  // Handlers
  onRetry: () => void
  onSearchPress: () => void
  onFilterPress: () => void
  onNotificationPress: () => void
  onCategoryPress: (category: Category) => void
  onRecipePress: (recipe: Recipe) => void
  onViewAllRecipes: () => void
  onRecipeLike: (recipe: Recipe) => void
}

export function HomeView({
  browseCategories,
  recipes,
  isLoading,
  onRetry,
  onSearchPress,
  onFilterPress,
  onNotificationPress,
  onCategoryPress,
  onRecipePress,
  onViewAllRecipes,
  onRecipeLike,
}: HomeViewProps) {
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
            <HStack className='space-x-6 pt-4 gap-4'>
              {browseCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className='items-center min-w-[80px]'
                  onPress={() => onCategoryPress(category)}
                >
                  <Box
                    className={`w-16 h-16 ${category.color} rounded-full items-center justify-center mb-2 border-2 border-black`}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={category.iconColor}
                    />
                  </Box>
                  <Text className='text-xs text-gray-600 text-center'>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </HStack>
          </ScrollView>
        </VStack>

        {/* Recent Recipes */}
        <VStack className='px-6 my-4'>
          <HStack className='justify-between items-center mb-2'>
            <Text className='text-lg font-bold text-gray-900'>Receitas</Text>
            <TouchableOpacity onPress={onViewAllRecipes}>
              <Text className='text-blue-500 font-medium'>Ver Todas</Text>
            </TouchableOpacity>
          </HStack>

          <VStack className='space-y-5'>
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
              recipes.map((recipe) => {
                console.log('🔍 DEBUG recipe completo:', recipe)
                return (
                  <TouchableOpacity key={recipe.id} onPress={() => onRecipePress(recipe)}>
                    <Card className='overflow-hidden'>
                      <HStack className='space-x-4'>
                        <Image
                          source={{ uri: recipe.image }}
                          className='w-24 h-24 rounded-lg border-2 border-black'
                          resizeMode='cover'
                        />
                        <VStack className='flex-1 py-2 space-y-1'>
                          <HStack className='justify-between items-start'>
                            <VStack className='flex-1 space-y-1 px-4'>
                              <HStack className='items-center space-x-2'>
                                <Box className='w-6 h-6 bg-blue-100 rounded-full items-center justify-center'>
                                  <Ionicons name='person' size={12} color='#3B82F6' />
                                </Box>
                                <Text className='text-xs text-gray-600 px-2'>
                                  by{' '}
                                  {typeof recipe.author === 'string'
                                    ? recipe.author
                                    : (recipe.author as any)?.name ||
                                      'Autor desconhecido'}
                                </Text>
                              </HStack>
                              <Text className='font-semibold text-gray-900'>
                                {recipe.title}
                              </Text>
                              <HStack className='items-center space-x-3 gap-2'>
                                <HStack className='items-center space-x-1'>
                                  <Ionicons name='heart' size={14} color='#EF4444' />
                                  <Text className='text-xs text-gray-600'>
                                    {(() => {
                                      const likes = (recipe as any)._count?.favorites || 0
                                      console.log(
                                        '🔍 DEBUG recipe._count.favorites:',
                                        likes,
                                      )
                                      return likes
                                    })()}
                                  </Text>
                                </HStack>
                                <HStack className='items-center space-x-1'>
                                  <Ionicons name='time' size={14} color='#6B7280' />
                                  <Text className='text-xs text-gray-600'>
                                    {(() => {
                                      const cookTime = recipe.cookMinutes || 0
                                      console.log(
                                        '🔍 DEBUG recipe.cookMinutes:',
                                        cookTime,
                                      )
                                      return `${cookTime}min`
                                    })()}
                                  </Text>
                                </HStack>
                                <HStack className='items-center space-x-1'>
                                  <Ionicons name='timer' size={14} color='#6B7280' />
                                  <Text className='text-xs text-gray-600'>
                                    {(() => {
                                      console.log(
                                        '🔍 DEBUG recipe.prepMinutes:',
                                        recipe.prepMinutes,
                                      )
                                      return `${recipe.prepMinutes}min`
                                    })()}
                                  </Text>
                                </HStack>
                              </HStack>
                            </VStack>
                            <VStack className='items-center space-y-2'>
                              <TouchableOpacity onPress={() => onRecipeLike(recipe)}>
                                <Box className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center'>
                                  <Ionicons
                                    name='heart-outline'
                                    size={20}
                                    color='#6B7280'
                                  />
                                </Box>
                              </TouchableOpacity>
                            </VStack>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Card>
                  </TouchableOpacity>
                )
              })
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  )
}
