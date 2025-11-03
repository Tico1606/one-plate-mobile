import { useCallback, useRef, useState } from 'react'
import { Alert } from 'react-native'
import { useShoppingList as useShoppingListContext } from '@/contexts/ShoppingListContext'
import { shoppingListService } from '@/services'
import type { ShoppingListItem as BackendShoppingListItem } from '@/services/shoppingList'

export function useShoppingListBackend() {
  const {
    state,
    addItem: addItemContext,
    addItemsFromRecipe: addItemsFromRecipeContext,
    removeItem: removeItemContext,
    clearAll: clearAllContext,
    clearPurchased: clearPurchasedContext,
    updateItem: updateItemContext,
    getItemsByRecipe: getItemsByRecipeContext,
    getPurchasedItems: getPurchasedItemsContext,
    getUnpurchasedItems: getUnpurchasedItemsContext,
  } = useShoppingListContext()

  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)

  // Sincronizar com o backend sob demanda
  const syncWithBackend = useCallback(async () => {
    if (isLoadingRef.current) return

    try {
      isLoadingRef.current = true
      setIsLoading(true)
      console.log('🔄 [SHOPPING-LIST] Sincronizando com backend...')

      const response = await shoppingListService.getItems()
      console.log('✅ [SHOPPING-LIST] Dados recebidos do backend:', response)
      console.log(
        '📊 [SHOPPING-LIST] Itens do backend:',
        response.shoppingList.items.map((item) => ({
          id: item.id,
          name: item.customText,
          isChecked: item.isChecked,
        })),
      )

      // Converter dados do backend para o formato do contexto
      const backendItems = response.shoppingList.items.map(
        (item: BackendShoppingListItem) => ({
          id: item.id,
          name: item.customText || 'Item sem nome',
          quantity: item.amount?.toString(),
          unit: item.unit,
          isPurchased: item.isChecked === true || item.isChecked === 1, // Garantir conversão correta
          addedAt: new Date(item.createdAt),
          recipeId: item.recipeId,
          recipeName: undefined, // Backend não retorna recipeName
        }),
      )

      console.log(
        '✅ [SHOPPING-LIST] Itens convertidos:',
        backendItems.map((item) => ({
          id: item.id,
          name: item.name,
          isPurchased: item.isPurchased,
        })),
      )

      // Preservar recipeName dos itens existentes antes de limpar
      const currentItems = state.items
      const recipeNameMap = new Map<string, string>()
      currentItems.forEach((item) => {
        if (item.recipeName && item.recipeId) {
          recipeNameMap.set(item.recipeId, item.recipeName)
        }
      })

      // Limpar contexto e adicionar dados do backend
      clearAllContext()
      backendItems.forEach((item) => {
        // Preservar recipeName se existir no mapa
        const preservedRecipeName =
          item.recipeId && recipeNameMap.has(item.recipeId)
            ? recipeNameMap.get(item.recipeId)
            : undefined

        addItemContext({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          recipeId: item.recipeId,
          recipeName: preservedRecipeName,
          isPurchased: item.isPurchased,
          addedAt: item.addedAt,
        })
      })

      console.log('✅ [SHOPPING-LIST] Sincronização concluída')
    } catch (error: any) {
      console.error('❌ [SHOPPING-LIST] Erro ao sincronizar com backend:', error)

      // Se for erro 404 (lista não encontrada), tratar como lista vazia
      if (error?.response?.status === 404) {
        console.log('📝 [SHOPPING-LIST] Lista não encontrada, iniciando com lista vazia')
        clearAllContext()
      } else {
        // Para outros erros, manter dados locais
        console.log('⚠️ [SHOPPING-LIST] Erro de sincronização, mantendo dados locais')
      }
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [addItemContext, clearAllContext, state.items])

  // Sincronização manual - só chama quando necessário
  const syncOnDemand = useCallback(async () => {
    console.log('🔄 [SHOPPING-LIST] Iniciando sincronização sob demanda...')
    await syncWithBackend()
  }, [syncWithBackend])

  // Adicionar item com sincronização
  const addItem = useCallback(
    async (item: {
      name: string
      quantity?: string
      unit?: string
      recipeId?: string
      recipeName?: string
    }) => {
      try {
        console.log('➕ [SHOPPING-LIST] Adicionando item:', item)

        // Adicionar no backend primeiro
        const backendItem = await shoppingListService.addItem({
          customText: item.name,
          amount: item.quantity ? parseFloat(item.quantity) : undefined,
          unit: item.unit,
          recipeId: item.recipeId,
        })

        // Adicionar no contexto local com ID do backend
        addItemContext({
          id: backendItem.item.id,
          name: backendItem.item.customText || 'Item sem nome',
          quantity: backendItem.item.amount?.toString(),
          unit: backendItem.item.unit,
          recipeId: backendItem.item.recipeId,
          recipeName: item.recipeName,
          isPurchased: backendItem.item.isChecked,
          addedAt: new Date(backendItem.item.createdAt),
        })

        console.log('✅ [SHOPPING-LIST] Item adicionado com sucesso')
      } catch (error) {
        console.error('❌ [SHOPPING-LIST] Erro ao adicionar item:', error)
        Alert.alert('Erro', 'Não foi possível adicionar o item à lista')
      }
    },
    [addItemContext],
  )

  // Adicionar itens de receita com sincronização
  const addItemsFromRecipe = useCallback(
    async (
      ingredients: Array<{ name: string; quantity?: string; unit?: string }>,
      recipeId: string,
      recipeName: string,
    ) => {
      try {
        console.log('➕ [SHOPPING-LIST] Adicionando itens da receita:', {
          recipeId,
          recipeName,
          count: ingredients.length,
        })

        // Adicionar no backend primeiro
        const backendItems = await shoppingListService.addItemsFromRecipe({
          recipeId,
          recipeName,
          items: ingredients,
        })

        // Adicionar no contexto local com IDs do backend
        const itemsWithIds = backendItems.map((backendItem) => ({
          id: backendItem.item.id,
          name: backendItem.item.customText || 'Item sem nome',
          quantity: backendItem.item.amount?.toString(),
          unit: backendItem.item.unit,
          recipeId: backendItem.item.recipeId,
          isPurchased: backendItem.item.isChecked,
          addedAt: new Date(backendItem.item.createdAt),
        }))

        addItemsFromRecipeContext(itemsWithIds, recipeId, recipeName)

        console.log('✅ [SHOPPING-LIST] Itens da receita adicionados com sucesso')
      } catch (error) {
        console.error('❌ [SHOPPING-LIST] Erro ao adicionar itens da receita:', error)
        Alert.alert('Erro', 'Não foi possível adicionar os ingredientes à lista')
      }
    },
    [addItemsFromRecipeContext],
  )

  // Toggle item com sincronização
  const toggleItem = useCallback(
    async (id: string) => {
      try {
        const currentItem = state.items.find((item) => item.id === id)
        console.log('🔄 [SHOPPING-LIST] Alternando status do item:', id)
        console.log('📊 [SHOPPING-LIST] Estado atual:', {
          id,
          isPurchased: currentItem?.isPurchased,
        })

        // Atualizar no backend primeiro
        const response = await shoppingListService.toggleItem(id)
        console.log('✅ [SHOPPING-LIST] Backend atualizado:', {
          id,
          isChecked: response.item.isChecked,
        })

        // Atualizar no contexto local baseado na resposta do backend
        updateItemContext(id, {
          isPurchased: response.item.isChecked === true || response.item.isChecked === 1,
        })

        console.log('✅ [SHOPPING-LIST] Status do item atualizado localmente')
      } catch (error) {
        console.error('❌ [SHOPPING-LIST] Erro ao alternar status do item:', error)
        Alert.alert('Erro', 'Não foi possível atualizar o item')
      }
    },
    [state.items, updateItemContext],
  )

  // Remover item com sincronização
  const removeItem = useCallback(
    async (id: string) => {
      try {
        console.log('🗑️ [SHOPPING-LIST] Removendo item:', id)

        // Remover do backend
        await shoppingListService.removeItem(id)

        // Remover do contexto local
        removeItemContext(id)

        console.log('✅ [SHOPPING-LIST] Item removido com sucesso')
      } catch (error) {
        console.error('❌ [SHOPPING-LIST] Erro ao remover item:', error)
        Alert.alert('Erro', 'Não foi possível remover o item')
      }
    },
    [removeItemContext],
  )

  // Limpar todos os itens com sincronização
  const clearAll = useCallback(async () => {
    try {
      console.log('🗑️ [SHOPPING-LIST] Limpando todos os itens')

      // Limpar no backend
      await shoppingListService.clearAll()

      // Limpar no contexto local
      clearAllContext()

      console.log('✅ [SHOPPING-LIST] Lista limpa com sucesso')
    } catch (error) {
      console.error('❌ [SHOPPING-LIST] Erro ao limpar lista:', error)
      Alert.alert('Erro', 'Não foi possível limpar a lista')
    }
  }, [clearAllContext])

  // Limpar itens comprados com sincronização
  const clearPurchased = useCallback(async () => {
    try {
      console.log('🗑️ [SHOPPING-LIST] Limpando itens comprados')

      // Limpar no backend
      await shoppingListService.clearPurchased()

      // Limpar no contexto local
      clearPurchasedContext()

      console.log('✅ [SHOPPING-LIST] Itens comprados removidos com sucesso')
    } catch (error) {
      console.error('❌ [SHOPPING-LIST] Erro ao limpar itens comprados:', error)
      Alert.alert('Erro', 'Não foi possível limpar os itens comprados')
    }
  }, [clearPurchasedContext])

  // Atualizar item com sincronização
  const updateItem = useCallback(
    async (
      id: string,
      updates: {
        name?: string
        quantity?: string
        unit?: string
        isPurchased?: boolean
      },
    ) => {
      try {
        console.log('✏️ [SHOPPING-LIST] Atualizando item:', id, updates)

        // Atualizar no backend
        await shoppingListService.updateItem(id, updates)

        // Atualizar no contexto local
        updateItemContext(id, updates)

        console.log('✅ [SHOPPING-LIST] Item atualizado com sucesso')
      } catch (error) {
        console.error('❌ [SHOPPING-LIST] Erro ao atualizar item:', error)
        Alert.alert('Erro', 'Não foi possível atualizar o item')
      }
    },
    [updateItemContext],
  )

  return {
    // Estado
    items: state.items,
    purchasedItems: getPurchasedItemsContext(),
    unpurchasedItems: getUnpurchasedItemsContext(),
    isLoading,

    // Ações sincronizadas com backend
    addItem,
    addItemsFromRecipe,
    toggleItem,
    removeItem,
    clearAll,
    clearPurchased,
    updateItem,
    getItemsByRecipe: getItemsByRecipeContext,
    syncWithBackend: syncOnDemand, // Expor sincronização manual
  }
}
