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
import { useCategories } from '@/hooks/useCategories'
import { useRecentRecipes } from '@/hooks/useRecipes'
import type { Category, Recipe } from '@/types/api'

interface HomePageProps {
  onSearchPress?: () => void
  onFilterPress?: () => void
  onNotificationPress?: () => void
  onCategoryPress?: (category: Category) => void
  onRecipePress?: (recipe: Recipe) => void
  onViewAllRecipes?: () => void
  onRecipeLike?: (recipe: Recipe) => void
}

export function HomePage({
  onSearchPress,
  onFilterPress,
  onNotificationPress,
  onCategoryPress,
  onRecipePress,
  onViewAllRecipes,
  onRecipeLike,
}: HomePageProps) {
  // Buscar categorias e receitas da API
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories()

  const {
    data: recentRecipes,
    loading: recipesLoading,
    error: recipesError,
    refetch: refetchRecipes,
  } = useRecentRecipes(10)

  // Categorias mockadas como fallback
  const mockCategories: Category[] = [
    {
      id: 1,
      name: 'Italiana',
      icon: 'pizza',
      color: 'bg-red-100',
      iconColor: '#EF4444',
      recipeCount: 0,
    },
    {
      id: 2,
      name: 'Mexicana',
      icon: 'flame',
      color: 'bg-yellow-100',
      iconColor: '#EAB308',
      recipeCount: 0,
    },
    {
      id: 3,
      name: 'Sobremesas',
      icon: 'ice-cream',
      color: 'bg-pink-100',
      iconColor: '#EC4899',
      recipeCount: 0,
    },
    {
      id: 4,
      name: 'Vegana',
      icon: 'leaf',
      color: 'bg-green-100',
      iconColor: '#22C55E',
      recipeCount: 0,
    },
    {
      id: 5,
      name: 'Frutos do Mar',
      icon: 'fish',
      color: 'bg-blue-100',
      iconColor: '#3B82F6',
      recipeCount: 0,
    },
  ]

  // Receitas mockadas como fallback
  const mockRecipes: Recipe[] = [
    {
      id: 1,
      title: 'Pizza Margherita',
      description: 'Pizza clássica italiana com molho de tomate, mussarela e manjericão',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
      author: 'Chef Italiano',
      authorId: 1,
      rating: 4.8,
      time: '30 min',
      likes: 124,
      difficulty: 'easy',
      servings: 4,
      ingredients: [
        { id: 1, name: 'Massa', amount: '500', unit: 'g' },
        { id: 2, name: 'Molho de tomate', amount: '200', unit: 'ml' },
        { id: 3, name: 'Mussarela', amount: '300', unit: 'g' },
        { id: 4, name: 'Manjericão', amount: '10', unit: 'folhas' },
      ],
      instructions: [
        'Preparar a massa',
        'Adicionar molho',
        'Colocar mussarela',
        'Assar no forno',
      ],
      tags: ['italiana', 'vegetariana', 'clássica'],
      categoryId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Tacos de Carne',
      description: 'Tacos mexicanos tradicionais com carne temperada e vegetais frescos',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      author: 'Chef Mexicano',
      authorId: 2,
      rating: 4.6,
      time: '25 min',
      likes: 89,
      difficulty: 'medium',
      servings: 6,
      ingredients: [
        { id: 5, name: 'Tortillas', amount: '12', unit: 'unidades' },
        { id: 6, name: 'Carne moída', amount: '500', unit: 'g' },
        { id: 7, name: 'Cebola', amount: '1', unit: 'unidade' },
        { id: 8, name: 'Tomate', amount: '2', unit: 'unidades' },
        { id: 9, name: 'Coentro', amount: '1', unit: 'maço' },
      ],
      instructions: [
        'Temperar a carne',
        'Refogar com cebola',
        'Montar os tacos',
        'Servir quente',
      ],
      tags: ['mexicana', 'carne', 'picante'],
      categoryId: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Brownie de Chocolate',
      description: 'Brownie caseiro com chocolate derretido e nozes',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
      author: 'Chef Doce',
      authorId: 3,
      rating: 4.9,
      time: '45 min',
      likes: 156,
      difficulty: 'easy',
      servings: 8,
      ingredients: [
        { id: 10, name: 'Chocolate', amount: '200', unit: 'g' },
        { id: 11, name: 'Manteiga', amount: '100', unit: 'g' },
        { id: 12, name: 'Açúcar', amount: '150', unit: 'g' },
        { id: 13, name: 'Ovos', amount: '3', unit: 'unidades' },
        { id: 14, name: 'Farinha', amount: '100', unit: 'g' },
        { id: 15, name: 'Nozes', amount: '50', unit: 'g' },
      ],
      instructions: [
        'Derreter chocolate',
        'Misturar ingredientes',
        'Assar no forno',
        'Deixar esfriar',
      ],
      tags: ['sobremesa', 'chocolate', 'caseiro'],
      categoryId: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  // Usar dados da API ou fallback para mockados
  const browseCategories =
    categories && categories.length > 0 ? categories : mockCategories
  const recipes = recentRecipes && recentRecipes.length > 0 ? recentRecipes : mockRecipes

  // Estados de loading e erro
  const isLoading = categoriesLoading || recipesLoading
  const hasError = categoriesError || recipesError

  // Log para debug
  // console.log('🔍 Debug HomePage:', {
  //   categoriesLoading,
  //   recipesLoading,
  //   categoriesError: categoriesError,
  //   recipesError: recipesError,
  //   categoriesCount: categories?.length || 0,
  //   recipesCount: recentRecipes?.length || 0,
  //   usingMockCategories: !categories || categories.length === 0,
  //   usingMockRecipes: !recentRecipes || recentRecipes.length === 0,
  // })

  // Função para tentar novamente
  const handleRetry = () => {
    refetchCategories()
    refetchRecipes()
  }

  // Se houver erro, usar dados mockados em vez de mostrar tela de erro
  // if (hasError) {
  //   console.warn('⚠️ Erro ao carregar dados da API, usando dados mockados:', {
  //     categoriesError: categoriesError,
  //     recipesError: recipesError,
  //   })
  // }

  // Loading state
  if (isLoading) {
    return (
      <Box className='flex-1 bg-white justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
        <Text className='mt-4 text-gray-600'>Carregando...</Text>
      </Box>
    )
  }

  // Error state
  // if (hasError) {
  //   console.log(hasError)
  //   return (
  //     <Box className='flex-1 bg-white justify-center items-center px-6'>
  //       <Ionicons name='alert-circle' size={48} color='#EF4444' />
  //       <Text className='mt-4 text-center text-gray-600 mb-4'>
  //         Erro ao carregar dados. Tente novamente.
  //       </Text>
  //       <TouchableOpacity
  //         onPress={handleRetry}
  //         className='bg-purple-500 px-6 py-3 rounded-lg'
  //       >
  //         <Text className='text-white font-medium'>Tentar Novamente</Text>
  //       </TouchableOpacity>
  //     </Box>
  //   )
  // }

  return (
    <Box className='flex-1 bg-white'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRetry}
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
            {(categoriesLoading || recipesLoading) && (
              <ActivityIndicator size='small' color='#8B5CF6' />
            )}
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
        <VStack className='px-6 mb-6'>
          <Text className='text-lg font-bold text-gray-900 mb-4'>
            Navegar por Categoria
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            <HStack className='space-x-6 px-2 gap-4'>
              {browseCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className='items-center'
                  onPress={() => onCategoryPress?.(category)}
                >
                  <Box
                    className={`w-16 h-16 ${category.color} rounded-full items-center justify-center mb-2`}
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
        <VStack className='px-6 my-6'>
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
              recipes.map((recipe) => (
                <TouchableOpacity key={recipe.id} onPress={() => onRecipePress?.(recipe)}>
                  <Card className='overflow-hidden'>
                    <HStack className='space-x-4'>
                      <Image
                        source={{ uri: recipe.image }}
                        className='w-24 h-24 rounded-lg'
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
                                by {recipe.author}
                              </Text>
                            </HStack>
                            <Text className='font-semibold text-gray-900'>
                              {recipe.title}
                            </Text>
                            <HStack className='items-center space-x-3 gap-2'>
                              <HStack className='items-center space-x-1'>
                                <Ionicons name='star' size={14} color='#FBBF24' />
                                <Text className='text-xs text-gray-600'>
                                  {recipe.rating}
                                </Text>
                              </HStack>
                              <HStack className='items-center space-x-1'>
                                <Ionicons name='time' size={14} color='#6B7280' />
                                <Text className='text-xs text-gray-600'>
                                  {recipe.time}
                                </Text>
                              </HStack>
                            </HStack>
                          </VStack>
                          <VStack className='items-end space-y-2'>
                            <TouchableOpacity onPress={() => onRecipeLike?.(recipe)}>
                              <Box className='w-6 h-6 bg-gray-100 rounded-full items-center justify-center'>
                                <Ionicons
                                  name='heart-outline'
                                  size={12}
                                  color='#6B7280'
                                />
                              </Box>
                            </TouchableOpacity>
                            <HStack className='items-center space-x-1'>
                              <Ionicons name='heart' size={12} color='#EF4444' />
                              <Text className='text-xs text-gray-600'>
                                {recipe.likes}
                              </Text>
                            </HStack>
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
