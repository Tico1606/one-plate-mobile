import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { ImageCarousel } from '@/components/ui/image-carousel'
import { useAddToShoppingList } from '@/hooks/useAddToShoppingList'
import type { CreateReviewFormData } from '@/lib/validations/review'
import type { Recipe, Review } from '@/types/api'
import { AddReviewModal } from './AddReviewModal'
import { AdjustServingsModal } from './AdjustServingsModal'

// Função para extrair as URLs das imagens da receita
function getRecipeImages(recipe: Recipe): string[] {
  // Se há fotos ordenadas, usar elas
  if (recipe.photos && recipe.photos.length > 0) {
    return recipe.photos.sort((a, b) => a.order - b.order).map((photo) => photo.url)
  }

  // Fallback para a imagem principal
  if (recipe.image) {
    return [recipe.image]
  }

  // Se não há imagens, retornar array vazio
  return []
}

interface RecipeDetailViewProps {
  recipe: Recipe
  isLoading: boolean
  isTogglingFavorite?: boolean
  isAddingReview?: boolean
  showReviewModal: boolean
  isLiked: boolean
  hasUserReviewed?: boolean
  user?: { id: string } | null
  editingReview?: any
  onBack: () => void
  onLike: () => void
  onOpenReviewModal: () => void
  onCloseReviewModal: () => void
  onAddReview: (data: CreateReviewFormData) => Promise<void>
  onEditReview?: (review: Review) => void
  onToggleHelpful: (reviewId: string) => void
}

