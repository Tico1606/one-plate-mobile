import { Ionicons } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from 'react'
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { ModalBackdrop } from '@/components/ui/modal'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type { RecipeIngredient } from '@/types/api'

interface AdjustedIngredient {
  id: string
  name: string
  originalAmount?: number
  adjustedAmount?: number
  unit?: string
  isEditable: boolean
}

interface AdjustServingsModalProps {
  visible: boolean
  originalServings: number
  originalIngredients: RecipeIngredient[]
  recipeId: string
  recipeName: string
  onClose: () => void
  onConfirm: (
    ingredients: Array<{ name: string; quantity?: string; unit?: string }>,
    recipeId: string,
    recipeName: string,
  ) => void
}

export function AdjustServingsModal({
  visible,
  originalServings,
  originalIngredients,
  recipeId,
  recipeName,
  onClose,
  onConfirm,
}: AdjustServingsModalProps) {
  const [servingsInput, setServingsInput] = useState(originalServings.toString())
  const [adjustedIngredients, setAdjustedIngredients] = useState<AdjustedIngredient[]>([])
  const [step, setStep] = useState<'input' | 'review'>('input')

  // Calcular ingredientes ajustados
  const calculateAdjustedIngredients = useCallback(
    (targetServings: number) => {
      if (originalServings === 0) {
        return originalIngredients.map((ing) => ({
          id: ing.id,
          name: ing.name,
          originalAmount: ing.amount,
          adjustedAmount: ing.amount,
          unit: ing.unit,
          isEditable: true,
        }))
      }

      const ratio = targetServings / originalServings

      return originalIngredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        originalAmount: ing.amount,
        adjustedAmount: ing.amount ? ing.amount * ratio : undefined,
        unit: ing.unit,
        isEditable: !!ing.amount, // Só é editável se tiver quantidade original
      }))
    },
    [originalServings, originalIngredients],
  )

  // Calcular quando o número de porções mudar
  useEffect(() => {
    const servings = parseFloat(servingsInput)
    if (!Number.isNaN(servings) && servings > 0) {
      const adjusted = calculateAdjustedIngredients(servings)
      setAdjustedIngredients(adjusted)
    }
  }, [servingsInput, calculateAdjustedIngredients])

  const handleNext = () => {
    const servings = parseFloat(servingsInput)
    if (Number.isNaN(servings) || servings <= 0) {
      return
    }
    setStep('review')
  }

  const handleBack = () => {
    setStep('input')
  }

  const handleAmountChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    setAdjustedIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id
          ? { ...ing, adjustedAmount: Number.isNaN(numValue) ? undefined : numValue }
          : ing,
      ),
    )
  }

  const handleConfirm = () => {
    const ingredients = adjustedIngredients.map((ing) => ({
      name: ing.name || 'Ingrediente',
      quantity: ing.adjustedAmount?.toString(),
      unit: ing.unit,
    }))

    onConfirm(ingredients, recipeId, recipeName)
    handleClose()
  }

  const handleClose = () => {
    setStep('input')
    setServingsInput(originalServings.toString())
    setAdjustedIngredients([])
    onClose()
  }

  const servings = parseFloat(servingsInput)
  const ratio =
    !Number.isNaN(servings) && originalServings > 0 ? servings / originalServings : 1

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={handleClose}
    >
      <ModalBackdrop className='bg-black/60' />
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-lg mx-4 w-[90%] max-w-md max-h-[90%]'>
          {step === 'input' ? (
            <>
              {/* Header */}
              <HStack className='justify-between items-center p-4 border-b border-gray-200'>
                <Text className='text-lg font-semibold text-gray-900'>
                  Ajustar Porções
                </Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name='close' size={24} color='#6B7280' />
                </TouchableOpacity>
              </HStack>

              {/* Body */}
              <VStack className='p-4 gap-4'>
                <Text className='text-gray-700'>
                  A receita original serve{' '}
                  <Text className='font-semibold'>{originalServings}</Text> porções.
                </Text>
                <Text className='text-gray-700'>
                  Quantas porções você deseja preparar?
                </Text>

                <VStack className='gap-2'>
                  <Text className='font-medium text-gray-700'>Número de Porções</Text>
                  <Input className='bg-gray-50 border-gray-200'>
                    <InputField
                      value={servingsInput}
                      onChangeText={setServingsInput}
                      placeholder='Ex: 2'
                      keyboardType='numeric'
                    />
                  </Input>
                </VStack>

                {!Number.isNaN(servings) && servings > 0 && originalServings > 0 && (
                  <View className='bg-blue-50 p-3 rounded-lg'>
                    <Text className='text-sm text-blue-800'>
                      {ratio < 1 ? (
                        <>Dividindo por {originalServings / servings}x</>
                      ) : ratio > 1 ? (
                        <>Multiplicando por {(servings / originalServings).toFixed(1)}x</>
                      ) : (
                        <>Quantidades originais mantidas</>
                      )}
                    </Text>
                  </View>
                )}
              </VStack>

              {/* Footer */}
              <HStack className='p-4 border-t border-gray-200 gap-2'>
                <Button
                  variant='outline'
                  onPress={handleClose}
                  className='flex-1 border-gray-300'
                >
                  <ButtonText className='text-gray-700'>Cancelar</ButtonText>
                </Button>
                <Button
                  onPress={handleNext}
                  disabled={Number.isNaN(servings) || servings <= 0}
                  className='flex-1 bg-orange-500'
                >
                  <ButtonText className='text-white'>Próximo</ButtonText>
                </Button>
              </HStack>
            </>
          ) : (
            <>
              {/* Header Review */}
              <HStack className='justify-between items-center p-4 border-b border-gray-200'>
                <Text className='text-lg font-semibold text-gray-900'>
                  Confirmar Ingredientes
                </Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name='close' size={24} color='#6B7280' />
                </TouchableOpacity>
              </HStack>

              {/* Body Review */}
              <VStack className='p-4 gap-3'>
                <View className='bg-orange-50 p-3 rounded-lg'>
                  <Text className='text-sm font-medium text-orange-900'>
                    Receita: {recipeName}
                  </Text>
                  <Text className='text-sm text-orange-800'>
                    Ajustado para {servings} porção{servings !== 1 ? 'ões' : ''}
                  </Text>
                  {ratio !== 1 && (
                    <Text className='text-xs text-orange-700 mt-1'>
                      (Original: {originalServings} porção
                      {originalServings !== 1 ? 'ões' : ''})
                    </Text>
                  )}
                </View>

                <Text className='font-medium text-gray-900 mb-2'>
                  Ingredientes Ajustados:
                </Text>

                <ScrollView className='max-h-64' showsVerticalScrollIndicator>
                  <VStack className='gap-3'>
                    {adjustedIngredients.map((ing) => (
                      <View
                        key={ing.id}
                        className='bg-gray-50 p-3 rounded-lg border border-gray-200'
                      >
                        <Text className='font-medium text-gray-900 mb-2'>{ing.name}</Text>
                        {ing.isEditable ? (
                          <HStack className='items-center gap-2'>
                            <View className='flex-1'>
                              <Input className='bg-white border-gray-300'>
                                <InputField
                                  value={
                                    ing.adjustedAmount !== undefined
                                      ? ing.adjustedAmount.toString()
                                      : ''
                                  }
                                  onChangeText={(value) =>
                                    handleAmountChange(ing.id, value)
                                  }
                                  placeholder='Quantidade'
                                  keyboardType='decimal-pad'
                                />
                              </Input>
                            </View>
                            {ing.unit && (
                              <View className='w-20'>
                                <Text className='text-gray-700 font-medium'>
                                  {ing.unit}
                                </Text>
                              </View>
                            )}
                          </HStack>
                        ) : (
                          <Text className='text-gray-600'>
                            Sem quantidade especificada
                          </Text>
                        )}
                      </View>
                    ))}
                  </VStack>
                </ScrollView>
              </VStack>

              {/* Footer Review */}
              <HStack className='p-4 border-t border-gray-200 gap-2'>
                <Button
                  variant='outline'
                  onPress={handleBack}
                  className='flex-1 border-gray-300'
                >
                  <ButtonText className='text-gray-700'>Voltar</ButtonText>
                </Button>
                <Button onPress={handleConfirm} className='flex-1 bg-orange-500'>
                  <ButtonText className='text-white'>Adicionar à Lista</ButtonText>
                </Button>
              </HStack>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}
