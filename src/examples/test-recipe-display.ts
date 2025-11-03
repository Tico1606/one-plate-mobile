// Teste para verificar se as imagens das receitas estão sendo exibidas
import { recipesService } from '@/services'

export const testRecipeImageDisplay = async () => {
  try {
    console.log('🖼️ [TEST] Testando exibição de imagens das receitas...')

    // Buscar receitas recentes
    console.log('📥 [TEST] Buscando receitas recentes...')
    const recentRecipes = await recipesService.getRecent(5)

    console.log(`📊 [TEST] Encontradas ${recentRecipes.length} receitas recentes`)

    recentRecipes.forEach((recipe, index) => {
      console.log(`\n🍽️ [TEST] Receita ${index + 1}:`)
      console.log(`  📝 Título: ${recipe.title}`)
      console.log(`  🆔 ID: ${recipe.id}`)
      console.log(`  🖼️ Image URL: ${recipe.image}`)
      console.log(`  📸 Photos count: ${recipe.photos?.length || 0}`)

      if (recipe.photos && recipe.photos.length > 0) {
        console.log('  📸 Photos URLs:')
        recipe.photos.forEach((photo, photoIndex) => {
          console.log(`    ${photoIndex + 1}. ${photo.url}`)
        })
      }

      // Verificar se a imagem está sendo populada corretamente
      if (recipe.image && recipe.image !== 'https://via.placeholder.com/400x300') {
        console.log(`  ✅ Imagem válida: ${recipe.image}`)
      } else {
        console.log(`  ❌ Imagem inválida ou placeholder: ${recipe.image}`)
      }
    })

    // Testar receita específica por ID se houver
    if (recentRecipes.length > 0) {
      const firstRecipe = recentRecipes[0]
      console.log(`\n🔍 [TEST] Testando receita específica: ${firstRecipe.id}`)

      try {
        const recipeDetail = await recipesService.getById(firstRecipe.id)
        console.log('📋 [TEST] Detalhes da receita:')
        console.log(`  🖼️ Image: ${recipeDetail.image}`)
        console.log(`  📸 Photos: ${recipeDetail.photos?.length || 0}`)

        if (recipeDetail.photos && recipeDetail.photos.length > 0) {
          console.log('  📸 Photos URLs:')
          recipeDetail.photos.forEach((photo, index) => {
            console.log(`    ${index + 1}. ${photo.url}`)
          })
        }
      } catch (error) {
        console.error('❌ [TEST] Erro ao buscar detalhes da receita:', error)
      }
    }
  } catch (error) {
    console.error('❌ [TEST] Erro no teste de exibição:', error)
  }
}

export const testRecipeCreationWithRealImage = async () => {
  try {
    console.log('🧪 [TEST] Testando criação de receita com imagem real...')

    // Simular uma URL de imagem do Cloudinary (formato real)
    const cloudinaryUrl =
      'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/recipes/test-image.jpg'

    const testRecipeData = {
      title: 'Teste de Imagem Real',
      description:
        'Receita de teste para verificar se as imagens estão sendo salvas e exibidas corretamente.',
      difficulty: 'EASY' as const,
      prepTime: 15,
      servings: 2,
      images: [cloudinaryUrl],
      ingredients: [
        {
          ingredientId: 'test-ingredient-1',
          amount: 1,
          unit: 'xícara',
        },
      ],
      steps: [
        {
          order: 1,
          description: 'Teste de passo com imagem.',
        },
      ],
      categories: [],
    }

    console.log('📝 [TEST] Dados da receita de teste:', testRecipeData)

    // Simular o mapeamento que acontece no serviço
    const { images, ...restRecipe } = testRecipeData
    const mappedData = {
      ...restRecipe,
      photos: images || [],
      status: 'DRAFT' as const,
    }

    console.log('🔄 [TEST] Dados mapeados para o backend:', mappedData)

    // Verificar se o mapeamento está correto
    if (mappedData.photos && mappedData.photos.length > 0) {
      console.log('✅ [TEST] Mapeamento correto:')
      console.log(`  📸 Photos: ${mappedData.photos}`)
      console.log(`  🔗 URL: ${mappedData.photos[0]}`)

      // Verificar se é uma URL válida
      if (mappedData.photos[0].startsWith('http')) {
        console.log('✅ [TEST] URL válida detectada')
      } else {
        console.log('❌ [TEST] URL inválida')
      }
    } else {
      console.log('❌ [TEST] Nenhuma foto encontrada no mapeamento')
    }
  } catch (error) {
    console.error('❌ [TEST] Erro no teste de criação:', error)
  }
}

export const runImageDisplayTests = async () => {
  console.log('🚀 [TEST] Iniciando testes de exibição de imagens...')
  console.log('=' * 50)

  await testRecipeCreationWithRealImage()
  console.log('')

  await testRecipeImageDisplay()
  console.log('')

  console.log('🏁 [TEST] Testes de exibição de imagens concluídos!')
}
