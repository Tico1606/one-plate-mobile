import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'

interface CookingModeViewProps {
  recipe: any
  isLoading: boolean
  currentStep: any
  currentStepIndex: number
  totalSteps: number
  isTimerRunning: boolean
  timeRemaining: number
  formattedTime: string
  completedSteps: Set<number>
  isLastStep: boolean
  isFirstStep: boolean
  allStepsCompleted: boolean
  sortedInstructions: any[]
  handleNextStep: () => void
  handlePreviousStep: () => void
  handleToggleTimer: () => void
  handleResetTimer: () => void
  handleFinalize: () => void
  handleGoBack: () => void
}

export function CookingModeView({
  recipe,
  isLoading,
  currentStep,
  currentStepIndex,
  totalSteps,
  isTimerRunning,
  timeRemaining,
  formattedTime,
  completedSteps,
  isLastStep,
  isFirstStep,
  sortedInstructions,
  handleNextStep,
  handlePreviousStep,
  handleToggleTimer,
  handleResetTimer,
  handleFinalize,
  handleGoBack,
}: CookingModeViewProps) {
  if (isLoading) {
    return (
      <View className='flex-1 bg-gray-50 justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
        <Text className='mt-4 text-gray-600'>Carregando receita...</Text>
      </View>
    )
  }

  if (!recipe || !currentStep) {
    return (
      <View className='flex-1 bg-gray-50 justify-center items-center px-6'>
        <Ionicons name='alert-circle' size={48} color='#EF4444' />
        <Text className='mt-4 text-lg font-semibold text-gray-900 text-center'>
          Receita não encontrada
        </Text>
        <TouchableOpacity
          onPress={handleGoBack}
          className='mt-6 bg-purple-500 px-6 py-3 rounded-lg'
        >
          <Text className='text-white font-semibold'>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white border-b border-gray-200 px-4 py-4 pt-12 mb-4'>
        <HStack className='items-center justify-between'>
          <TouchableOpacity onPress={handleGoBack} className='p-2'>
            <Ionicons name='arrow-back' size={24} color='#374151' />
          </TouchableOpacity>
          <VStack className='flex-1 items-center'>
            <Text className='text-lg font-bold text-gray-900'>
              {recipe.title || 'Receita'}
            </Text>
            <Text className='text-sm text-gray-500'>
              Passo {currentStepIndex + 1} de {totalSteps}
            </Text>
          </VStack>
          <View className='w-10' />
        </HStack>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Temporizador */}
        {currentStep?.durationSec && currentStep.durationSec > 0 ? (
          <View className='mx-4 py-6 rounded-lg'>
            <Card className='p-6 bg-purple-500'>
              <VStack className='items-center space-y-4'>
                <Text className='text-white text-sm font-medium'>Temporizador</Text>
                <Text className='text-white text-5xl font-bold font-mono'>
                  {formattedTime}
                </Text>
                <HStack className='space-x-3 mt-4 gap-3'>
                  <Button
                    onPress={handleToggleTimer}
                    disabled={timeRemaining === 0}
                    className='bg-white border border-white min-w-[100]'
                  >
                    <ButtonText className='text-gray-700'>
                      {isTimerRunning ? 'Pausar' : 'Iniciar'}
                    </ButtonText>
                  </Button>
                  <Button
                    onPress={handleResetTimer}
                    variant='outline'
                    className='bg-white border border-white min-w-[100]'
                  >
                    <ButtonText className='text-gray-700'>Resetar</ButtonText>
                  </Button>
                </HStack>
                {timeRemaining === 0 && isTimerRunning === false ? (
                  <View className='mt-2 bg-yellow-400 px-4 py-2 rounded-lg'>
                    <Text className='text-yellow-900 font-semibold'>
                      Tempo concluído! 🔔
                    </Text>
                  </View>
                ) : null}
              </VStack>
            </Card>
          </View>
        ) : null}

        {/* Passo Atual */}
        <View className='mx-4 mb-4'>
          <Card className='p-6 bg-white'>
            <VStack className='space-y-4'>
              <HStack className='items-center space-x-3 gap-3 mb-2'>
                <View className='w-12 h-12 bg-purple-500 rounded-full items-center justify-center'>
                  <Text className='text-white font-bold text-lg'>
                    {currentStepIndex + 1}
                  </Text>
                </View>
                <Text className='flex-1 text-lg font-bold text-gray-900'>
                  Passo {currentStepIndex + 1}
                </Text>
                {completedSteps.has(currentStepIndex) ? (
                  <Ionicons name='checkmark-circle' size={32} color='#10B981' />
                ) : null}
              </HStack>

              <Text className='text-base text-gray-700 leading-6 mb-3'>
                {currentStep.description || 'Sem descrição disponível'}
              </Text>

              {currentStep?.durationSec && currentStep.durationSec > 0 ? (
                <HStack className='items-center space-x-2 gap-2 bg-purple-50 p-3 rounded-lg'>
                  <Ionicons name='time-outline' size={20} color='#8B5CF6' />
                  <Text className='text-purple-700 font-medium'>
                    Tempo estimado: {Math.round(currentStep.durationSec / 60)} minutos
                  </Text>
                </HStack>
              ) : null}
            </VStack>
          </Card>
        </View>

        {/* Lista de Passos */}
        <View className='mx-4'>
          <Text className='text-sm font-semibold text-gray-700 mb-3'>
            Todos os Passos:
          </Text>
          <VStack className='space-y-2 gap-2'>
            {sortedInstructions.map((step, index) => (
              <Card
                key={step.id}
                className={`p-4 bg-white ${
                  index === currentStepIndex
                    ? 'border-2 border-purple-500'
                    : 'border-gray-200'
                }`}
              >
                <HStack className='items-center space-x-3 gap-3'>
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      index === currentStepIndex
                        ? 'bg-purple-500'
                        : completedSteps.has(index)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                    }`}
                  >
                    {completedSteps.has(index) ? (
                      <Ionicons name='checkmark' size={16} color='white' />
                    ) : (
                      <Text className='text-white font-bold text-sm'>{index + 1}</Text>
                    )}
                  </View>
                  <Text
                    className={`flex-1 text-sm ${
                      index === currentStepIndex
                        ? 'font-semibold text-gray-900'
                        : completedSteps.has(index)
                          ? 'line-through text-gray-500'
                          : 'text-gray-700'
                    }`}
                    numberOfLines={2}
                  >
                    {step.description || 'Sem descrição disponível'}
                  </Text>
                </HStack>
              </Card>
            ))}
          </VStack>
        </View>

        {/* Espaçamento inferior */}
        <View className='h-8' />
      </ScrollView>

      {/* Controles de Navegação */}
      <View className='bg-white border-t border-gray-200 px-4 py-4 mb-4'>
        {isLastStep ? (
          <Button onPress={handleFinalize} className='w-full bg-purple-500'>
            <HStack className='items-center space-x-2 gap-2'>
              <Ionicons name='checkmark-circle' size={20} color='white' />
              <ButtonText className='text-white'>Finalizar</ButtonText>
            </HStack>
          </Button>
        ) : (
          <HStack className='space-x-3 gap-3'>
            <Button
              onPress={handlePreviousStep}
              disabled={isFirstStep}
              variant='outline'
              className={`flex-1 border-gray-300 ${isFirstStep ? 'opacity-50' : ''}`}
            >
              <HStack className='items-center space-x-2 gap-2'>
                <Ionicons
                  name='chevron-back'
                  size={20}
                  color={isFirstStep ? '#9CA3AF' : '#374151'}
                />
                <ButtonText className='text-gray-700'>Anterior</ButtonText>
              </HStack>
            </Button>

            <Button
              onPress={handleNextStep}
              variant='outline'
              className='flex-1 border-gray-300'
            >
              <HStack className='items-center space-x-2 gap-2'>
                <ButtonText className='text-gray-700'>Próximo</ButtonText>
                <Ionicons name='chevron-forward' size={20} color='#374151' />
              </HStack>
            </Button>
          </HStack>
        )}
      </View>
    </View>
  )
}
