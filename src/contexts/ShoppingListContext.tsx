import { createContext, type ReactNode, useContext, useReducer } from 'react'

export interface ShoppingListItem {
  id: string
  name: string
  quantity?: string
  unit?: string
  isPurchased: boolean
  addedAt: Date
  recipeId?: string
  recipeName?: string
}

interface ShoppingListState {
  items: ShoppingListItem[]
}

type ShoppingListAction =
  | {
      type: 'ADD_ITEM'
      payload: Partial<ShoppingListItem> & { name: string }
    }
  | {
      type: 'ADD_ITEMS_FROM_RECIPE'
      payload: {
        items: (Partial<ShoppingListItem> & { name: string })[]
        recipeId: string
        recipeName: string
      }
    }
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_PURCHASED' }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<ShoppingListItem> } }

const initialState: ShoppingListState = {
  items: [],
}

function shoppingListReducer(
  state: ShoppingListState,
  action: ShoppingListAction,
): ShoppingListState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem: ShoppingListItem = {
        ...action.payload,
        id:
          action.payload.id ||
          Date.now().toString() + Math.random().toString(36).substr(2, 9),
        isPurchased: action.payload.isPurchased ?? false,
        addedAt: action.payload.addedAt || new Date(),
      }
      return {
        ...state,
        items: [...state.items, newItem],
      }
    }

    case 'ADD_ITEMS_FROM_RECIPE': {
      const newItems: ShoppingListItem[] = action.payload.items.map((item) => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        isPurchased: item.isPurchased ?? false,
        addedAt: item.addedAt || new Date(),
        recipeId: item.recipeId || action.payload.recipeId,
        recipeName: item.recipeName || action.payload.recipeName,
      }))
      return {
        ...state,
        items: [...state.items, ...newItems],
      }
    }

    case 'TOGGLE_ITEM': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, isPurchased: !item.isPurchased } : item,
        ),
      }
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    }

    case 'CLEAR_ALL': {
      return {
        ...state,
        items: [],
      }
    }

    case 'CLEAR_PURCHASED': {
      return {
        ...state,
        items: state.items.filter((item) => !item.isPurchased),
      }
    }

    case 'UPDATE_ITEM': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item,
        ),
      }
    }

    default:
      return state
  }
}

interface ShoppingListContextType {
  state: ShoppingListState
  addItem: (item: Partial<ShoppingListItem> & { name: string }) => void
  addItemsFromRecipe: (
    items: (Partial<ShoppingListItem> & { name: string })[],
    recipeId: string,
    recipeName: string,
  ) => void
  toggleItem: (id: string) => void
  removeItem: (id: string) => void
  clearAll: () => void
  clearPurchased: () => void
  updateItem: (id: string, updates: Partial<ShoppingListItem>) => void
  getItemsByRecipe: (recipeId: string) => ShoppingListItem[]
  getPurchasedItems: () => ShoppingListItem[]
  getUnpurchasedItems: () => ShoppingListItem[]
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined)

interface ShoppingListProviderProps {
  children: ReactNode
}

export function ShoppingListProvider({ children }: ShoppingListProviderProps) {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState)

  const addItem = (item: Partial<ShoppingListItem> & { name: string }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const addItemsFromRecipe = (
    items: (Partial<ShoppingListItem> & { name: string })[],
    recipeId: string,
    recipeName: string,
  ) => {
    dispatch({ type: 'ADD_ITEMS_FROM_RECIPE', payload: { items, recipeId, recipeName } })
  }

  const toggleItem = (id: string) => {
    dispatch({ type: 'TOGGLE_ITEM', payload: id })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' })
  }

  const clearPurchased = () => {
    dispatch({ type: 'CLEAR_PURCHASED' })
  }

  const updateItem = (id: string, updates: Partial<ShoppingListItem>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } })
  }

  const getItemsByRecipe = (recipeId: string) => {
    return state.items.filter((item) => item.recipeId === recipeId)
  }

  const getPurchasedItems = () => {
    return state.items.filter((item) => item.isPurchased)
  }

  const getUnpurchasedItems = () => {
    return state.items.filter((item) => !item.isPurchased)
  }

  const value: ShoppingListContextType = {
    state,
    addItem,
    addItemsFromRecipe,
    toggleItem,
    removeItem,
    clearAll,
    clearPurchased,
    updateItem,
    getItemsByRecipe,
    getPurchasedItems,
    getUnpurchasedItems,
  }

  return (
    <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>
  )
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext)
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider')
  }
  return context
}