export function RecipeDetailView({
  recipe,
  isLoading,
  isTogglingFavorite = false,
  isAddingReview = false,
  showReviewModal,
  isLiked,
  hasUserReviewed = false,
  user,
  editingReview,
  onBack,
  onLike,
  onOpenReviewModal,
  onCloseReviewModal,
  onAddReview,
  onEditReview,
  onToggleHelpful,
}: RecipeDetailViewProps) {
  const router = useRouter()
  const { addRecipeIngredients } = useAddToShoppingList()
  const [showAdjustServingsModal, setShowAdjustServingsModal] = useState(false)

  const handleAddToShoppingList = () => {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return
    }

    // Abrir modal para ajustar porções
    setShowAdjustServingsModal(true)
  }

  const handleConfirmAdjustServings = (
    ingredients: Array<{ name: string; quantity?: string; unit?: string }>,
    recipeId: string,
    recipeName: string,
  ) => {
    addRecipeIngredients(ingredients, recipeId, recipeName)
  }

  const handleShareWhatsApp = () => {
    const recipeTitle = recipe.title || 'Receita deliciosa'
    const recipeDescription = recipe.description || ''
    const prepTime = recipe.prepTime ? `${recipe.prepTime}min` : ''
    const servings = recipe.servings ? `Serve ${recipe.servings} porções` : ''
    const difficulty = recipe.difficulty ? `Dificuldade: ${recipe.difficulty}` : ''

    // Formatar ingredientes
    const ingredientsList =
      recipe.ingredients
        ?.map((ing) => {
          if (ing.amount && ing.unit) {
            return `• ${ing.amount} ${ing.unit} de ${ing.name}`
          }
          return `• ${ing.name}`
        })
        .join('\n') || ''

    // Formatar instruções
    const instructionsList =
      recipe.instructions
        ?.map((inst, index) => `${index + 1}. ${inst.description}`)
        .join('\n\n') || ''

    const message = `🍽️ *${recipeTitle}*\n\n${recipeDescription}\n\n${
      prepTime ? `⏱️ ${prepTime}` : ''
    }${servings ? ` | ${servings}` : ''}${difficulty ? ` | ${difficulty}` : ''}\n\n📋 *Ingredientes:*\n${ingredientsList}\n\n👨‍🍳 *Modo de Preparo:*\n${instructionsList}\n\n_Compartilhado do One Plate_`

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url)
        } else {
          // Se o WhatsApp não estiver instalado, tenta abrir o WhatsApp Web
          const webUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
          return Linking.openURL(webUrl)
        }
      })
      .catch((err) => {
        console.error('Erro ao compartilhar no WhatsApp:', err)
      })
  }
  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text className='text-gray-600'>Carregando receita...</Text>
      </View>
    )
  }
  return (
    <View className='flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='relative border-b border-gray-200'>
          <ImageCarousel
            images={getRecipeImages(recipe)}
            height={256}
            showIndicators={true}
            showNavigation={false}
          />
          <TouchableOpacity
            onPress={onBack}
            className='absolute top-12 left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center'
          >
            <Ionicons name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
          <View className='absolute top-12 right-4 flex-row items-center gap-2'>
            <TouchableOpacity
              onPress={handleShareWhatsApp}
              className='w-10 h-10 bg-black/50 rounded-full items-center justify-center'
            >
              <Ionicons name='logo-whatsapp' size={24} color='#25D366' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLike}
              disabled={isTogglingFavorite}
              className='w-10 h-10 bg-black/50 rounded-full items-center justify-center'
            >
              {isTogglingFavorite ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isLiked ? '#EF4444' : 'white'}
                />
              )}
            </TouchableOpacity>
          </View>
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
          <View className='flex-row items-center justify-between px-2 pt-3'>
            <View className='flex-row items-center space-x-3 gap-3'>
              <Image
                source={{
                  uri: recipe.author.photoUrl || 'https://via.placeholder.com/40',
                }}
                className='w-10 h-10 rounded-full border border-gray-400'
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
                {recipe.averageRating ? recipe.averageRating.toFixed(1) : '0.0'}
              </Text>
              <Text className='text-sm text-gray-500'>({recipe.totalReviews || 0})</Text>
            </View>
          </View>

          {/* Estatísticas */}
          <View className='flex-row justify-between px-1 py-4'>
            <View className='items-center'>
              <Ionicons name='time' size={24} color='#6B7280' />
              <Text className='text-sm font-semibold text-gray-900'>
                {recipe.prepTime || 0}min
              </Text>
              <Text className='text-xs text-gray-500'>Preparo</Text>
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
                {recipe.totalFavorites || 0}
              </Text>
              <Text className='text-xs text-gray-500'>Favoritos</Text>
            </View>
            <View className='items-center'>
              <Ionicons name='extension-puzzle' size={24} color='#6B7280' />
              <Text className='text-sm font-semibold text-gray-900'>
                {recipe.difficulty || 'Dificuldade não disponível'}
              </Text>
              <Text className='text-xs text-gray-500'>Dificuldade</Text>
            </View>
          </View>

          {/* Ingredientes */}
          <View className='bg-white rounded-t-lg p-4 shadow-sm'>
            <HStack className='justify-between items-center mb-3'>
              <Text className='text-lg font-bold text-gray-900'>Ingredientes</Text>
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <Button
                  onPress={handleAddToShoppingList}
                  size='sm'
                  className='bg-orange-500'
                >
                  <HStack className='items-center space-x-1 gap-1'>
                    <Ionicons name='basket-outline' size={16} color='white' />
                    <ButtonText className='text-white text-sm'>
                      Adicionar à Lista
                    </ButtonText>
                  </HStack>
                </Button>
              )}
            </HStack>
            {recipe.ingredients?.map((ingredient) => (
              <View
                key={ingredient.id}
                className='flex-row items-center space-x-3 mb-2 gap-2'
              >
                <View className='w-2 h-2 bg-purple-500 rounded-full' />
                <Text>
                  {ingredient.amount && ingredient.unit
                    ? `${ingredient.amount} ${ingredient.unit} de ${ingredient.name ?? 'Ingrediente'}`
                    : (ingredient.name ?? 'Ingrediente')}
                </Text>
              </View>
            )) || []}
          </View>

          {/* Instruções */}
          <View className='bg-white p-4 shadow-sm gap-1'>
            <HStack className='justify-between items-center mb-3'>
              <Text className='text-lg font-bold text-gray-900'>Modo de Preparo</Text>
              {recipe.instructions && recipe.instructions.length > 0 && (
                <Button
                  onPress={() =>
                    router.push(`/(auth)/recipe-cooking-[id]?id=${recipe.id}`)
                  }
                  size='sm'
                  className='bg-purple-500'
                >
                  <HStack className='items-center space-x-1 gap-1'>
                    <Ionicons name='play-circle-outline' size={16} color='white' />
                    <ButtonText className='text-white text-sm'>
                      Modo Passo a Passo
                    </ButtonText>
                  </HStack>
                </Button>
              )}
            </HStack>
            {recipe.instructions?.map((instruction, index) => (
              <View key={instruction.id} className='flex-row space-x-4 mb-3 gap-2'>
                <View className='w-8 h-8 bg-purple-500 rounded-full items-center justify-center'>
                  <Text className='text-white font-bold text-sm'>{index + 1}</Text>
                </View>
                <View className='flex-1'>
                  <Text className='text-gray-700'>
                    {String(instruction.description || 'Instrução não disponível')}
                  </Text>
                  {instruction.durationSec !== undefined &&
                    instruction.durationSec !== null && (
                      <Text className='text-sm text-gray-500'>
                        Tempo: {Math.round(instruction.durationSec / 60)} minutos
                      </Text>
                    )}
                </View>
              </View>
            )) || []}
          </View>

          {/* Nutrição */}
          {(recipe.calories ||
            recipe.proteinGrams ||
            recipe.carbGrams ||
            recipe.fatGrams) && (
            <View className='bg-white p-4 shadow-sm'>
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
          <View className='bg-white rounded-b-lg p-4 pt-6 mb-6 border-t border-gray-200'>
            <View className='flex-row justify-between items-center mb-4'>
              <View className='flex-row items-center'>
                <Text className='text-lg font-bold text-gray-900'>
                  Avaliações ({recipe.reviews?.length || 0})
                </Text>
                {isAddingReview && (
                  <ActivityIndicator size='small' color='#8B5CF6' className='ml-2' />
                )}
              </View>
              <TouchableOpacity
                onPress={onOpenReviewModal}
                disabled={isAddingReview || hasUserReviewed}
                className={`px-4 py-2 rounded-lg flex-row items-center justify-center ${
                  isAddingReview || hasUserReviewed ? 'bg-gray-400' : 'bg-purple-500'
                }`}
              >
                {hasUserReviewed && !isAddingReview && (
                  <Ionicons
                    name='checkmark-circle'
                    size={16}
                    color='white'
                    className='mr-1'
                  />
                )}
                <Text className='text-white font-semibold'>
                  {isAddingReview
                    ? 'Enviando...'
                    : hasUserReviewed
                      ? 'Já Avaliado'
                      : 'Avaliar'}
                </Text>
              </TouchableOpacity>
            </View>

            {!recipe.reviews || recipe.reviews.length === 0 ? (
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
                  <View className='flex-row justify-between items-start mb-4 gap-4'>
                    <View className='flex-row items-center space-x-3 gap-2'>
                      <Image
                        source={{
                          uri: review.user.photoUrl || 'https://via.placeholder.com/32',
                        }}
                        className='w-8 h-8 rounded-full border border-gray-400'
                      />
                      <View>
                        <View className='flex-row items-center space-x-2'>
                          <Text className='font-semibold text-gray-900'>
                            {review.user.name}
                          </Text>
                        </View>
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
                    <View className='flex-row items-center space-x-2 gap-2 px-1'>
                      <Text className='text-sm text-gray-500'>
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </Text>
                      {/* Ícone de edição para avaliação do usuário atual */}
                      {user?.id === review.user.id && (
                        <TouchableOpacity
                          onPress={() => onEditReview?.(review)}
                          className='p-2 bg-gray-100 rounded-full active:bg-purple-100'
                          style={{ minWidth: 32, minHeight: 32 }}
                          accessibilityLabel='Editar avaliação'
                          accessibilityHint='Toque para editar sua avaliação'
                        >
                          <Ionicons name='pencil' size={20} color='#8B5CF6' />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {review.comment && (
                    <Text className='text-gray-700 mb-2'>{review.comment}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => onToggleHelpful(review.id)}
                    className='flex-row items-center space-x-1 pt-2 pl-1 gap-1'
                  />
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <AddReviewModal
        visible={showReviewModal}
        isLoading={isAddingReview}
        onClose={onCloseReviewModal}
        onSubmit={onAddReview}
        recipeName={recipe.title}
        editingReview={editingReview}
      />

      <AdjustServingsModal
        visible={showAdjustServingsModal}
        originalServings={recipe.servings || 1}
        originalIngredients={recipe.ingredients || []}
        recipeId={recipe.id}
        recipeName={recipe.title || 'Receita'}
        onClose={() => setShowAdjustServingsModal(false)}
        onConfirm={handleConfirmAdjustServings}
      />
    </View>
  )
}
