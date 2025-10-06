import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { categoriesService } from '@/services/categories'
import { recipesService } from '@/services/recipes'
import type { Category, Recipe } from '@/types/api'

interface EditRecipeFormData {
  title: string
  description: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  preparationTime: number
  servings: number
  calories?: number
  proteinGrams?: number
  carbGrams?: number
  fatGrams?: number
  videoUrl: string
  images: string[]
  ingredients: Array<{
    name: string
    amount: string
    unit: string
  }>
  instructions: Array<{
    description: string
  }>
  categoryIds: string[]
}

export function useEditRecipe() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [formData, setFormData] = useState<EditRecipeFormData>({
    title: '',
    description: '',
    difficulty: 'EASY',
    preparationTime: 0,
    servings: 0,
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
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [showErrorToast] = useState<(message: string) => void>(
    () => (message: string) => {
      Alert.alert('Erro', message)
    },
  )

  // Carregar receita para edição
  const loadRecipe = useCallback(async () => {
    if (!id) return

    try {
      setIsLoadingRecipe(true)
      const recipe = await recipesService.getById(id)

      if (recipe) {
        setFormData({
          title: recipe.title || '',
          description: recipe.description || '',
          difficulty: recipe.difficulty || 'EASY',
          preparationTime: recipe.prepTime || 0,
          servings: recipe.servings || 0,
          calories: recipe.calories,
          proteinGrams: recipe.proteinGrams,
          carbGrams: recipe.carbGrams,
          fatGrams: recipe.fatGrams,
          videoUrl: recipe.videoUrl || '',
          images: recipe.photos?.map((photo) => photo.url) || [''],
          ingredients: recipe.ingredients?.map((ing) => ({
            name: ing.name || '',
            amount: ing.amount?.toString() || '',
            unit: ing.unit || '',
          })) || [{ name: '', amount: '', unit: '' }],
          instructions: recipe.instructions?.map((inst) => ({
            description: inst.description || '',
          })) || [{ description: '' }],
          categoryIds: recipe.categories?.map((cat) => cat.id) || [],
        })
      }
    } catch (error) {
      console.error('Erro ao carregar receita:', error)
      showErrorToast('Erro ao carregar receita para edição')
    } finally {
      setIsLoadingRecipe(false)
    }
  }, [id, showErrorToast])

  // Carregar categorias
  const loadCategories = useCallback(async () => {
    try {
      const categoriesData = await categoriesService.getAll()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }, [])

  // Validação do formulário
  const validateForm = useCallback((): string | null => {
    if (!formData.title.trim()) {
      return 'Título é obrigatório'
    }
    if (!formData.description.trim()) {
      return 'Descrição é obrigatória'
    }
    if (formData.preparationTime <= 0) {
      return 'Tempo de preparo deve ser maior que zero'
    }
    if (formData.servings <= 0) {
      return 'Quantidade de porções deve ser maior que zero'
    }
    if (
      formData.ingredients.length === 0 ||
      !formData.ingredients.some((ing) => ing.name.trim())
    ) {
      return 'Pelo menos um ingrediente é obrigatório'
    }
    if (
      formData.instructions.length === 0 ||
      !formData.instructions.some((inst) => inst.description.trim())
    ) {
      return 'Pelo menos uma instrução é obrigatória'
    }
    return null
  }, [formData])

  // Salvar receita editada
  const saveRecipe = useCallback(async () => {
    const validationError = validateForm()
    if (validationError) {
      showErrorToast(validationError)
      return
    }

    if (!id) {
      showErrorToast('ID da receita não encontrado')
      return
    }

    try {
      setIsLoading(true)

      const recipeData: Partial<Recipe> = {
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
        // Note: ingredients, instructions, categories, photos não são atualizados via update
        // Eles precisariam de endpoints específicos para atualização
      }

      await recipesService.update(id, recipeData)
      console.log('🔄 EditRecipe - Navegando de volta com parâmetro updated=true')
      router.replace('/(auth)/my-recipes?updated=true')
    } catch (err) {
      console.error('Erro ao atualizar receita:', err)
      showErrorToast('Erro ao atualizar receita. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, router, showErrorToast, id])

  // Limpar formulário
  const clearForm = useCallback(() => {
    Alert.alert('Limpar formulário', 'Tem certeza que deseja limpar todos os campos?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: () => {
          setFormData({
            title: '',
            description: '',
            difficulty: 'EASY',
            preparationTime: 0,
            servings: 0,
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
        },
      },
    ])
  }, [])

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
    (
      index: number,
      field: keyof { name: string; amount: string; unit: string },
      value: string,
    ) => {
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

  // Atualizar categoria
  const updateCategory = useCallback((categoryId: string, isSelected: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: isSelected
        ? [...prev.categoryIds, categoryId]
        : prev.categoryIds.filter((id) => id !== categoryId),
    }))
  }, [])

  // Toggle categoria (para manter compatibilidade com CreateRecipeView)
  const toggleCategory = useCallback((categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }, [])

  // Atualizar campo básico
  const updateField = useCallback((field: keyof EditRecipeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  useEffect(() => {
    loadRecipe()
    loadCategories()
  }, [loadRecipe, loadCategories])

  return {
    // Estados
    formData,
    isLoading,
    isLoadingRecipe,
    categories,

    // Handlers
    saveRecipe,
    clearForm,
    addIngredient,
    removeIngredient,
    updateIngredient,
    addInstruction,
    removeInstruction,
    updateInstruction,
    addImage,
    removeImage,
    updateImage,
    updateCategory,
    toggleCategory,
    updateField,
  }
}
