/**
 * Exemplo de teste para a integração da lista de compras com o backend
 *
 * Este arquivo demonstra como testar a funcionalidade da lista de compras
 * conectada ao backend. Execute este código para verificar se a integração
 * está funcionando corretamente.
 */

import { shoppingListService } from '@/services/shoppingList'

export async function testShoppingListBackend() {
  console.log('🧪 [TEST] Iniciando testes da lista de compras com backend...')

  try {
    // Teste 1: Buscar itens da lista
    console.log('📋 [TEST] Testando busca de itens...')
    const items = await shoppingListService.getItems()
    console.log('✅ [TEST] Itens encontrados:', items)

    // Teste 2: Adicionar um item
    console.log('➕ [TEST] Testando adição de item...')
    const newItem = await shoppingListService.addItem({
      name: 'Leite',
      quantity: '1',
      unit: 'L',
    })
    console.log('✅ [TEST] Item adicionado:', newItem)

    // Teste 3: Adicionar itens de uma receita
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

    // Teste 4: Marcar item como comprado
    console.log('✅ [TEST] Testando marcação de item como comprado...')
    const toggledItem = await shoppingListService.toggleItem(newItem.id)
    console.log('✅ [TEST] Item marcado como comprado:', toggledItem)

    // Teste 5: Buscar estatísticas
    console.log('📊 [TEST] Testando busca de estatísticas...')
    const stats = await shoppingListService.getStats()
    console.log('✅ [TEST] Estatísticas:', stats)

    // Teste 6: Buscar itens por receita
    console.log('🔍 [TEST] Testando busca de itens por receita...')
    const recipeItemsList = await shoppingListService.getItemsByRecipe('recipe-123')
    console.log('✅ [TEST] Itens da receita:', recipeItemsList)

    // Teste 7: Atualizar item
    console.log('✏️ [TEST] Testando atualização de item...')
    const updatedItem = await shoppingListService.updateItem(newItem.id, {
      name: 'Leite desnatado',
      quantity: '2',
    })
    console.log('✅ [TEST] Item atualizado:', updatedItem)

    // Teste 8: Limpar itens comprados
    console.log('🗑️ [TEST] Testando limpeza de itens comprados...')
    await shoppingListService.clearPurchased()
    console.log('✅ [TEST] Itens comprados removidos')

    // Teste 9: Buscar itens finais
    console.log('📋 [TEST] Verificando estado final...')
    const finalItems = await shoppingListService.getItems()
    console.log('✅ [TEST] Estado final:', finalItems)

    console.log('🎉 [TEST] Todos os testes passaram!')
    return true
  } catch (error) {
    console.error('❌ [TEST] Erro durante os testes:', error)
    return false
  }
}

// Função para testar apenas a conexão
export async function testBackendConnection() {
  console.log('🔌 [TEST] Testando conexão com o backend...')

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

// Função para limpar todos os dados de teste
export async function cleanupTestData() {
  console.log('🧹 [TEST] Limpando dados de teste...')

  try {
    await shoppingListService.clearAll()
    console.log('✅ [TEST] Dados de teste removidos')
    return true
  } catch (error) {
    console.error('❌ [TEST] Erro ao limpar dados:', error)
    return false
  }
}
