import { useCallback } from 'react'
import type { ShoppingListItem } from '@/contexts/ShoppingListContext'
import { useShoppingListBackend } from './useShoppingListBackend'

export function useShoppingList() {
  const {
    items,
    purchasedItems,
    unpurchasedItems,
    isLoading,
    addItem,
    addItemsFromRecipe,
    toggleItem,
    removeItem,
    clearAll,
    clearPurchased,
    updateItem,
    getItemsByRecipe,
    syncWithBackend,
  } = useShoppingListBackend()

  // Adicionar item manualmente
  const addShoppingItem = useCallback(
    (name: string, quantity?: string, unit?: string) => {
      addItem({
        name: name.trim(),
        quantity: quantity?.trim(),
        unit: unit?.trim(),
      })
    },
    [addItem],
  )

  // Adicionar ingredientes de uma receita
  const addRecipeIngredients = useCallback(
    (
      ingredients: Array<{ name: string; quantity?: string; unit?: string }>,
      recipeId: string,
      recipeName: string,
    ) => {
      const items = ingredients.map((ingredient) => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity?.trim(),
        unit: ingredient.unit?.trim(),
      }))

      addItemsFromRecipe(items, recipeId, recipeName)
    },
    [addItemsFromRecipe],
  )

  // Marcar item como comprado/não comprado
  const togglePurchaseStatus = useCallback(
    (id: string) => {
      toggleItem(id)
    },
    [toggleItem],
  )

  // Remover item específico
  const removeShoppingItem = useCallback(
    (id: string) => {
      removeItem(id)
    },
    [removeItem],
  )

  // Limpar toda a lista
  const clearShoppingList = useCallback(() => {
    clearAll()
  }, [clearAll])

  // Limpar apenas itens comprados
  const clearPurchasedItems = useCallback(() => {
    clearPurchased()
  }, [clearPurchased])

  // Atualizar item
  const updateShoppingItem = useCallback(
    (id: string, updates: Partial<ShoppingListItem>) => {
      updateItem(id, updates)
    },
    [updateItem],
  )

  // Obter estatísticas da lista
  const getListStats = useCallback(() => {
    const totalItems = items.length
    const purchasedItemsCount = purchasedItems.length
    const unpurchasedItemsCount = unpurchasedItems.length
    const completionPercentage =
      totalItems > 0 ? Math.round((purchasedItemsCount / totalItems) * 100) : 0

    return {
      totalItems,
      purchasedItems: purchasedItemsCount,
      unpurchasedItems: unpurchasedItemsCount,
      completionPercentage,
    }
  }, [items.length, purchasedItems.length, unpurchasedItems.length])

  // Verificar se um item já existe na lista
  const isItemInList = useCallback(
    (name: string) => {
      return items.some(
        (item) => item.name.toLowerCase().trim() === name.toLowerCase().trim(),
      )
    },
    [items],
  )

  // Obter itens agrupados por receita
  const getItemsGroupedByRecipe = useCallback(() => {
    const grouped = items.reduce(
      (acc, item) => {
        const key = item.recipeName || 'Outros'
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(item)
        return acc
      },
      {} as Record<string, ShoppingListItem[]>,
    )

    return Object.entries(grouped)
      .map(([recipeName, items]) => ({
        recipeId: items[0]?.recipeId, // Preservar recipeId para o primeiro item do grupo
        recipeName,
        items: items.sort((a, b) => {
          // Ordenar: comprados primeiro (true antes de false)
          if (a.isPurchased !== b.isPurchased) {
            return a.isPurchased ? -1 : 1
          }
          // Se ambos têm o mesmo status, manter ordem original (por nome)
          return a.name.localeCompare(b.name)
        }),
        totalItems: items.length,
        purchasedItems: items.filter((item) => item.isPurchased).length,
      }))
      .sort((a, b) => {
        // Ordenar grupos: grupos com itens comprados primeiro
        const aHasPurchased = a.purchasedItems > 0
        const bHasPurchased = b.purchasedItems > 0

        if (aHasPurchased !== bHasPurchased) {
          return aHasPurchased ? -1 : 1
        }

        // Se ambos têm ou não têm comprados, manter ordem alfabética
        return (a.recipeName || '').localeCompare(b.recipeName || '')
      })
  }, [items])

  return {
    // Estado
    items,
    purchasedItems,
    unpurchasedItems,
    stats: getListStats(),
    groupedItems: getItemsGroupedByRecipe(),
    isLoading,

    // Ações
    addShoppingItem,
    addRecipeIngredients,
    togglePurchaseStatus,
    removeShoppingItem,
    clearShoppingList,
    clearPurchasedItems,
    updateShoppingItem,
    getItemsByRecipe,
    isItemInList,
    syncWithBackend, // Expor sincronização manual
  }
}
