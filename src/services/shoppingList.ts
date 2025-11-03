import { API_CONFIG } from '@/config/api'
import { del, get, post, put } from './api'

// Interfaces para a lista de compras
export interface ShoppingListItem {
  id: string
  name: string
  quantity?: string
  unit?: string
  isPurchased: boolean
  addedAt: string
  recipeId?: string
  recipeName?: string
  userId: string
}

// Interface específica para o backend (baseada nos logs)
export interface BackendShoppingListItem {
  id: string
  amount: number | null
  customText: string | null
  unit: string
  isChecked: boolean
  createdAt: string
  updatedAt: string
  listId: string
  recipeId?: string
  ingredientId?: string | null
}

export interface CreateShoppingListItemRequest {
  customText: string // Backend usa 'customText' para o nome
  amount?: number // Backend usa 'amount' para a quantidade
  unit?: string
  recipeId?: string
}

export interface UpdateShoppingListItemRequest {
  customText?: string // Backend usa 'customText' para o nome
  amount?: number // Backend usa 'amount' para a quantidade
  unit?: string
}

export interface ShoppingListResponse {
  shoppingList: {
    id: string
    title: string
    items: BackendShoppingListItem[]
    userId: string
    createdAt: string
    updatedAt: string
  }
}

export interface AddItemsFromRecipeRequest {
  recipeId: string
  recipeName: string
  items: Array<{
    name: string
    quantity?: string
    unit?: string
  }>
}

export const shoppingListService = {
  // Buscar todos os itens da lista de compras do usuário
  getItems: async (): Promise<ShoppingListResponse> => {
    try {
      return await get<ShoppingListResponse>(API_CONFIG.ENDPOINTS.SHOPPING_LIST.LIST)
    } catch (error: any) {
      // Se for 404 (lista não encontrada), retornar lista vazia
      if (error?.response?.status === 404) {
        console.log(
          '📝 [SHOPPING-LIST-SERVICE] Lista não encontrada, retornando lista vazia',
        )
        return {
          shoppingList: {
            id: '',
            title: 'Lista Vazia',
            items: [],
            userId: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }
      }
      // Para outros erros, re-lançar
      throw error
    }
  },

  // Adicionar um item à lista
  addItem: async (
    data: CreateShoppingListItemRequest,
  ): Promise<{ item: BackendShoppingListItem }> => {
    return post<{ item: BackendShoppingListItem }>(
      API_CONFIG.ENDPOINTS.SHOPPING_LIST.ADD_ITEM,
      data,
    )
  },

  // Adicionar múltiplos itens de uma receita
  addItemsFromRecipe: async (
    data: AddItemsFromRecipeRequest,
  ): Promise<{ item: BackendShoppingListItem }[]> => {
    // Como não há endpoint específico para receita, vamos adicionar item por item
    const items: { item: BackendShoppingListItem }[] = []

    for (const item of data.items) {
      try {
        const newItem = await shoppingListService.addItem({
          customText: item.name,
          amount: item.quantity ? parseFloat(item.quantity) : undefined,
          unit: item.unit,
          recipeId: data.recipeId,
        })

        items.push(newItem)
      } catch (error) {
        console.error(`Erro ao adicionar item "${item.name}":`, error)
        // Continua com os outros itens mesmo se um falhar
      }
    }

    return items
  },

  // Atualizar um item
  updateItem: async (
    id: string,
    data: UpdateShoppingListItemRequest,
  ): Promise<{ item: BackendShoppingListItem }> => {
    return put<{ item: BackendShoppingListItem }>(
      API_CONFIG.ENDPOINTS.SHOPPING_LIST.UPDATE_ITEM.replace(':itemId', id),
      data,
    )
  },

  // Marcar item como comprado/não comprado
  toggleItem: async (id: string): Promise<{ item: BackendShoppingListItem }> => {
    return put<{ item: BackendShoppingListItem }>(
      API_CONFIG.ENDPOINTS.SHOPPING_LIST.TOGGLE_ITEM.replace(':itemId', id),
      {},
    )
  },

  // Remover um item
  removeItem: async (id: string): Promise<void> => {
    return del<void>(
      API_CONFIG.ENDPOINTS.SHOPPING_LIST.REMOVE_ITEM.replace(':itemId', id),
    )
  },

  // Limpar todos os itens
  clearAll: async (): Promise<void> => {
    return del<void>(API_CONFIG.ENDPOINTS.SHOPPING_LIST.CLEAR_ALL)
  },

  // Limpar apenas itens comprados
  clearPurchased: async (): Promise<void> => {
    return del<void>(API_CONFIG.ENDPOINTS.SHOPPING_LIST.CLEAR_PURCHASED)
  },

  // Buscar itens por receita (implementação local já que não há endpoint específico)
  getItemsByRecipe: async (recipeId: string): Promise<ShoppingListItem[]> => {
    const response = await shoppingListService.getItems()
    return response.shoppingList.items.filter((item) => item.recipeId === recipeId)
  },

  // Buscar estatísticas da lista (implementação local já que não há endpoint específico)
  getStats: async (): Promise<{
    total: number
    purchased: number
    unpurchased: number
    completionPercentage: number
  }> => {
    const response = await shoppingListService.getItems()
    const items = response.shoppingList.items
    const total = items.length
    const purchased = items.filter((item) => item.isPurchased).length
    const unpurchased = total - purchased
    const completionPercentage = total > 0 ? Math.round((purchased / total) * 100) : 0

    return {
      total,
      purchased,
      unpurchased,
      completionPercentage,
    }
  },
}
