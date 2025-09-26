import { Ionicons } from '@expo/vector-icons'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import type { Recipe } from '@/types/api'

interface RecipeDetailViewProps {
  recipe: Recipe
  isLoading: boolean
  onBack: () => void
  onLike: () => void
  onAddReview: (rating: number, comment: string) => void
  onToggleHelpful: (reviewId: string) => void
}

export function RecipeDetailView({
  recipe,
  isLoading,
  onBack,
  onLike,
  onAddReview: _onAddReview,
  onToggleHelpful,
}: RecipeDetailViewProps) {
  if (isLoading) {
    return (
      <View className='flex-1 bg-white justify-center items-center'>
        <Text className='text-gray-600'>Carregando receita...</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-white'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='relative'>
          <Image
            source={{ uri: recipe.image }}
            className='w-full h-64'
            resizeMode='cover'
          />
          <TouchableOpacity
            onPress={onBack}
            className='absolute top-12 left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center'
          >
            <Ionicons name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onLike}
            className='absolute top-12 right-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center'
          >
            <Ionicons
              name={recipe.isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={recipe.isLiked ? '#EF4444' : 'white'}
            />
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <View className='px-6 py-4 space-y-4'>
          {/* Título */}
          <View className='space-y-2'>
            <Text className='text-2xl font-bold text-gray-900'>
              {recipe.title || 'Título não disponível'}
            </Text>
            <Text className='text-gray-600 pt-2'>
              {recipe.description || 'Descrição não disponível'}
            </Text>
          </View>

          {/* Autor e rating */}
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center space-x-3'>
              <Image
                source={{ uri: recipe.author.avatar || 'https://via.placeholder.com/40' }}
                className='w-10 h-10 rounded-full'
              />
              <View>
                <Text className='font-semibold text-gray-900'>
                  {recipe.author?.name || 'Autor desconhecido'}
                </Text>
                <Text className='text-sm text-gray-500'>
                  {recipe.createdAt
                    ? new Date(recipe.createdAt).toLocaleDateString('pt-BR')
                    : 'Data não disponível'}
                </Text>
              </View>
            </View>
            <View className='flex-row items-center space-x-1'>
              <Ionicons name='star' size={16} color='#F59E0B' />
              <Text className='font-semibold text-gray-900'>
                {recipe.rating ? recipe.rating.toFixed(1) : '0.0'}
              </Text>
              <Text className='text-sm text-gray-500'>({recipe.totalRatings || 0})</Text>
            </View>
          </View>

          {/* Estatísticas */}
          <View className='flex-row justify-between py-4'>
            <View className='items-center'>
              <Ionicons name='time' size={24} color='#6B7280' />
              <Text className='text-sm font-semibold text-gray-900'>
                {recipe.prepMinutes || 0}min
              </Text>
              <Text className='text-xs text-gray-500'>Preparo</Text>
            </View>
            <View className='items-center'>
              <Ionicons name='timer' size={24} color='#6B7280' />
              <Text className='text-sm font-semibold text-gray-900'>
                {recipe.cookMinutes || 0}min
              </Text>
              <Text className='text-xs text-gray-500'>Cozimento</Text>
            </View>
            <View className='items-center'>
              <Ionicons name='people' size={24} color='#6B7280' />
              <Text className='text-sm font-semibold text-gray-900'>
                {recipe.servings || 0}
              </Text>
              <Text className='text-xs text-gray-500'>Porções</Text>
            </View>
            <View className='items-center'>
              <Ionicons name='heart' size={24} color='#EF4444' />
              <Text className='text-sm font-semibold text-gray-900'>
                {recipe.likes || 0}
              </Text>
              <Text className='text-xs text-gray-500'>Curtidas</Text>
            </View>
          </View>

          {/* Ingredientes */}
          <View className='bg-white rounded-lg p-4 shadow-sm'>
            <Text className='text-lg font-bold text-gray-900 mb-3'>Ingredientes</Text>
            {recipe.ingredients.map((ingredient) => (
              <View key={ingredient.id} className='flex-row items-center space-x-3 mb-2'>
                <View className='w-2 h-2 bg-purple-500 rounded-full' />
                <Text>
                  {ingredient.amount && ingredient.unit
                    ? `${ingredient.amount} ${ingredient.unit} de ${ingredient.name ?? 'Ingrediente'}`
                    : (ingredient.name ?? 'Ingrediente')}
                </Text>
                {ingredient.note && (
                  <Text className='text-sm text-gray-500 italic'>
                    ({ingredient.note})
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Instruções */}
          <View className='bg-white rounded-lg p-4 shadow-sm'>
            <Text className='text-lg font-bold text-gray-900 mb-3'>Modo de Preparo</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={instruction.id} className='flex-row space-x-4 mb-3'>
                <View className='w-8 h-8 bg-purple-500 rounded-full items-center justify-center'>
                  <Text className='text-white font-bold text-sm'>{index + 1}</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-gray-700'>
                    {String(instruction.description || 'Instrução não disponível')}
                  </Text>
                  {instruction.durationMinutes !== undefined &&
                    instruction.durationMinutes !== null && (
                      <Text className='text-sm text-gray-500'>
                        Tempo: {instruction.durationMinutes} minutos
                      </Text>
                    )}
                </View>
              </View>
            ))}
          </View>

          {/* Nutrição */}
          {(recipe.calories ||
            recipe.proteinGrams ||
            recipe.carbGrams ||
            recipe.fatGrams) && (
            <View className='bg-white rounded-lg p-4 shadow-sm'>
              <Text className='text-lg font-bold text-gray-900 mb-3'>
                Informações Nutricionais
              </Text>
              <View className='flex-row justify-between'>
                {recipe.calories && (
                  <View className='items-center'>
                    <Text className='text-2xl font-bold text-purple-600'>
                      {recipe.calories}
                    </Text>
                    <Text className='text-sm text-gray-500'>Calorias</Text>
                  </View>
                )}
                {recipe.proteinGrams && (
                  <View className='items-center'>
                    <Text className='text-2xl font-bold text-red-500'>
                      {recipe.proteinGrams}g
                    </Text>
                    <Text className='text-sm text-gray-500'>Proteína</Text>
                  </View>
                )}
                {recipe.carbGrams && (
                  <View className='items-center'>
                    <Text className='text-2xl font-bold text-yellow-500'>
                      {recipe.carbGrams}g
                    </Text>
                    <Text className='text-sm text-gray-500'>Carboidratos</Text>
                  </View>
                )}
                {recipe.fatGrams && (
                  <View className='items-center'>
                    <Text className='text-2xl font-bold text-green-500'>
                      {recipe.fatGrams}g
                    </Text>
                    <Text className='text-sm text-gray-500'>Gorduras</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Avaliações */}
          <View className='bg-white rounded-lg p-4 shadow-sm'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-lg font-bold text-gray-900'>
                Avaliações ({recipe.reviews.length})
              </Text>
              <TouchableOpacity className='bg-purple-500 px-4 py-2 rounded-lg'>
                <Text className='text-white font-semibold'>Avaliar</Text>
              </TouchableOpacity>
            </View>

            {recipe.reviews.length === 0 ? (
              <View className='py-8 items-center'>
                <Ionicons name='chatbubble-outline' size={48} color='#9CA3AF' />
                <Text className='mt-2 text-gray-500 text-center'>
                  Nenhuma avaliação ainda
                </Text>
                <Text className='text-sm text-gray-400 text-center'>
                  Seja o primeiro a avaliar esta receita!
                </Text>
              </View>
            ) : (
              recipe.reviews.map((review) => (
                <View key={review.id} className='border-b border-gray-200 pb-4 mb-4'>
                  <View className='flex-row justify-between items-start mb-2'>
                    <View className='flex-row items-center space-x-3'>
                      <Image
                        source={{
                          uri: review.user.avatar || 'https://via.placeholder.com/32',
                        }}
                        className='w-8 h-8 rounded-full'
                      />
                      <View>
                        <Text className='font-semibold text-gray-900'>
                          {review.user.name}
                        </Text>
                        <View className='flex-row items-center space-x-1'>
                          {[...Array(5)].map((_, i) => (
                            <Ionicons
                              key={`star-${review.id}-${i}`}
                              name={i < review.rating ? 'star' : 'star-outline'}
                              size={14}
                              color='#F59E0B'
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text className='text-sm text-gray-500'>
                      {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  {review.comment && (
                    <Text className='text-gray-700 mb-2'>{review.comment}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => onToggleHelpful(review.id)}
                    className='flex-row items-center space-x-1'
                  >
                    <Ionicons
                      name={review.isHelpful ? 'thumbs-up' : 'thumbs-up-outline'}
                      size={16}
                      color={review.isHelpful ? '#10B981' : '#6B7280'}
                    />
                    <Text className='text-sm text-gray-600'>
                      Útil ({review.helpfulCount})
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
