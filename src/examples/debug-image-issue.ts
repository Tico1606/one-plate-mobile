// Debug específico para o problema de imagens não aparecendo
import { recipesService } from '@/services'

export const debugImageIssue = async () => {
  try {
    console.log('🐛 [DEBUG] Investigando problema de imagens não aparecendo...')

    // 1. Testar busca de receitas recentes
    console.log('\n📥 [DEBUG] 1. Testando busca de receitas recentes...')
    const recentRecipes = await recipesService.getRecent(3)

    console.log(`📊 [DEBUG] Encontradas ${recentRecipes.length} receitas recentes`)

    recentRecipes.forEach((recipe, index) => {
      console.log(`\n🍽️ [DEBUG] Receita ${index + 1}:`)
      console.log(`  🆔 ID: ${recipe.id}`)
      console.log(`  📝 Título: ${recipe.title}`)
      console.log(`  🖼️ Image: ${recipe.image}`)
      console.log(`  📸 Photos: ${recipe.photos?.length || 0}`)

      // Verificar se é placeholder
      if (recipe.image === 'https://via.placeholder.com/400x300') {
        console.log('  ⚠️ Usando placeholder - problema detectado!')
      } else if (recipe.image && recipe.image.startsWith('http')) {
        console.log('  ✅ URL válida encontrada')
      } else {
        console.log('  ❌ URL inválida ou vazia')
      }

      // Verificar photos
      if (recipe.photos && recipe.photos.length > 0) {
        console.log('  📸 Photos URLs:')
        recipe.photos.forEach((photo, photoIndex) => {
          console.log(`    ${photoIndex + 1}. ${photo.url}`)
        })
      } else {
        console.log('  ❌ Nenhuma photo encontrada')
      }
    })

    // 2. Testar receita específica se houver
    if (recentRecipes.length > 0) {
      const firstRecipe = recentRecipes[0]
      console.log(`\n🔍 [DEBUG] 2. Testando receita específica: ${firstRecipe.id}`)

      try {
        const recipeDetail = await recipesService.getById(firstRecipe.id)
        console.log('📋 [DEBUG] Detalhes da receita:')
        console.log(`  🖼️ Image: ${recipeDetail.image}`)
        console.log(`  📸 Photos: ${recipeDetail.photos?.length || 0}`)

        if (recipeDetail.photos && recipeDetail.photos.length > 0) {
          console.log('  📸 Photos URLs:')
          recipeDetail.photos.forEach((photo, index) => {
            console.log(`    ${index + 1}. ${photo.url}`)
          })

          // Verificar se a primeira photo é igual ao image
          if (recipeDetail.photos[0].url === recipeDetail.image) {
            console.log('  ✅ Image e primeira photo coincidem')
          } else {
            console.log('  ⚠️ Image e primeira photo são diferentes')
            console.log(`    Image: ${recipeDetail.image}`)
            console.log(`    First Photo: ${recipeDetail.photos[0].url}`)
          }
        }
      } catch (error) {
        console.error('❌ [DEBUG] Erro ao buscar detalhes:', error)
      }
    }

    // 3. Testar lista completa de receitas
    console.log('\n📋 [DEBUG] 3. Testando lista completa de receitas...')
    try {
      const allRecipes = await recipesService.getAll({ limit: 5 })
      console.log(`📊 [DEBUG] Encontradas ${allRecipes.data.length} receitas na lista`)

      allRecipes.data.forEach((recipe, index) => {
        console.log(`\n🍽️ [DEBUG] Receita ${index + 1} (lista):`)
        console.log(`  🆔 ID: ${recipe.id}`)
        console.log(`  📝 Título: ${recipe.title}`)
        console.log(`  🖼️ Image: ${recipe.image}`)
        console.log(`  📸 Photos: ${recipe.photos?.length ?? 0}`)

        if (recipe.image === 'https://via.placeholder.com/400x300') {
          console.log('  ⚠️ Usando placeholder - problema detectado!')
        }
      })
    } catch (error) {
      console.error('❌ [DEBUG] Erro ao buscar lista completa:', error)
    }

    console.log('\n🎯 [DEBUG] Diagnóstico concluído!')
    console.log('💡 [DEBUG] Verifique se:')
    console.log('  1. As receitas foram criadas com fotos')
    console.log('  2. O backend está retornando as photos')
    console.log('  3. O mapeamento image está funcionando')
    console.log('  4. As URLs das fotos são válidas')
  } catch (error) {
    console.error('❌ [DEBUG] Erro no diagnóstico:', error)
  }
}

export const testImageMapping = () => {
  console.log('🧪 [TEST] Testando mapeamento de imagens...')

  // Simular dados que vêm do backend
  const mockBackendData = {
    id: '123',
    title: 'Receita Teste',
    photos: [
      { id: '1', url: 'https://cloudinary.com/photo1.jpg', order: 1 },
      { id: '2', url: 'https://cloudinary.com/photo2.jpg', order: 2 },
    ],
    image: 'https://cloudinary.com/photo1.jpg', // Campo image do backend
  }

  console.log('📄 [TEST] Dados do backend:', mockBackendData)

  // Simular o mapeamento que acontece no serviço
  const mappedRecipe = {
    id: mockBackendData.id,
    title: mockBackendData.title,
    image:
      mockBackendData.image ||
      mockBackendData.photos?.[0]?.url ||
      'https://via.placeholder.com/400x300',
    photos: mockBackendData.photos || [],
  }

  console.log('🔄 [TEST] Dados mapeados:', mappedRecipe)

  // Verificar se o mapeamento está correto
  if (
    mappedRecipe.image &&
    mappedRecipe.image !== 'https://via.placeholder.com/400x300'
  ) {
    console.log('✅ [TEST] Mapeamento correto - imagem válida')
  } else {
    console.log('❌ [TEST] Problema no mapeamento - usando placeholder')
  }

  if (mappedRecipe.photos && mappedRecipe.photos.length > 0) {
    console.log('✅ [TEST] Photos encontradas:', mappedRecipe.photos.length)
  } else {
    console.log('❌ [TEST] Nenhuma photo encontrada')
  }
}

export const runImageDebugTests = async () => {
  console.log('🚀 [DEBUG] Iniciando diagnóstico de imagens...')
  console.log('=' * 50)

  testImageMapping()
  console.log('')

  await debugImageIssue()
  console.log('')

  console.log('🏁 [DEBUG] Diagnóstico de imagens concluído!')
}
