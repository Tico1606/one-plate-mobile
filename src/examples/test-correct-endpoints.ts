/**
 * Teste de conexão com os endpoints corretos da lista de compras
 *
 * Execute este código para verificar se a integração está funcionando
 * com os endpoints reais do backend.
 */

import { shoppingListService } from '@/services/shoppingList'

export async function testCorrectEndpoints() {
  console.log('🧪 [TEST] Testando endpoints corretos da lista de compras...')

  try {
    // Teste 1: Buscar itens (GET /api/shopping-list)
    console.log('📋 [TEST] Testando GET /api/shopping-list...')
    const items = await shoppingListService.getItems()
    console.log('✅ [TEST] Itens encontrados:', items)

    // Teste 2: Adicionar um item (POST /api/shopping-list/items)
    console.log('➕ [TEST] Testando POST /api/shopping-list/items...')
    const newItem = await shoppingListService.addItem({
      name: 'Leite',
      quantity: '1',
      unit: 'L',
    })
    console.log('✅ [TEST] Item adicionado:', newItem)

    // Teste 3: Marcar como comprado (PATCH /api/shopping-list/items/:itemId/toggle)
    console.log('✅ [TEST] Testando PATCH /api/shopping-list/items/:itemId/toggle...')
    const toggledItem = await shoppingListService.toggleItem(newItem.id)
    console.log('✅ [TEST] Item marcado como comprado:', toggledItem)

    // Teste 4: Atualizar item (PUT /api/shopping-list/items/:itemId)
    console.log('✏️ [TEST] Testando PUT /api/shopping-list/items/:itemId...')
    const updatedItem = await shoppingListService.updateItem(newItem.id, {
      name: 'Leite desnatado',
      quantity: '2',
    })
    console.log('✅ [TEST] Item atualizado:', updatedItem)

    // Teste 5: Adicionar ingredientes de receita (múltiplos POST)
    console.log('🍳 [TEST] Testando adição de ingredientes de receita...')
    const recipeItems = await shoppingListService.addItemsFromRecipe({
      recipeId: 'recipe-123',
      recipeName: 'Macarrão à Bolonhesa',
      items: [
        { name: 'Macarrão', quantity: '500', unit: 'g' },
        { name: 'Carne moída', quantity: '300', unit: 'g' },
        { name: 'Molho de tomate', quantity: '1', unit: 'lata' },
      ],
    })
    console.log('✅ [TEST] Itens da receita adicionados:', recipeItems.length, 'itens')

    // Teste 6: Buscar estatísticas
    console.log('📊 [TEST] Testando busca de estatísticas...')
    const stats = await shoppingListService.getStats()
    console.log('✅ [TEST] Estatísticas:', stats)

    // Teste 7: Limpar itens comprados (DELETE /api/shopping-list/checked-items)
    console.log('🗑️ [TEST] Testando DELETE /api/shopping-list/checked-items...')
    await shoppingListService.clearPurchased()
    console.log('✅ [TEST] Itens comprados removidos')

    // Teste 8: Remover item específico (DELETE /api/shopping-list/items/:itemId)
    console.log('🗑️ [TEST] Testando DELETE /api/shopping-list/items/:itemId...')
    await shoppingListService.removeItem(newItem.id)
    console.log('✅ [TEST] Item removido')

    // Teste 9: Limpar tudo (DELETE /api/shopping-list)
    console.log('🗑️ [TEST] Testando DELETE /api/shopping-list...')
    await shoppingListService.clearAll()
    console.log('✅ [TEST] Lista limpa')

    console.log('🎉 [TEST] Todos os testes com endpoints corretos passaram!')
    return true
  } catch (error) {
    console.error('❌ [TEST] Erro durante os testes:', error)
    return false
  }
}

// Função para testar apenas a conexão básica
export async function testBasicConnection() {
  console.log('🔌 [TEST] Testando conexão básica com endpoints corretos...')

  try {
    const items = await shoppingListService.getItems()
    console.log('✅ [TEST] Conexão com backend funcionando!')
    console.log('📊 [TEST] Itens encontrados:', items.total)
    return true
  } catch (error) {
    console.error('❌ [TEST] Erro de conexão:', error)
    return false
  }
}
