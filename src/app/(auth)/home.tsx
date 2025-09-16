import { Ionicons } from '@expo/vector-icons'
import { Image, ScrollView, TouchableOpacity } from 'react-native'

import { Box } from '@/components/ui/box'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

export default function Home() {
  const browseCategories = [
    { id: 1, name: 'Italiana', icon: 'pizza', color: 'bg-red-100', iconColor: '#EF4444' },
    {
      id: 2,
      name: 'Mexicana',
      icon: 'flame',
      color: 'bg-yellow-100',
      iconColor: '#EAB308',
    },
    {
      id: 3,
      name: 'Sobremesas',
      icon: 'ice-cream',
      color: 'bg-pink-100',
      iconColor: '#EC4899',
    },
    { id: 4, name: 'Vegana', icon: 'leaf', color: 'bg-green-100', iconColor: '#22C55E' },
    {
      id: 5,
      name: 'Frutos do Mar',
      icon: 'fish',
      color: 'bg-blue-100',
      iconColor: '#3B82F6',
    },
  ]

  const recentRecipes = [
    {
      id: 1,
      title: 'Bowl Buda Arco-íris',
      author: 'Emma Chen',
      rating: 4.7,
      time: '15 min',
      likes: 142,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Bolo de Chocolate Derretido',
      author: 'Marcus Johnson',
      rating: 4.9,
      time: '30 min',
      likes: 287,
      image:
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    },
  ]

  return (
    <Box className='flex-1 bg-white'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <HStack className='justify-between items-center px-6 py-10'>
          <HStack className='items-center space-x-3'>
            <Box className='w-8 h-8 bg-purple-500 rounded-lg items-center justify-center'>
              <Ionicons name='restaurant' size={20} color='white' />
            </Box>
            <Text className='text-xl font-bold pl-4 text-gray-900'>One Plate</Text>
          </HStack>
          <HStack className='space-x-5 gap-4'>
            <TouchableOpacity>
              <Ionicons name='search' size={24} color='#374151' />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name='notifications' size={24} color='#374151' />
            </TouchableOpacity>
          </HStack>
        </HStack>

        {/* Category Filters */}
        {/* <HStack className='justify-around px-6 py-6'>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} className='items-center flex-1'>
              <Box
                className={`w-16 h-16 ${category.color} rounded-full items-center justify-center mb-2`}
              >
                <Ionicons
                  name={category.icon as any}
                  size={24}
                  color={category.iconColor}
                />
              </Box>
              <Text className='text-xs text-gray-600 text-center'>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </HStack> */}

        {/* Featured Recipe */}
        <Box className='mx-6 mb-6'>
          <HStack className='bg-gray-100 rounded-xl px-4 py-3 items-center space-x-3'>
            <Ionicons name='search' size={22} color='#8B5CF6' />
            <Box className='flex-1'>
              <Text className='text-gray-500 text-base' numberOfLines={1}>
                Buscar receitas, ingredientes...
              </Text>
            </Box>
            <TouchableOpacity>
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
                <TouchableOpacity key={category.id} className='items-center'>
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
            <TouchableOpacity>
              <Text className='text-blue-500 font-medium'>Ver Todas</Text>
            </TouchableOpacity>
          </HStack>

          <VStack className='space-y-5'>
            {recentRecipes.map((recipe) => (
              <Card key={recipe.id} className='overflow-hidden'>
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
                            <Text className='text-xs text-gray-600'>{recipe.rating}</Text>
                          </HStack>
                          <HStack className='items-center space-x-1'>
                            <Ionicons name='time' size={14} color='#6B7280' />
                            <Text className='text-xs text-gray-600'>{recipe.time}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                      <VStack className='items-end space-y-2'>
                        <TouchableOpacity>
                          <Box className='w-6 h-6 bg-gray-100 rounded-full items-center justify-center'>
                            <Ionicons name='heart-outline' size={12} color='#6B7280' />
                          </Box>
                        </TouchableOpacity>
                        <HStack className='items-center space-x-1'>
                          <Ionicons name='heart' size={12} color='#EF4444' />
                          <Text className='text-xs text-gray-600'>{recipe.likes}</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  )
}
