import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { useAuthToken } from '@/hooks/useAuthToken'
import { authToken } from '@/lib/auth-token'
import {
  type CreateRecipeFormData,
  createDraftSchema,
  createRecipeSchema,
  ingredientFieldSchema,
} from '@/lib/validations/recipe'
import { categoriesService } from '@/services/categories'
import {
  type Ingredient as ApiIngredient,
  ingredientsService,
} from '@/services/ingredients'
import { recipesService } from '@/services/recipes'
import type { Category, CreateRecipeRequest, Ingredient } from '@/types/api'

export function useCreateRecipe() {
  const router = useRouter()
  const { isSignedIn } = useAuthToken()

  // Função para decodificar JWT (apenas para debug)
  const decodeJWT = useCallback((token: string) => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const payload = JSON.parse(atob(parts[1]))
      return {
        exp: payload.exp,
        iat: payload.iat,
        sub: payload.sub,
        iss: payload.iss,
        isExpired: payload.exp * 1000 < Date.now(),
      }
    } catch (error) {
      console.error('❌ [CREATE-RECIPE] Erro ao decodificar JWT:', error)
      return null
    }
  }, [])

  // Função para verificar e sincronizar token
  const ensureTokenSync = useCallback(async () => {
    try {
      const storedToken = await authToken.get()
      console.log('🔑 [CREATE-RECIPE] Token no storage:', storedToken ? 'SIM' : 'NÃO')
      console.log('🔑 [CREATE-RECIPE] isSignedIn:', isSignedIn)

      if (storedToken) {
        const decoded = decodeJWT(storedToken)
        if (decoded) {
          console.log('🔍 [CREATE-RECIPE] Token decodificado:', {
            exp: new Date(decoded.exp * 1000).toISOString(),
            isExpired: decoded.isExpired,
            sub: decoded.sub,
            iss: decoded.iss,
          })

          if (decoded.isExpired) {
            console.log('⚠️ [CREATE-RECIPE] Token expirado!')
            await authToken.remove()
            return null
          }
        }
      }

      if (!storedToken && isSignedIn) {
        console.log('⚠️ [CREATE-RECIPE] Token não encontrado, mas usuário está logado')
        console.log('⏳ [CREATE-RECIPE] Aguardando sincronização do token...')
        // Aguardar um pouco para o useAuthToken sincronizar
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Verificar novamente após o delay
        const retryToken = await authToken.get()
        console.log('🔑 [CREATE-RECIPE] Token após retry:', retryToken ? 'SIM' : 'NÃO')
        return retryToken
      }

      return storedToken
    } catch (error) {
      console.error('❌ [CREATE-RECIPE] Erro ao verificar token:', error)
      return null
    }
  }, [isSignedIn, decodeJWT])

  // Função para tentar criar receita sem autenticação (modo desenvolvimento)
  const tryCreateWithoutAuth = useCallback(
    async (recipeData: any, status: 'PUBLISHED' | 'DRAFT' = 'PUBLISHED') => {
      try {
        console.log('🔄 [CREATE-RECIPE] Tentando criar receita sem autenticação...')

        // Criar uma instância do axios sem interceptor de auth
        const { default: axios } = await import('axios')
        const apiWithoutAuth = axios.create({
          baseURL: 'http://192.168.12.98:3333/api',
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        // Garantir que o status correto seja enviado
        const dataWithStatus = {
          ...recipeData,
          status,
        }

        const response = await apiWithoutAuth.post('/recipes', dataWithStatus)
        console.log(
          `✅ [CREATE-RECIPE] Receita criada sem autenticação (${status}):`,
          response.data,
        )
        return response.data
      } catch (error) {
        console.error('❌ [CREATE-RECIPE] Erro ao criar sem autenticação:', error)
        throw error
      }
    },
    [],
  )

  // Estados do formulário
  const [formData, setFormData] = useState<CreateRecipeFormData>({
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

  // Estados de controle
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [ingredientErrors, setIngredientErrors] = useState<
    Record<number, Record<string, string>>
  >({})

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

  // Validar campo individual
  const validateField = useCallback((field: string, value: any) => {
    try {
      // Validar apenas o campo específico
      if (field === 'title') {
        if (typeof value === 'string' && value.trim().length > 0) {
          setValidationErrors((prev) => {
            const { title: _, ...rest } = prev
            return rest
          })
        }
      } else if (field === 'preparationTime') {
        if (typeof value === 'number' && value > 0) {
          setValidationErrors((prev) => {
            const { preparationTime: _, ...rest } = prev
            return rest
          })
        }
      } else if (field === 'servings') {
        if (typeof value === 'number' && value > 0) {
          setValidationErrors((prev) => {
            const { servings: _, ...rest } = prev
            return rest
          })
        }
      } else if (field === 'categoryIds') {
        if (Array.isArray(value) && value.length > 0) {
          setValidationErrors((prev) => {
            const { categoryIds: _, ...rest } = prev
            return rest
          })
        }
      } else if (field === 'ingredients') {
        if (Array.isArray(value) && value.length > 0) {
          const hasValidIngredient = value.some(
            (ing) => ing.name?.trim() && ing.amount?.trim() && ing.unit?.trim(),
          )
          if (hasValidIngredient) {
            setValidationErrors((prev) => {
              const { ingredients: _, ...rest } = prev
              return rest
            })
          }
        }
      } else if (field === 'instructions') {
        if (Array.isArray(value) && value.length > 0) {
          const hasValidInstruction = value.some((inst) => inst.description?.trim())
          if (hasValidInstruction) {
            setValidationErrors((prev) => {
              const { instructions: _, ...rest } = prev
              return rest
            })
          }
        }
      }
    } catch {
      // Ignorar erros de validação individual
    }
  }, [])

  // Atualizar campo do formulário
  const updateField = useCallback(
    <K extends keyof CreateRecipeFormData>(field: K, value: CreateRecipeFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Validar o campo em tempo real
      validateField(field, value)
    },
    [validateField],
  )

  // Adicionar ingrediente
  const addIngredient = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }],
    }))
    // Limpar erros de ingredientes quando adicionar novo
    setIngredientErrors({})
  }, [])

  // Remover ingrediente
  const removeIngredient = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
    // Remover erros do ingrediente removido
    setIngredientErrors((prev) => {
      const { [index]: _, ...newErrors } = prev
      // Reindexar erros para ingredientes restantes
      const reindexedErrors: Record<number, Record<string, string>> = {}
      Object.keys(newErrors).forEach((key) => {
        const oldIndex = parseInt(key)
        if (oldIndex > index) {
          reindexedErrors[oldIndex - 1] = newErrors[oldIndex]
        } else if (oldIndex < index) {
          reindexedErrors[oldIndex] = newErrors[oldIndex]
        }
      })
      return reindexedErrors
    })
  }, [])

  // Validar ingrediente individual
  const validateIngredient = useCallback((ingredient: Ingredient, index: number) => {
    try {
      ingredientFieldSchema.parse(ingredient)
      // Se válido, remover erros deste ingrediente
      setIngredientErrors((prev) => {
        const { [index]: _, ...rest } = prev
        return rest
      })
      return true
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as any
        const errors: Record<string, string> = {}

        zodError.issues.forEach((issue: any) => {
          const field = issue.path[0]
          errors[field] = issue.message
        })

        setIngredientErrors((prev) => ({
          ...prev,
          [index]: errors,
        }))
      }
      return false
    }
  }, [])

  // Atualizar ingrediente
  const updateIngredient = useCallback(
    (index: number, field: keyof Ingredient, value: string) => {
      setFormData((prev) => {
        const newIngredients = prev.ingredients.map((ing, i) =>
          i === index ? { ...ing, [field]: value } : ing,
        )

        // Validar o ingrediente atualizado
        const updatedIngredient = newIngredients[index]
        validateIngredient(updatedIngredient, index)

        // Validar se há pelo menos um ingrediente válido
        const hasValidIngredient = newIngredients.some(
          (ing) => ing.name?.trim() && ing.amount?.trim() && ing.unit?.trim(),
        )
        if (hasValidIngredient) {
          setValidationErrors((prevErrors) => {
            const { ingredients: _, ...rest } = prevErrors
            return rest
          })
        }

        return {
          ...prev,
          ingredients: newIngredients,
        }
      })
    },
    [validateIngredient],
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
    setFormData((prev) => {
      const newInstructions = prev.instructions.map((inst, i) =>
        i === index ? { ...inst, description: value } : inst,
      )

      // Validar se há pelo menos uma instrução válida
      const hasValidInstruction = newInstructions.some((inst) => inst.description?.trim())
      if (hasValidInstruction) {
        setValidationErrors((prevErrors) => {
          const { instructions: _, ...rest } = prevErrors
          return rest
        })
      }

      return {
        ...prev,
        instructions: newInstructions,
      }
    })
  }, [])

  // Adicionar imagem
  const addImage = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ''],
    }))
  }, [])

  // Remover imagem
  const removeImage = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }))
  }, [])

  // Atualizar imagem
  const updateImage = useCallback((index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).map((img, i) => (i === index ? value : img)),
    }))
  }, [])

  // Toggle categoria
  const toggleCategory = useCallback((categoryId: string) => {
    setFormData((prev) => {
      const newCategoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId]

      // Validar categorias em tempo real
      if (newCategoryIds.length > 0) {
        setValidationErrors((prevErrors) => {
          const { categoryIds: _, ...rest } = prevErrors
          return rest
        })
      }

      return {
        ...prev,
        categoryIds: newCategoryIds,
      }
    })
  }, [])

  // Validar formulário com Zod
  const validateForm = useCallback(
    (isDraft = false) => {
      try {
        const schema = isDraft ? createDraftSchema : createRecipeSchema
        schema.parse(formData)
        setValidationErrors({})
        return true
      } catch (error) {
        if (error instanceof Error && 'issues' in error) {
          const zodError = error as any
          const errors: Record<string, string> = {}

          zodError.issues.forEach((issue: any) => {
            const path = issue.path.join('.')
            errors[path] = issue.message
          })

          setValidationErrors(errors)
        }
        return false
      }
    },
    [formData],
  )

  // Salvar receita como rascunho
  const saveRecipeAsDraft = useCallback(async () => {
    // Prevenir múltiplos cliques
    if (isSavingDraft) return

    // Verificar se o usuário está autenticado
    if (!isSignedIn) {
      setValidationErrors({ general: 'Você precisa estar logado para salvar receitas.' })
      return
    }

    // Verificar se o token está sincronizado
    const token = await ensureTokenSync()
    if (!token) {
      setValidationErrors({
        general: 'Erro de autenticação. O token pode ter expirado. Faça login novamente.',
      })
      return
    }

    try {
      setIsSavingDraft(true)

      // Validar formulário para rascunho
      if (!validateForm(true)) {
        return
      }

      // Validações mais flexíveis para rascunho
      const validSteps = formData.instructions
        .filter((inst) => inst.description.trim())
        .map((inst, index) => ({
          order: index + 1,
          description: inst.description.trim(),
        }))

      // Para rascunhos, ingredientes e instruções podem estar vazios
      const recipeIngredients: Array<{
        ingredientId: string
        amount: number
        unit: string
      }> = []

      // Se houver ingredientes válidos, processar
      if (formData.ingredients.some((ing) => ing.name.trim())) {
        const validIngredientNames = formData.ingredients
          .filter((ing) => ing.name.trim() && ing.amount.trim() && ing.unit.trim())
          .map((ing) => ing.name.trim())

        if (validIngredientNames.length > 0) {
          try {
            const createdIngredients: ApiIngredient[] =
              await ingredientsService.createMultiple(validIngredientNames)

            recipeIngredients.push(
              ...formData.ingredients
                .filter((ing) => ing.name.trim() && ing.amount.trim() && ing.unit.trim())
                .map((ing) => {
                  const createdIngredient = createdIngredients.find(
                    (ci) => ci?.name?.toLowerCase() === ing.name.trim().toLowerCase(),
                  )
                  return {
                    ingredientId: createdIngredient?.id || ing.name.trim(),
                    amount: parseFloat(ing.amount.trim()) || 0,
                    unit: ing.unit.trim(),
                  }
                }),
            )
          } catch (ingredientError) {
            console.warn('Erro ao criar ingredientes para rascunho:', ingredientError)
            // Para rascunhos, usar nomes como IDs temporários
            recipeIngredients.push(
              ...formData.ingredients
                .filter((ing) => ing.amount.trim() && ing.unit.trim())
                .map((ing) => ({
                  ingredientId: ing.name?.trim() || 'ingrediente',
                  amount: parseFloat(ing.amount?.trim() || '0') || 0,
                  unit: ing.unit?.trim() || 'unidade',
                })),
            )
          }
        }
      }

      // Filtrar imagens válidas (URLs de upload)
      const validImages = (formData.images || []).filter(
        (img) => img.trim() && img.startsWith('http'),
      )

      const draftData: CreateRecipeRequest = {
        title: formData.title.trim(),
        description:
          (formData.description || '').trim() ||
          `Rascunho criado em ${new Date().toLocaleDateString()}`,
        difficulty: formData.difficulty,
        prepTime: formData.preparationTime || 0,
        servings: formData.servings || 1,
        videoUrl: formData.videoUrl?.trim() || undefined,
        calories: formData.calories,
        proteinGrams: formData.proteinGrams,
        carbGrams: formData.carbGrams,
        fatGrams: formData.fatGrams,
        images: validImages.length > 0 ? validImages : [],
        ingredients: recipeIngredients.length > 0 ? recipeIngredients : [],
        steps:
          validSteps.length > 0
            ? validSteps
            : [{ order: 1, description: 'Finalizar instruções...' }],
        categories: formData.categoryIds.length > 0 ? formData.categoryIds : [],
      }

      let createdRecipe: any

      try {
        // Tentar criar com autenticação primeiro
        createdRecipe = await recipesService.createDraft(draftData)
        console.log('✅ [CREATE-RECIPE] Rascunho criado com autenticação:', createdRecipe)
      } catch (authError: any) {
        console.log('⚠️ [CREATE-RECIPE] Erro com autenticação, tentando sem auth...')

        if (authError?.response?.status === 401) {
          try {
            // Tentar criar sem autenticação (modo desenvolvimento)
            createdRecipe = await tryCreateWithoutAuth(draftData, 'DRAFT')
            console.log(
              '✅ [CREATE-RECIPE] Rascunho criado sem autenticação:',
              createdRecipe,
            )
          } catch (noAuthError) {
            console.error('❌ [CREATE-RECIPE] Erro mesmo sem autenticação:', noAuthError)
            throw authError // Re-throw o erro original de auth
          }
        } else {
          throw authError
        }
      }

      // A API retorna a receita dentro de um objeto "recipe"
      const recipeId = createdRecipe?.recipe?.id || createdRecipe?.id
      if (recipeId) {
        // Limpar o formulário antes de redirecionar
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
        // Redirecionar para a receita criada como rascunho
        router.push(`/(auth)/recipe-[id]?id=${recipeId}`)
      } else {
        console.error('❌ Rascunho criado mas sem ID:', createdRecipe)
        setValidationErrors({
          general: 'Rascunho salvo mas não foi possível redirecionar.',
        })
      }
    } catch (err: any) {
      console.error('Erro ao salvar rascunho:', err)

      // Tratar erro 401 especificamente
      if (err?.response?.status === 401) {
        setValidationErrors({
          general: 'Sessão expirada. Faça login novamente para continuar.',
        })
        // Limpar token inválido
        await authToken.remove()
      } else {
        setValidationErrors({ general: 'Erro ao salvar rascunho. Tente novamente.' })
      }
    } finally {
      setIsSavingDraft(false)
    }
  }, [
    formData,
    router,
    validateForm,
    isSavingDraft,
    isSignedIn,
    ensureTokenSync,
    tryCreateWithoutAuth,
  ])

  // Salvar receita
  const saveRecipe = useCallback(async () => {
    // Prevenir múltiplos cliques
    if (isPublishing) return

    // Verificar se o usuário está autenticado
    if (!isSignedIn) {
      setValidationErrors({
        general: 'Você precisa estar logado para publicar receitas.',
      })
      return
    }

    // Verificar se o token está sincronizado
    const token = await ensureTokenSync()
    if (!token) {
      setValidationErrors({
        general: 'Erro de autenticação. O token pode ter expirado. Faça login novamente.',
      })
      return
    }

    if (!validateForm(false)) {
      return
    }

    try {
      setIsPublishing(true)

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

      // Tentar criar ingredientes no banco de dados
      let recipeIngredients: Array<{
        ingredientId: string
        amount: number
        unit: string
      }> = []

      try {
        const createdIngredients: ApiIngredient[] =
          await ingredientsService.createMultiple(validIngredientNames)

        // Mapear ingredientes criados para o formato da receita
        recipeIngredients = formData.ingredients
          .filter((ing) => ing.name.trim() && ing.amount.trim() && ing.unit.trim())
          .map((ing) => {
            // A API retorna o ingrediente diretamente
            const createdIngredient = createdIngredients.find(
              (ci) => ci?.name?.toLowerCase() === ing.name.trim().toLowerCase(),
            )
            const ingredientId = createdIngredient?.id
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

      // Filtrar imagens válidas (URLs de upload)
      const validImages = (formData.images || []).filter(
        (img) => img.trim() && img.startsWith('http'),
      )

      const recipeData: CreateRecipeRequest = {
        title: formData.title.trim(),
        description: (formData.description || '').trim(),
        difficulty: formData.difficulty,
        prepTime: formData.preparationTime,
        servings: formData.servings,
        videoUrl: formData.videoUrl?.trim() || undefined,
        calories: formData.calories,
        proteinGrams: formData.proteinGrams,
        carbGrams: formData.carbGrams,
        fatGrams: formData.fatGrams,
        images: validImages.length > 0 ? validImages : [],
        ingredients: recipeIngredients,
        steps: validSteps,
        categories: formData.categoryIds,
      }

      console.log('🚀 [CREATE-RECIPE] Dados da receita para PUBLICAÇÃO:', {
        ...recipeData,
        status: 'PUBLISHED (será definido pelo serviço)',
      })

      let createdRecipe: any

      try {
        // Tentar criar com autenticação primeiro
        createdRecipe = await recipesService.create(recipeData)
        console.log('✅ [CREATE-RECIPE] Receita criada com autenticação:', createdRecipe)
      } catch (authError: any) {
        console.log('⚠️ [CREATE-RECIPE] Erro com autenticação, tentando sem auth...')

        if (authError?.response?.status === 401) {
          try {
            // Tentar criar sem autenticação (modo desenvolvimento)
            createdRecipe = await tryCreateWithoutAuth(recipeData, 'PUBLISHED')
            console.log(
              '✅ [CREATE-RECIPE] Receita criada sem autenticação:',
              createdRecipe,
            )
          } catch (noAuthError) {
            console.error('❌ [CREATE-RECIPE] Erro mesmo sem autenticação:', noAuthError)
            throw authError // Re-throw o erro original de auth
          }
        } else {
          throw authError
        }
      }

      // A API retorna a receita dentro de um objeto "recipe"
      const recipeId = createdRecipe?.recipe?.id || createdRecipe?.id
      if (recipeId) {
        // Limpar o formulário antes de redirecionar
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
        // Redirecionar para a receita criada
        router.push(`/(auth)/recipe-[id]?id=${recipeId}`)
      } else {
        console.error('❌ Receita criada mas sem ID:', createdRecipe)
        setValidationErrors({
          general:
            'Receita criada mas não foi possível redirecionar. Verifique a lista de receitas.',
        })
      }
    } catch (err: any) {
      console.error('Erro ao criar receita:', err)

      // Tratar erro 401 especificamente
      if (err?.response?.status === 401) {
        setValidationErrors({
          general: 'Sessão expirada. Faça login novamente para continuar.',
        })
        // Limpar token inválido
        await authToken.remove()
      } else {
        setValidationErrors({ general: 'Erro ao criar receita. Tente novamente.' })
      }
    } finally {
      setIsPublishing(false)
    }
  }, [
    formData,
    validateForm,
    router,
    isPublishing,
    isSignedIn,
    ensureTokenSync,
    tryCreateWithoutAuth,
  ])

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
    isPublishing,
    isSavingDraft,
    categories,
    categoriesLoading,
    validationErrors,
    ingredientErrors,

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
    saveRecipeAsDraft,
    clearForm,
    validateForm,
    validateIngredient,
  }
}
