import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type { ShoppingListItem } from '@/contexts/ShoppingListContext'

interface ShoppingListViewProps {
  // Dados
  stats: {
    totalItems: number
    purchasedItems: number
    unpurchasedItems: number
  }
  groupedItems: Array<{
    recipeId?: string
    recipeName?: string
    items: ShoppingListItem[]
  }>
  isLoading: boolean

  // Estados locais
  isAddingItem: boolean
  newItemName: string
  newItemQuantity: string
  newItemUnit: string
  showPurchased: boolean

  // Handlers
  handleAddItem: () => void
  handleToggleItem: (id: string) => void
  handleRemoveItem: (id: string) => void
  handleClearAll: () => void
  handleClearPurchased: () => void
  handleSyncWithBackend: () => void
  handleGoBack: () => void

  // Setters
  setIsAddingItem: (value: boolean) => void
  setNewItemName: (value: string) => void
  setNewItemQuantity: (value: string) => void
  setNewItemUnit: (value: string) => void
  setShowPurchased: (value: boolean) => void
}

export const ShoppingListView = React.memo(function ShoppingListView({
  stats,
  groupedItems,
  isLoading,
  isAddingItem,
  newItemName,
  newItemQuantity,
  newItemUnit,
  showPurchased,
  handleAddItem,
  handleToggleItem,
  handleRemoveItem,
  handleClearAll,
  handleClearPurchased,
  handleSyncWithBackend,
  handleGoBack,
  setIsAddingItem,
  setNewItemName,
  setNewItemQuantity,
  setNewItemUnit,
  setShowPurchased,
}: ShoppingListViewProps) {
  const renderItem = ({ item }: { item: ShoppingListItem }) => {
    if (!showPurchased && item.isPurchased) return null

    return (
      <Card className='mb-3 p-4 bg-white border border-gray-200'>
        <HStack className='items-center justify-between'>
          <HStack className='flex-1 items-center space-x-3 gap-3'>
            <TouchableOpacity
              onPress={() => handleToggleItem(item.id)}
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                item.isPurchased ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}
            >
              {item.isPurchased && <Ionicons name='checkmark' size={16} color='white' />}
            </TouchableOpacity>

            <VStack className='flex-1'>
              <Text
                className={`text-base font-medium ${
                  item.isPurchased ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {item.name}
              </Text>
              {(item.quantity || item.unit) && (
                <Text className='text-sm text-gray-500'>
                  {item.quantity} {item.unit}
                </Text>
              )}
              {item.recipeName && (
                <Text className='text-xs text-blue-500 mt-1'>📖 {item.recipeName}</Text>
              )}
            </VStack>
          </HStack>

          <TouchableOpacity onPress={() => handleRemoveItem(item.id)} className='p-2'>
            <Ionicons name='trash-outline' size={20} color='#EF4444' />
          </TouchableOpacity>
        </HStack>
      </Card>
    )
  }

  const renderGroupedItems = () => {
    if (isLoading) {
      return (
        <VStack className='items-center py-12 space-y-4'>
          <ActivityIndicator size='large' color='#8B5CF6' />
          <Text className='text-lg font-medium text-gray-500'>Sincronizando...</Text>
          <Text className='text-sm text-gray-400 text-center px-8'>
            Buscando dados do servidor
          </Text>
        </VStack>
      )
    }

    if (groupedItems.length === 0) {
      return (
        <VStack className='items-center py-12 space-y-4'>
          <Ionicons name='basket-outline' size={64} color='#9CA3AF' />
          <Text className='text-xl font-semibold text-gray-500'>
            Lista de Compras Vazia
          </Text>
          <Text className='text-sm text-gray-400 text-center px-8'>
            Adicione ingredientes das suas receitas favoritas ou crie itens personalizados
          </Text>
        </VStack>
      )
    }

    return (
      <VStack className='space-y-4 mb-12 gap-4'>
        {groupedItems.map((group) => (
          <VStack key={group.recipeId || 'manual'} className='space-y-2 gap-2'>
            {group.recipeName && (
              <HStack className='items-center space-x-2 gap-2 mb-2'>
                <Ionicons name='book-outline' size={16} color='#3B82F6' />
                <Text className='text-sm font-semibold text-blue-600'>
                  {group.recipeName}
                </Text>
                <Text className='text-xs text-gray-400'>
                  ({group.items.length} itens)
                </Text>
              </HStack>
            )}

            {group.items.map((item) => (
              <View key={item.id}>{renderItem({ item })}</View>
            ))}
          </VStack>
        ))}
      </VStack>
    )
  }

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white border-b border-gray-200 px-4 py-4 mt-8'>
        <HStack className='items-center justify-between'>
          <HStack className='items-center space-x-3 gap-3'>
            <TouchableOpacity onPress={handleGoBack} className='p-2'>
              <Ionicons name='arrow-back' size={24} color='#374151' />
            </TouchableOpacity>
            <VStack>
              <Text className='text-2xl font-bold text-gray-900'>Lista de Compras</Text>
              <Text className='text-sm text-gray-500'>
                {stats.totalItems} itens • {stats.purchasedItems} comprados
              </Text>
            </VStack>
          </HStack>

          <Button
            onPress={handleSyncWithBackend}
            disabled={isLoading}
            variant='outline'
            className='border-purple-300'
            size='sm'
          >
            <HStack className='items-center space-x-1 gap-1'>
              {isLoading ? (
                <ActivityIndicator size='small' color='#8B5CF6' />
              ) : (
                <Ionicons name='refresh' size={16} color='#8B5CF6' />
              )}
              <ButtonText className='text-purple-600'>
                {isLoading ? 'Sincronizando...' : 'Sincronizar'}
              </ButtonText>
            </HStack>
          </Button>
        </HStack>
      </View>

      <ScrollView className='flex-1 px-4 py-4'>
        {/* Estatísticas */}
        {stats.totalItems > 0 && (
          <Card className='mb-4 p-4 bg-purple-500'>
            <HStack className='items-center justify-between'>
              <VStack>
                <Text className='text-white font-semibold text-lg'>
                  Progresso da Lista
                </Text>
                <Text className='text-purple-100 text-sm'>
                  {stats.purchasedItems} de {stats.totalItems} itens comprados
                </Text>
              </VStack>
              <View className='items-center'>
                <Text className='text-white font-bold text-2xl'>
                  {Math.round((stats.purchasedItems / stats.totalItems) * 100)}%
                </Text>
                <Text className='text-purple-100 text-xs'>Concluído</Text>
              </View>
            </HStack>
          </Card>
        )}

        {/* Controles */}
        <HStack className='space-x-2 gap-2 mb-4'>
          <Button
            onPress={() => setIsAddingItem(true)}
            className='flex-1 bg-green-500'
            size='sm'
          >
            <ButtonText className='text-white'>Adicionar Item</ButtonText>
          </Button>

          <Button
            onPress={() => setShowPurchased(!showPurchased)}
            variant='outline'
            className='flex-1 border-blue-300'
            size='sm'
          >
            <ButtonText className='text-blue-600'>
              {showPurchased ? 'Ocultar' : 'Mostrar'} Comprados
            </ButtonText>
          </Button>
        </HStack>

        {/* Ações em lote */}
        {stats.totalItems > 0 && (
          <HStack className='space-x-2 gap-2 mb-4'>
            <Button
              onPress={handleClearPurchased}
              variant='outline'
              className='flex-1 bg-red-500 border-1 border-white'
              size='sm'
            >
              <ButtonText className='text-white'>Limpar Comprados</ButtonText>
            </Button>

            <Button
              onPress={handleClearAll}
              variant='outline'
              className='flex-1 bg-red-500 border-1 border-white'
              size='sm'
            >
              <ButtonText className='text-white'>Limpar Tudo</ButtonText>
            </Button>
          </HStack>
        )}

        {/* Formulário de adicionar item */}
        {isAddingItem && (
          <Card className='mb-4 p-4 bg-white border border-gray-200'>
            <VStack className='space-y-3 gap-3'>
              <Text className='text-lg font-semibold text-gray-900'>
                Adicionar Novo Item
              </Text>

              <Input className='border border-gray-300'>
                <InputField
                  placeholder='Nome do item'
                  value={newItemName}
                  onChangeText={setNewItemName}
                  autoFocus
                />
              </Input>

              <HStack className='space-x-2 gap-2'>
                <Input className='flex-1 border border-gray-300'>
                  <InputField
                    placeholder='Quantidade'
                    value={newItemQuantity}
                    onChangeText={setNewItemQuantity}
                    keyboardType='numeric'
                  />
                </Input>

                <Input className='flex-1 border border-gray-300'>
                  <InputField
                    placeholder='Unidade (kg, L, etc)'
                    value={newItemUnit}
                    onChangeText={setNewItemUnit}
                  />
                </Input>
              </HStack>

              <HStack className='space-x-2 gap-2'>
                <Button
                  onPress={handleAddItem}
                  className='flex-1 bg-green-500'
                  disabled={!newItemName.trim()}
                >
                  <ButtonText className='text-white'>Adicionar</ButtonText>
                </Button>

                <Button
                  onPress={() => {
                    setIsAddingItem(false)
                    setNewItemName('')
                    setNewItemQuantity('')
                    setNewItemUnit('')
                  }}
                  variant='outline'
                  className='flex-1 border-gray-300'
                >
                  <ButtonText className='text-gray-600'>Cancelar</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Card>
        )}

        {/* Lista de itens */}
        {renderGroupedItems()}
      </ScrollView>
    </View>
  )
})
