import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Vibration } from 'react-native'
import { recipesService } from '@/services/recipes'
import type { Recipe } from '@/types/api'

export function useCookingMode() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const recipeId = (params.id as string) || ''

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Carregar receita
  useEffect(() => {
    const loadRecipe = async () => {
      if (!recipeId) return

      try {
        setIsLoading(true)
        const loadedRecipe = await recipesService.getById(recipeId)
        setRecipe(loadedRecipe)

        // Ordenar instruções por ordem
        const sortedInstructions = [...(loadedRecipe.instructions || [])].sort(
          (a, b) => a.order - b.order,
        )

        // Inicializar primeiro passo se tiver duração
        if (sortedInstructions.length > 0 && sortedInstructions[0].durationSec) {
          setTimeRemaining(sortedInstructions[0].durationSec)
        }
      } catch (error) {
        console.error('Erro ao carregar receita:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipe()
  }, [recipeId])

  // Gerenciar temporizador
  // biome-ignore lint/correctness/useExhaustiveDependencies: timeRemaining não precisa estar nas dependências pois é atualizado internamente pelo setInterval usando prev
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            // 2 vibrações quando o temporizador terminar
            Vibration.vibrate([0, 400, 200, 400])
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isTimerRunning])

  const currentStep = recipe?.instructions?.find(
    (inst) => inst.order === currentStepIndex + 1,
  )

  const sortedInstructions = recipe?.instructions
    ? [...recipe.instructions].sort((a, b) => a.order - b.order)
    : []

  const handleNextStep = useCallback(() => {
    if (!sortedInstructions || currentStepIndex >= sortedInstructions.length - 1) return

    const nextIndex = currentStepIndex + 1
    setCurrentStepIndex(nextIndex)
    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))

    // Parar timer atual
    setIsTimerRunning(false)

    // Iniciar novo timer se o próximo passo tiver duração
    const nextStep = sortedInstructions[nextIndex]
    if (nextStep?.durationSec) {
      setTimeRemaining(nextStep.durationSec)
    } else {
      setTimeRemaining(0)
    }
  }, [currentStepIndex, sortedInstructions])

  const handlePreviousStep = useCallback(() => {
    if (currentStepIndex <= 0) return

    const prevIndex = currentStepIndex - 1
    setCurrentStepIndex(prevIndex)

    // Parar timer atual
    setIsTimerRunning(false)

    // Iniciar novo timer se o passo anterior tiver duração
    const prevStep = sortedInstructions[prevIndex]
    if (prevStep?.durationSec) {
      setTimeRemaining(prevStep.durationSec)
    } else {
      setTimeRemaining(0)
    }
  }, [currentStepIndex, sortedInstructions])

  const handleToggleTimer = useCallback(() => {
    if (timeRemaining === 0) return
    setIsTimerRunning((prev) => !prev)
  }, [timeRemaining])

  const handleResetTimer = useCallback(() => {
    setIsTimerRunning(false)
    if (currentStep?.durationSec) {
      setTimeRemaining(currentStep.durationSec)
    }
  }, [currentStep])

  const handleCompleteStep = useCallback(() => {
    // Marcar passo atual como concluído e avançar
    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))
    handleNextStep()
  }, [currentStepIndex, handleNextStep])

  const handleFinalize = useCallback(() => {
    // Marcar último passo como concluído antes de voltar
    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))

    // Parar timer se estiver rodando
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // Voltar para página da receita
    router.back()
  }, [currentStepIndex, router])

  const handleGoBack = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
    router.back()
  }, [router])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isLastStep = currentStepIndex === sortedInstructions.length - 1
  const isFirstStep = currentStepIndex === 0
  const allStepsCompleted = completedSteps.size === sortedInstructions.length

  return {
    recipe,
    isLoading,
    currentStep,
    currentStepIndex,
    totalSteps: sortedInstructions.length,
    isTimerRunning,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    completedSteps,
    isLastStep,
    isFirstStep,
    allStepsCompleted,
    sortedInstructions,
    handleNextStep,
    handlePreviousStep,
    handleToggleTimer,
    handleResetTimer,
    handleCompleteStep,
    handleFinalize,
    handleGoBack,
  }
}
