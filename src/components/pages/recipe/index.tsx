import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { RecipeDetailView } from './RecipeDetailView'
import { useRecipeDetail } from './useRecipeDetail'

export function RecipeDetailPage() {
  const params = useLocalSearchParams()
  const id = (params.id as string) || ''

  const { recipe, isLoading, error, onLike, onAddReview, onToggleHelpful, onBack } =
    useRecipeDetail({ recipeId: id })

  if (error) {
    return (
      <View className='flex-1 bg-zinc-50 justify-center items-center px-6'>
        <Ionicons name='alert-circle' size={48} color='#EF4444' />
        <Text className='mt-4 text-lg font-semibold text-gray-900 text-center'>
          Erro ao carregar receita
        </Text>
        <Text className='mt-2 text-gray-500 text-center'>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Text>
        <TouchableOpacity
          onPress={onBack}
          className='mt-6 bg-purple-500 px-6 py-3 rounded-lg'
        >
          <Text className='text-white font-semibold text-center'>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!isLoading && !recipe) {
    return (
      <View className='flex-1 bg-zinc-50 justify-center items-center px-6'>
        <Ionicons name='restaurant-outline' size={48} color='#9CA3AF' />
        <Text className='mt-4 text-lg font-semibold text-gray-900 text-center'>
          Receita não encontrada
        </Text>
        <Text className='mt-2 text-gray-500 text-center'>
          A receita que você está procurando não existe.
        </Text>
        <TouchableOpacity
          onPress={onBack}
          className='mt-6 bg-purple-500 px-6 py-3 rounded-lg'
        >
          <Text className='text-white font-semibold text-center'>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <RecipeDetailView
      recipe={recipe || ({} as any)}
      isLoading={isLoading}
      onBack={onBack}
      onLike={onLike}
      onAddReview={onAddReview}
      onToggleHelpful={onToggleHelpful}
    />
  )
}
