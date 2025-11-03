import { shoppingListService } from '@/services/shoppingList'

/**
 * Exemplo de teste para os endpoints da lista de compras
 *
 * Endpoints testados:
 * - POST /api/shopping-list/items (adicionar item)
 * - PATCH /api/shopping-list/items/:itemId/toggle (marcar como comprado)
 * - DELETE /api/shopping-list/items/:itemId (remover item)
 */

export async function testShoppingListEndpoints() {
  console.log('🧪 [TEST] Iniciando testes dos endpoints da lista de compras...')

  try {
    // 1. Adicionar um item de teste
    console.log('📝 [TEST] 1. Adicionando item de teste...')
    const newItem = await shoppingListService.addItem({
      customText: 'Leite',
      amount: 1,
      unit: 'litro',
    })

    console.log('✅ [TEST] Item adicionado:', newItem)
    const itemId = newItem.item.id

    // 2. Marcar como comprado (toggle)
    console.log('🔄 [TEST] 2. Marcando item como comprado...')
    const toggledItem = await shoppingListService.toggleItem(itemId)
    console.log('✅ [TEST] Item marcado como comprado:', toggledItem)

    // 3. Marcar como não comprado (toggle novamente)
    console.log('🔄 [TEST] 3. Marcando item como não comprado...')
    const untoggledItem = await shoppingListService.toggleItem(itemId)
    console.log('✅ [TEST] Item marcado como não comprado:', untoggledItem)

    // 4. Remover o item
    console.log('🗑️ [TEST] 4. Removendo item...')
    await shoppingListService.removeItem(itemId)
    console.log('✅ [TEST] Item removido com sucesso')

    console.log('🎉 [TEST] Todos os testes passaram!')
  } catch (error) {
    console.error('❌ [TEST] Erro nos testes:', error)
    throw error
  }
}

/**
 * Exemplo de uso dos endpoints
 */
export function exampleUsage() {
  console.log(`
📋 Exemplo de uso dos endpoints da lista de compras:

1. Adicionar item:
   const item = await shoppingListService.addItem({
     customText: 'Farinha',
     amount: 500,
     unit: 'g'
   })

2. Marcar como comprado:
   await shoppingListService.toggleItem(item.item.id)

3. Remover item:
   await shoppingListService.removeItem(item.item.id)

4. Atualizar item:
   await shoppingListService.updateItem(item.item.id, {
     customText: 'Farinha de trigo',
     amount: 1000,
     unit: 'g'
   })
`)
}
