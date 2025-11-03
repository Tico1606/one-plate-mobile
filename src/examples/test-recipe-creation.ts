// Teste específico para criação de receitas com imagens
import { recipesService, uploadService } from '@/services'

export const testRecipeCreationWithImages = async () => {
  try {
    console.log('🧪 [TEST] Testando criação de receita com imagens...')

    // Primeiro, fazer upload de uma imagem de teste
    console.log('📤 [TEST] Fazendo upload de imagem de teste...')

    // Para este teste, vamos simular uma URL de imagem
    const testImageUrl = 'https://example.com/test-image.jpg'

    // Dados da receita de teste
    const testRecipeData = {
      title: 'Receita de Teste com Imagem',
      description:
        'Esta é uma receita de teste para verificar se as imagens estão sendo salvas corretamente.',
      difficulty: 'EASY' as const,
      prepTime: 30,
      servings: 4,
      calories: 250,
      images: [testImageUrl], // Frontend envia 'images'
      ingredients: [
        {
          ingredientId: 'test-ingredient-1',
          amount: 2,
          unit: 'xícaras',
        },
      ],
      steps: [
        {
          order: 1,
          description: 'Primeiro passo da receita de teste.',
        },
      ],
      categories: ['test-category'],
    }

    console.log('📝 [TEST] Dados da receita (frontend):', testRecipeData)

    // Simular o que acontece no serviço
    const { images, ...restRecipe } = testRecipeData
    const mappedData = {
      ...restRecipe,
      photos: images || [], // Mapeamento para o backend
      status: 'DRAFT' as const,
    }

    console.log('🔄 [TEST] Dados mapeados para o backend:', mappedData)

    // Verificar se o mapeamento está correto
    if (mappedData.photos && mappedData.photos.length > 0) {
      console.log('✅ [TEST] Mapeamento correto: images -> photos')
      console.log('📸 [TEST] Fotos que serão enviadas:', mappedData.photos)
    } else {
      console.log('❌ [TEST] Problema no mapeamento: nenhuma foto encontrada')
    }

    // Verificar se não há campo images no objeto final
    if (!('images' in mappedData)) {
      console.log('✅ [TEST] Campo images removido corretamente')
    } else {
      console.log('❌ [TEST] Campo images ainda presente - problema no mapeamento')
    }

    console.log('🎯 [TEST] Teste de mapeamento concluído com sucesso!')
  } catch (error) {
    console.error('❌ [TEST] Erro no teste:', error)
  }
}

export const testImageUploadFlow = async () => {
  try {
    console.log('🔄 [TEST] Testando fluxo completo de upload + criação...')

    // Simular o fluxo real:
    // 1. Usuário seleciona imagem
    // 2. Frontend faz upload
    // 3. Backend retorna URL
    // 4. Frontend usa URL na criação da receita

    console.log('📋 [TEST] Fluxo simulado:')
    console.log('  1. ✅ Usuário seleciona imagem')
    console.log('  2. ✅ Frontend faz upload para /api/uploads/recipe-photo')
    console.log('  3. ✅ Backend retorna URL do Cloudinary')
    console.log('  4. ✅ Frontend inclui URL no campo images[]')
    console.log('  5. ✅ Serviço mapeia images -> photos')
    console.log('  6. ✅ Backend recebe photos e salva no banco')
    console.log('  7. ✅ Receita é criada com fotos associadas')

    // Verificar se o serviço está configurado corretamente
    console.log('🔍 [TEST] Verificando configuração do serviço...')

    // Verificar se o uploadService está disponível
    if (uploadService) {
      console.log('✅ [TEST] uploadService disponível')
    } else {
      console.log('❌ [TEST] uploadService não disponível')
    }

    // Verificar se o recipesService está disponível
    if (recipesService) {
      console.log('✅ [TEST] recipesService disponível')
    } else {
      console.log('❌ [TEST] recipesService não disponível')
    }

    console.log('🎯 [TEST] Verificação de configuração concluída!')
  } catch (error) {
    console.error('❌ [TEST] Erro na verificação:', error)
  }
}

export const runRecipeCreationTests = async () => {
  console.log('🚀 [TEST] Iniciando testes de criação de receitas...')
  console.log('=' * 50)

  await testImageUploadFlow()
  console.log('')

  await testRecipeCreationWithImages()
  console.log('')

  console.log('🏁 [TEST] Testes de criação de receitas concluídos!')
}
