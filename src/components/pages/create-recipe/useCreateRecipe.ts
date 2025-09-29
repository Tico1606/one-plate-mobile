import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { categoriesService } from '@/services/categories'
import {
  type Ingredient as ApiIngredient,
  ingredientsService,
} from '@/services/ingredients'
import { recipesService } from '@/services/recipes'
import type {
  Category,
  CreateRecipeRequest,
  Difficulty,
  Ingredient,
  Instruction,
} from '@/types/api'

export interface CreateRecipeFormData {
  title: string
  description: string
  difficulty: Difficulty
  preparationTime: number
  servings: number
  calories?: number
  proteinGrams?: number
  carbGrams?: number
  fatGrams?: number
  videoUrl?: string
  images: string[]
  ingredients: Ingredient[]
  instructions: Instruction[]
  categoryIds: string[]
}

export function useCreateRecipe() {
  const router = useRouter()

  // Estados do formulário
  const [formData, setFormData] = useState<CreateRecipeFormData>({
    title: '',
    description: '',
    difficulty: 'EASY',
    preparationTime: 0,
    servings: 1,
    calories: undefined,
    proteinGrams: undefined,
    carbGrams: undefined,
    fatGrams: undefined,
    videoUrl: '',
    images: [''],
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [{ description: '' }],
    categoryIds: [],
  })

  // Estados de controle
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  // Carregar categorias
  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true)
      const categoriesData = await categoriesService.getAll()
      setCategories(categoriesData)
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  // Atualizar campo do formulário
  const updateField = useCallback(
    <K extends keyof CreateRecipeFormData>(field: K, value: CreateRecipeFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  // Adicionar ingrediente
  const addIngredient = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }],
    }))
  }, [])

  // Remover ingrediente
  const removeIngredient = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }, [])

  // Atualizar ingrediente
  const updateIngredient = useCallback(
    (index: number, field: keyof Ingredient, value: string) => {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((ing, i) =>
          i === index ? { ...ing, [field]: value } : ing,
        ),
      }))
    },
    [],
  )

  // Adicionar instrução
  const addInstruction = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, { description: '' }],
    }))
  }, [])

  // Remover instrução
  const removeInstruction = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }))
  }, [])

  // Atualizar instrução
  const updateInstruction = useCallback((index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === index ? { ...inst, description: value } : inst,
      ),
    }))
  }, [])

  // Adicionar imagem
  const addImage = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }))
  }, [])

  // Remover imagem
  const removeImage = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }, [])

  // Atualizar imagem
  const updateImage = useCallback((index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }))
  }, [])

  // Toggle categoria
  const toggleCategory = useCallback((categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }, [])

  // Mostrar toast de erro
  const showErrorToast = useCallback((message: string) => {
    console.error('Toast Error:', message)
    // TODO: Implementar toast quando a API estiver disponível
  }, [])

  // Validar formulário
  const validateForm = useCallback((): string | null => {
    if (!formData.title.trim()) return 'Título é obrigatório'
    if (formData.preparationTime <= 0) return 'Tempo de preparo deve ser maior que 0'
    if (formData.servings <= 0) return 'Número de porções deve ser maior que 0'
    if (formData.categoryIds.length === 0) return 'Pelo menos uma categoria é obrigatória'

    // Validar ingredientes - deve ter pelo menos um ingrediente válido
    const validIngredients = formData.ingredients.filter(
      (ing) => ing.name.trim() && ing.amount.trim() && ing.unit.trim(),
    )
    if (validIngredients.length === 0)
      return 'Pelo menos um ingrediente válido é obrigatório'

    // Validar instruções - deve ter pelo menos uma instrução válida
    const validInstructions = formData.instructions.filter((inst) =>
      inst.description.trim(),
    )
    if (validInstructions.length === 0)
      return 'Pelo menos uma instrução válida é obrigatória'

    return null
  }, [formData])

  // Salvar receita
  const saveRecipe = useCallback(async () => {
    const validationError = validateForm()
    if (validationError) {
      showErrorToast(validationError)
      return
    }

    try {
      setIsLoading(true)

      // Filtrar nomes de ingredientes válidos para criação
      const validIngredientNames = formData.ingredients
        .filter((ing) => ing.name.trim() && ing.amount.trim() && ing.unit.trim())
        .map((ing) => ing.name.trim())

      const validSteps = formData.instructions
        .filter((inst) => inst.description.trim())
        .map((inst, index) => ({
          order: index + 1,
          description: inst.description.trim(),
        }))

      // Verificar se temos pelo menos um ingrediente e uma instrução
      if (validIngredientNames.length === 0) {
        showErrorToast('Pelo menos um ingrediente válido é obrigatório')
        return
      }

      if (validSteps.length === 0) {
        showErrorToast('Pelo menos uma instrução válida é obrigatória')
        return
      }

      // Tentar criar ingredientes no banco de dados
      let recipeIngredients: Array<{
        ingredientId: string
        amount: number
        unit: string
      }> = []

      try {
        console.log('🔧 Tentando criar ingredientes:', validIngredientNames)
        const createdIngredients: ApiIngredient[] =
          await ingredientsService.createMultiple(validIngredientNames)

        console.log('✅ Ingredientes criados com sucesso:', createdIngredients)

        // Mapear ingredientes criados para o formato da receita
        recipeIngredients = formData.ingredients
          .filter((ing) => ing.name.trim() && ing.amount.trim() && ing.unit.trim())
          .map((ing) => {
            // A API retorna o ingrediente diretamente
            const createdIngredient = createdIngredients.find(
              (ci) => ci?.name?.toLowerCase() === ing.name.trim().toLowerCase(),
            )
            const ingredientId = createdIngredient?.id
            console.log(`🔍 Mapeando ingrediente "${ing.name}" -> ID: ${ingredientId}`)
            return {
              ingredientId: ingredientId || ing.name.trim(),
              amount: parseFloat(ing.amount.trim()) || 0,
              unit: ing.unit.trim(),
            }
          })
      } catch (ingredientError) {
        console.warn(
          'Erro ao criar ingredientes, usando nomes como IDs:',
          ingredientError,
        )

        // Fallback: usar nomes como IDs temporários
        recipeIngredients = formData.ingredients
          .filter((ing) => ing?.name?.trim() && ing?.amount?.trim() && ing?.unit?.trim())
          .map((ing) => ({
            ingredientId: ing.name?.trim() || 'ingrediente', // Usar nome como ID temporário
            amount: parseFloat(ing.amount?.trim() || '0') || 0,
            unit: ing.unit?.trim() || 'unidade',
          }))
      }

      // Filtrar imagens válidas (não vazias)
      const validImages = formData.images.filter((img) => img.trim())

      const recipeData: CreateRecipeRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        prepTime: formData.preparationTime,
        servings: formData.servings,
        videoUrl: formData.videoUrl?.trim() || undefined,
        calories: formData.calories,
        proteinGrams: formData.proteinGrams,
        carbGrams: formData.carbGrams,
        fatGrams: formData.fatGrams,
        images: validImages.length > 0 ? validImages : undefined,
        ingredients: recipeIngredients,
        steps: validSteps,
        categories: formData.categoryIds,
      }

      console.log('📤 Payload da receita:', JSON.stringify(recipeData, null, 2))
      console.log('📊 Ingredientes finais:', recipeIngredients)
      console.log('📋 Steps finais:', validSteps)

      const createdRecipe = await recipesService.create(recipeData)
      console.log('✅ Receita criada com sucesso:', createdRecipe)

      // A API retorna a receita dentro de um objeto "recipe"
      const recipeId = createdRecipe?.recipe?.id
      if (recipeId) {
        // Redirecionar para a receita criada
        router.push(`/(auth)/recipe-[id]?id=${recipeId}`)
      } else {
        console.error('❌ Receita criada mas sem ID:', createdRecipe)
        showErrorToast(
          'Receita criada mas não foi possível redirecionar. Verifique a lista de receitas.',
        )
      }
    } catch (err) {
      console.error('Erro ao criar receita:', err)
      showErrorToast('Erro ao criar receita. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, router, showErrorToast])

  // Limpar formulário
  const clearForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'EASY',
      preparationTime: 0,
      servings: 1,
      calories: undefined,
      proteinGrams: undefined,
      carbGrams: undefined,
      fatGrams: undefined,
      videoUrl: '',
      images: [''],
      ingredients: [{ name: '', amount: '', unit: '' }],
      instructions: [{ description: '' }],
      categoryIds: [],
    })
  }, [])

  return {
    // Estados
    formData,
    isLoading,
    categories,
    categoriesLoading,

    // Ações
    loadCategories,
    updateField,
    addIngredient,
    removeIngredient,
    updateIngredient,
    addInstruction,
    removeInstruction,
    updateInstruction,
    addImage,
    removeImage,
    updateImage,
    toggleCategory,
    saveRecipe,
    clearForm,
  }
}
