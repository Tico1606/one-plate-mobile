import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'
import { useShoppingList } from '@/hooks'

export function useShoppingListPage() {
  // Router para navegação
  const router = useRouter()

  // Hook para gerenciar lista de compras
  const {
    stats,
    groupedItems,
    isLoading,
    addShoppingItem,
    togglePurchaseStatus,
    removeShoppingItem,
    clearShoppingList,
    clearPurchasedItems,
    syncWithBackend,
  } = useShoppingList()

  // Estados locais
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState('')
  const [newItemUnit, setNewItemUnit] = useState('')
  const [showPurchased, setShowPurchased] = useState(false)
  const hasInitialized = useRef(false)

  // Sincronizar quando a tela for aberta (apenas uma vez)
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log('🔄 [SHOPPING-LIST-PAGE] Tela aberta, sincronizando...')
      syncWithBackend()
      hasInitialized.current = true
    }
  }, [syncWithBackend])

  // Handlers
  const handleAddItem = useCallback(() => {
    if (!newItemName.trim()) {
      Alert.alert('Erro', 'Digite o nome do item')
      return
    }

    addShoppingItem(
      newItemName.trim(),
      newItemQuantity.trim() || undefined,
      newItemUnit.trim() || undefined,
    )

    // Limpar campos
    setNewItemName('')
    setNewItemQuantity('')
    setNewItemUnit('')
    setIsAddingItem(false)
  }, [newItemName, newItemQuantity, newItemUnit, addShoppingItem])

  const handleToggleItem = useCallback(
    (id: string) => {
      togglePurchaseStatus(id)
    },
    [togglePurchaseStatus],
  )

  const handleRemoveItem = useCallback(
    (id: string) => {
      Alert.alert('Remover Item', 'Tem certeza que deseja remover este item?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removeShoppingItem(id) },
      ])
    },
    [removeShoppingItem],
  )

  const handleClearAll = useCallback(() => {
    Alert.alert('Limpar Lista', 'Tem certeza que deseja remover todos os itens?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearShoppingList },
    ])
  }, [clearShoppingList])

  const handleClearPurchased = useCallback(() => {
    Alert.alert(
      'Limpar Comprados',
      'Tem certeza que deseja remover todos os itens comprados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: clearPurchasedItems },
      ],
    )
  }, [clearPurchasedItems])

  const handleSyncWithBackend = useCallback(() => {
    syncWithBackend()
  }, [syncWithBackend])

  const handleGoBack = useCallback(() => {
    router.replace('/profile')
  }, [router])

  return {
    // Dados
    stats,
    groupedItems,
    isLoading,

    // Estados locais
    isAddingItem,
    newItemName,
    newItemQuantity,
    newItemUnit,
    showPurchased,

    // Handlers
    handleAddItem,
    handleToggleItem,
    handleRemoveItem,
    handleClearAll,
    handleClearPurchased,
    handleSyncWithBackend,
    handleGoBack,

    // Setters
    setIsAddingItem,
    setNewItemName,
    setNewItemQuantity,
    setNewItemUnit,
    setShowPurchased,
  }
}
