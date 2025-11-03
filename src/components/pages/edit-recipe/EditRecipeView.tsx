import { Ionicons } from '@expo/vector-icons'
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
import { ImageInput } from '../create-recipe/ImageInput'
import { IngredientInput } from '../create-recipe/IngredientInput'
import { InstructionInput } from '../create-recipe/InstructionInput'
import { useEditRecipe } from './useEditRecipe'

export function EditRecipeView() {
  const {
    formData,
    isSaving,
    isLoadingRecipe,
    categories,
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
    clearForm,
    goBack,
  } = useEditRecipe()

  const difficultyOptions = [
    { label: 'Fácil', value: 'EASY' as Difficulty },
    { label: 'Médio', value: 'MEDIUM' as Difficulty },
    { label: 'Difícil', value: 'HARD' as Difficulty },
  ]

  if (isLoadingRecipe) {
    return (
      <Box className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
        <Text className='mt-4 text-gray-600'>Carregando receita...</Text>
      </Box>
    )
  }

  return (
    <Box className='flex-1 bg-zinc-100'>
      {/* Header */}
      <Header
        isLoading={isSaving}
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
          {/* Título da página com botão de voltar */}
          <HStack className='items-center justify-between mb-4'>
            <TouchableOpacity
              onPress={goBack}
              className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center'
              activeOpacity={0.7}
            >
              <Ionicons name='arrow-back' size={20} color='#6B7280' />
            </TouchableOpacity>
            <Text className='text-2xl font-extrabold text-purple-500 pb-1'>
              Editar Receita
            </Text>
            <Box className='w-10' />
          </HStack>

          {/* Título */}
          <Card className='p-4 bg-white rounded-t-lg' variant='ghost'>
            <VStack className='space-y-2'>
              <Text className='font-medium text-gray-700 py-1'>Título</Text>
              <Input className='bg-gray-50 border-gray-200'>
                <InputField
                  value={formData.title}
                  onChangeText={(value: string) => updateField('title', value)}
                  placeholder='Qual o nome de sua receita?'
                />
              </Input>
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
                  <Input className='bg-gray-50 border-gray-200'>
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
                </VStack>

                <VStack className='flex-1 space-y-2'>
                  <Text className='font-medium text-gray-700 py-1'>Porções</Text>
                  <Input className='bg-gray-50 border-gray-200'>
                    <InputField
                      value={formData.servings === 0 ? '' : formData.servings.toString()}
                      onChangeText={(value: string) =>
                        updateField('servings', parseInt(value || '0'))
                      }
                      placeholder='1'
                      keyboardType='numeric'
                    />
                  </Input>
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
                      // biome-ignore lint/suspicious/noArrayIndexKey: Ingredientes podem ser reordenados e não têm IDs únicos até serem salvos
                      key={index}
                      ingredient={ingredient}
                      index={index}
                      onUpdate={updateIngredient}
                      onRemove={removeIngredient}
                      canRemove={formData.ingredients.length > 1}
                    />
                  ))
                ) : (
                  <Text className='text-gray-500 text-center py-4'>
                    Nenhum ingrediente adicionado
                  </Text>
                )}
              </VStack>
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
                      // biome-ignore lint/suspicious/noArrayIndexKey: Instruções podem ser reordenadas e não têm IDs únicos até serem salvas
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
                {formData.images.length > 0 ? (
                  formData.images.map((image, index) => (
                    <ImageInput
                      // biome-ignore lint/suspicious/noArrayIndexKey: Imagens podem ser reordenadas e não têm IDs únicos até serem salvas
                      key={index}
                      image={image}
                      index={index}
                      onUpdate={updateImage}
                      onRemove={removeImage}
                      canRemove={formData.images.length > 1}
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
              disabled={isSaving}
              className='bg-purple-500 p-1 rounded-xl'
            >
              {isSaving ? (
                <HStack className='items-center space-x-2'>
                  <ActivityIndicator size='small' color='white' />
                  <Text className='text-white font-semibold'>Salvando...</Text>
                </HStack>
              ) : (
                <Text className='text-white font-medium text-lg tracking-normal'>
                  Salvar Alterações
                </Text>
              )}
            </Button>

            <Button
              onPress={clearForm}
              disabled={isSaving}
              variant='outline'
              className='border-gray-300 rounded-xl'
            >
              <Text className='text-gray-700 font-medium'>Limpar</Text>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  )
}
