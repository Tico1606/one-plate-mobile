import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { Header } from '@/components/global/Header'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { VStack } from '@/components/ui/vstack'
import type { Difficulty } from '@/types/api'
import { ImageInput } from './ImageInput'
import { IngredientInput } from './IngredientInput'
import { InstructionInput } from './InstructionInput'
import { useCreateRecipe } from './useCreateRecipe'

export function CreateRecipeView() {
  const {
    formData,
    isPublishing,
    isSavingDraft,
    categories,
    categoriesLoading,
    validationErrors,
    ingredientErrors,
    loadCategories,
    updateField,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addInstruction,
    updateInstruction,
    removeInstruction,
    addImage,
    removeImage,
    updateImage,
    toggleCategory,
    saveRecipe,
    saveRecipeAsDraft,
    clearForm,
  } = useCreateRecipe()

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const difficultyOptions = [
    { label: 'Fácil', value: 'EASY' as Difficulty },
    { label: 'Médio', value: 'MEDIUM' as Difficulty },
    { label: 'Difícil', value: 'HARD' as Difficulty },
  ]

  if (categoriesLoading) {
    return (
      <Box className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
        <Text className='mt-4 text-gray-600'>Carregando categorias...</Text>
      </Box>
    )
  }

  return (
    <Box className='flex-1 bg-zinc-100'>
      {/* Header */}
      <Header
        isLoading={isPublishing || isSavingDraft}
        onNotificationPress={() => {
          // TODO: Implementar notificações
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className='flex-1'
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack className='px-6 space-y-6'>
          {/* Erro geral */}
          {validationErrors.general && (
            <Card className='p-4 bg-red-50 border-red-200' variant='ghost'>
              <Text className='text-red-600 text-center font-medium'>
                {validationErrors.general}
              </Text>
            </Card>
          )}

          {/* Título */}
          <Card className='p-4 bg-white rounded-t-lg' variant='ghost'>
            <VStack className='space-y-2'>
              <Text className='font-medium text-gray-700 py-1'>Título</Text>
              <Input
                className={`bg-gray-50 ${validationErrors.title ? 'border-red-500' : 'border-gray-200'}`}
              >
                <InputField
                  value={formData.title}
                  onChangeText={(value: string) => updateField('title', value)}
                  placeholder='Qual o nome de sua receita?'
                />
              </Input>
              {validationErrors.title && (
                <Text className='text-red-500 text-sm'>{validationErrors.title}</Text>
              )}
            </VStack>
          </Card>

          {/* Descrição */}
          <Card className='p-4 bg-white' variant='ghost'>
            <VStack className='space-y-2'>
              <Text className='font-medium text-gray-700 py-1'>Descrição</Text>
              <Textarea className='bg-gray-50 border-gray-200 min-h-[80px]'>
                <TextareaInput
                  value={formData.description}
                  onChangeText={(value: string) => updateField('description', value)}
                  placeholder='Conte um pouco sobre sua receita...'
                  numberOfLines={4}
                />
              </Textarea>
            </VStack>
          </Card>

          {/* Dificuldade */}
          <Card className='p-4 bg-white' variant='ghost'>
            <VStack className='space-y-4'>
              <Text className='font-medium text-gray-700'>Dificuldade</Text>
              <HStack className='space-x-3 gap-2'>
                {difficultyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => updateField('difficulty', option.value)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                      formData.difficulty === option.value
                        ? 'bg-purple-100 border-purple-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-center font-medium ${
                        formData.difficulty === option.value
                          ? 'text-purple-700'
                          : 'text-gray-600'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </HStack>
            </VStack>
          </Card>

          {/* Tempo de Preparo e Porções */}
          <Card className='p-4 bg-white' variant='ghost'>
            <VStack className='space-y-4'>
              <HStack className='space-x-4 gap-4'>
                <VStack className='flex-1 space-y-2'>
                  <Text className='font-medium text-gray-700 py-1'>Preparo em (min)</Text>
                  <Input
                    className={`bg-gray-50 ${validationErrors.preparationTime ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    <InputField
                      value={
                        formData.preparationTime === 0
                          ? ''
                          : formData.preparationTime.toString()
                      }
                      onChangeText={(value: string) =>
                        updateField('preparationTime', parseInt(value || '0'))
                      }
                      placeholder='30'
                      keyboardType='numeric'
                    />
                  </Input>
                  {validationErrors.preparationTime && (
                    <Text className='text-red-500 text-sm'>
                      {validationErrors.preparationTime}
                    </Text>
                  )}
                </VStack>

                <VStack className='flex-1 space-y-2'>
                  <Text className='font-medium text-gray-700 py-1'>Porções</Text>
                  <Input
                    className={`bg-gray-50 ${validationErrors.servings ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    <InputField
                      value={formData.servings === 0 ? '' : formData.servings.toString()}
                      onChangeText={(value: string) =>
                        updateField('servings', parseInt(value || '0'))
                      }
                      placeholder='1'
                      keyboardType='numeric'
                    />
                  </Input>
                  {validationErrors.servings && (
                    <Text className='text-red-500 text-sm'>
                      {validationErrors.servings}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </VStack>
          </Card>

          {/* Informações Nutricionais */}
          <Card className='p-4 bg-white' variant='ghost'>
            <VStack className='space-y-4'>
              <Text className='font-medium text-gray-700 py-1'>
                Informações Nutricionais
              </Text>
              <VStack className='space-y-3'>
                <HStack className='space-x-4 gap-4'>
                  <VStack className='flex-1 space-y-2'>
                    <Text className='font-medium text-gray-700 py-1'>Calorias</Text>
                    <Input className='bg-gray-50 border-gray-200'>
                      <InputField
                        value={formData.calories?.toString() || ''}
                        onChangeText={(value: string) =>
                          updateField('calories', value ? parseFloat(value) : undefined)
                        }
                        placeholder='250'
                        keyboardType='numeric'
                      />
                    </Input>
                  </VStack>
                  <VStack className='flex-1 space-y-2'>
                    <Text className='font-medium text-gray-700 py-1'>Proteína (g)</Text>
                    <Input className='bg-gray-50 border-gray-200'>
                      <InputField
                        value={formData.proteinGrams?.toString() || ''}
                        onChangeText={(value: string) =>
                          updateField(
                            'proteinGrams',
                            value ? parseFloat(value) : undefined,
                          )
                        }
                        placeholder='8.5'
                        keyboardType='numeric'
                      />
                    </Input>
                  </VStack>
                </HStack>
                <HStack className='space-x-4 gap-4 py-2'>
                  <VStack className='flex-1 space-y-2'>
                    <Text className='font-medium text-gray-700 py-1'>
                      Carboidratos (g)
                    </Text>
                    <Input className='bg-gray-50 border-gray-200'>
                      <InputField
                        value={formData.carbGrams?.toString() || ''}
                        onChangeText={(value: string) =>
                          updateField('carbGrams', value ? parseFloat(value) : undefined)
                        }
                        placeholder='45.2'
                        keyboardType='numeric'
                      />
                    </Input>
                  </VStack>
                  <VStack className='flex-1 space-y-2'>
                    <Text className='font-medium text-gray-700 py-1'>Gordura (g)</Text>
                    <Input className='bg-gray-50 border-gray-200'>
                      <InputField
                        value={formData.fatGrams?.toString() || ''}
                        onChangeText={(value: string) =>
                          updateField('fatGrams', value ? parseFloat(value) : undefined)
                        }
                        placeholder='5.1'
                        keyboardType='numeric'
                      />
                    </Input>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </Card>

          {/* Categorias */}
          <Card className='p-4 bg-white' variant='ghost'>
            <VStack className='space-y-4'>
              <Text className='font-medium text-gray-700 py-1'>Categorias</Text>
              <Box className='flex-row flex-wrap gap-3'>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => toggleCategory(category.id)}
                    className={`py-2 px-4 rounded-lg border ${
                      formData.categoryIds.includes(category.id)
                        ? 'bg-purple-100 border-purple-500'
                        : 'bg-white border-gray-200'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        formData.categoryIds.includes(category.id)
                          ? 'text-purple-700'
                          : 'text-gray-600'
                      }`}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Box>
              {validationErrors.categoryIds && (
                <Text className='text-red-500 text-sm'>
                  {validationErrors.categoryIds}
                </Text>
              )}
            </VStack>
          </Card>

          {/* Ingredientes */}
          <Card className='p-4 bg-white' variant='ghost'>
            <VStack className='space-y-4'>
              <HStack className='items-center justify-between'>
                <Text className='text-lg font-bold text-gray-900'>Ingredientes</Text>
                <TouchableOpacity
                  onPress={addIngredient}
                  className='w-10 h-10 bg-purple-500 rounded-full items-center justify-center'
                  activeOpacity={1}
                >
                  <Ionicons name='add' size={20} color='white' />
                </TouchableOpacity>
              </HStack>

              <VStack className='space-y-4'>
                {formData.ingredients.length > 0 ? (
                  formData.ingredients.map((ingredient, index) => (
                    <IngredientInput
                      // biome-ignore lint/suspicious/noArrayIndexKey: a
                      key={index}
                      ingredient={ingredient}
                      index={index}
                      onUpdate={updateIngredient}
                      onRemove={removeIngredient}
                      canRemove={formData.ingredients.length > 1}
                      errors={ingredientErrors[index]}
                    />
                  ))
                ) : (
                  <Text className='text-gray-500 text-center py-4'>
                    Nenhum ingrediente adicionado
                  </Text>
                )}
              </VStack>
              {validationErrors.ingredients && (
                <Text className='text-red-500 text-sm'>
                  {validationErrors.ingredients}
                </Text>
              )}
            </VStack>
          </Card>

          {/* Instruções */}
          <Card className='p-4 bg-white rounded-b-lg' variant='ghost'>
            <VStack className='space-y-4'>
              <HStack className='items-center justify-between'>
                <Text className='text-lg font-bold text-gray-900'>Modo de Preparo</Text>
                <TouchableOpacity
                  onPress={addInstruction}
                  className='w-10 h-10 bg-purple-500 rounded-full items-center justify-center'
                  activeOpacity={1}
                >
                  <Ionicons name='add' size={20} color='white' />
                </TouchableOpacity>
              </HStack>

              <VStack className='space-y-4'>
                {formData.instructions.length > 0 ? (
                  formData.instructions.map((instruction, index) => (
                    <InstructionInput
                      // biome-ignore lint/suspicious/noArrayIndexKey: a
                      key={index}
                      instruction={instruction}
                      index={index}
                      onUpdate={updateInstruction}
                      onRemove={removeInstruction}
                      canRemove={formData.instructions.length > 1}
                    />
                  ))
                ) : (
                  <Text className='text-gray-500 text-center py-4'>
                    Nenhuma instrução adicionada
                  </Text>
                )}
              </VStack>
              {validationErrors.instructions && (
                <Text className='text-red-500 text-sm'>
                  {validationErrors.instructions}
                </Text>
              )}
            </VStack>
          </Card>

          {/* Imagens */}
          <Card className='p-4 bg-white' variant='ghost'>
            <VStack className='space-y-4'>
              <HStack className='items-center justify-between py-2'>
                <Text className='text-lg font-bold text-gray-900'>Imagens</Text>
                <TouchableOpacity
                  onPress={addImage}
                  className='w-10 h-10 bg-purple-500 rounded-full items-center justify-center'
                  activeOpacity={1}
                >
                  <Ionicons name='add' size={20} color='white' />
                </TouchableOpacity>
              </HStack>

              <VStack className='space-y-4'>
                {(formData.images || []).length > 0 ? (
                  (formData.images || []).map((image, index) => (
                    <ImageInput
                      // biome-ignore lint/suspicious/noArrayIndexKey: a
                      key={index}
                      image={image}
                      index={index}
                      onUpdate={updateImage}
                      onRemove={removeImage}
                      canRemove={(formData.images || []).length > 1}
                    />
                  ))
                ) : (
                  <Text className='text-gray-500 text-center py-4'>
                    Nenhuma imagem adicionada
                  </Text>
                )}
              </VStack>
            </VStack>
          </Card>

          {/* Vídeo */}
          <Card className='p-4 bg-white' variant='ghost'>
            <VStack className='space-y-2'>
              <Text className='font-medium text-gray-700 py-1'>URL do Vídeo</Text>
              <Input className='bg-gray-50 border-gray-200'>
                <InputField
                  value={formData.videoUrl}
                  onChangeText={(value: string) => updateField('videoUrl', value)}
                  placeholder='https://www.youtube.com/watch?v=...'
                />
              </Input>
            </VStack>
          </Card>

          {/* Botões de Ação */}
          <VStack className='space-y-3 py-6 gap-2'>
            <Button
              onPress={saveRecipe}
              disabled={isPublishing || isSavingDraft}
              className={`p-1 rounded-xl ${
                isPublishing
                  ? 'bg-purple-600'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {isPublishing ? (
                <HStack className='items-center space-x-3 gap-3'>
                  <ActivityIndicator
                    size='small'
                    color='white'
                  />
                  <Text className='text-white font-semibold text-lg tracking-normal'>
                    Publicando...
                  </Text>
                </HStack>
              ) : (
                <HStack className='items-center space-x-2 gap-2'>
                  <Ionicons name='cloud-upload-outline' size={20} color='white' />
                  <Text className='text-white font-medium text-lg tracking-normal'>
                    Publicar Receita
                  </Text>
                </HStack>
              )}
            </Button>

            <Button
              onPress={saveRecipeAsDraft}
              disabled={isPublishing || isSavingDraft}
              variant='outline'
              className={`border-purple-400 rounded-xl ${
                isSavingDraft
                  ? 'border-purple-500 bg-purple-50'
                  : 'hover:border-purple-500 hover:bg-purple-50'
              }`}
            >
              {isSavingDraft ? (
                <HStack className='items-center space-x-3 gap-3'>
                  <ActivityIndicator
                    size='small'
                    color='#a855f7'
                  />
                  <Text className='text-purple-500 font-medium text-lg tracking-normal'>
                    Salvando...
                  </Text>
                </HStack>
              ) : (
                <HStack className='items-center space-x-2 gap-2'>
                  <Ionicons name='document-text-outline' size={18} color='#a855f7' />
                  <Text className='text-purple-500 font-medium text-lg tracking-normal'>
                    Salvar como Rascunho
                  </Text>
                </HStack>
              )}
            </Button>

            <Button
              onPress={clearForm}
              disabled={isPublishing || isSavingDraft}
              variant='outline'
              className='border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50'
            >
              <HStack className='items-center space-x-2 gap-2'>
                <Ionicons name='refresh-outline' size={16} color='#6b7280' />
                <Text className='text-gray-700 font-medium'>Limpar</Text>
              </HStack>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  )
}
