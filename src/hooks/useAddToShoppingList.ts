import { useCallback } from 'react'
import { Alert } from 'react-native'
import { useShoppingList as useShoppingListContext } from '@/contexts/ShoppingListContext'
import { shoppingListService } from '@/services'

/**
 * Hook simplificado para adicionar itens à lista de compras
 * Usado em páginas de receita onde não precisamos carregar a lista completa
 */
export function useAddToShoppingList() {
  const { addItemsFromRecipe: addItemsFromRecipeContext } = useShoppingListContext()

  // Adicionar ingredientes de uma receita
  const addRecipeIngredients = useCallback(
    async (
      ingredients: Array<{ name: string; quantity?: string; unit?: string }>,
      recipeId: string,
      recipeName: string,
    ) => {
      try {
        // Adicionar no backend
        const addedItems = await shoppingListService.addItemsFromRecipe({
          recipeId,
          recipeName,
          items: ingredients,
        })

        // Adicionar no contexto local com IDs do backend
        const itemsWithIds = addedItems.map((backendItem) => ({
          id: backendItem.item.id,
          name: backendItem.item.customText || 'Item sem nome',
          quantity: backendItem.item.amount?.toString(),
          unit: backendItem.item.unit,
          recipeId: backendItem.item.recipeId,
          isPurchased: backendItem.item.isChecked,
          addedAt: new Date(backendItem.item.createdAt),
        }))

        addItemsFromRecipeContext(itemsWithIds, recipeId, recipeName)

        console.log(
          '✅ [ADD-TO-LIST] Ingredientes adicionados:',
          addedItems.length,
          'itens',
        )
        return addedItems
      } catch (error) {
        console.error('❌ [ADD-TO-LIST] Erro ao adicionar ingredientes:', error)
        Alert.alert('Erro', 'Não foi possível adicionar os ingredientes à lista')
        throw error
      }
    },
    [addItemsFromRecipeContext],
  )

  return {
    addRecipeIngredients,
  }
}
