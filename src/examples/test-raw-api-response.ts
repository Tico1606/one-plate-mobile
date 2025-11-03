// Teste para verificar a resposta bruta da API
import { API_CONFIG } from '@/constants/api'
import { authToken } from '@/lib/auth-token'

export const testRawApiResponse = async () => {
  try {
    console.log('🔍 [TEST] Testando resposta bruta da API...')

    // Buscar receitas diretamente da API
    const url = `${API_CONFIG.BASE_URL}/recipes?limit=3`
    const token = await authToken.get()

    console.log('🌐 [TEST] URL:', url)
    console.log('🔑 [TEST] Token disponível:', token ? 'SIM' : 'NÃO')

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('📡 [TEST] Status:', response.status)

    if (!response.ok) {
      console.error('❌ [TEST] Erro na resposta:', response.status, response.statusText)
      return
    }

    const rawData = await response.json()
    console.log('📄 [TEST] Resposta bruta da API:', JSON.stringify(rawData, null, 2))

    // Verificar estrutura
    if (rawData.recipes) {
      console.log('✅ [TEST] Campo recipes encontrado')
      console.log(`📊 [TEST] Quantidade de receitas: ${rawData.recipes.length}`)

      if (rawData.recipes.length > 0) {
        const firstRecipe = rawData.recipes[0]
        console.log('\n🍽️ [TEST] Primeira receita:')
        console.log(`  🆔 ID: ${firstRecipe.id}`)
        console.log(`  📝 Título: ${firstRecipe.title}`)
        console.log(`  🖼️ Image: ${firstRecipe.image}`)
        console.log(`  📸 Photos: ${firstRecipe.photos ? firstRecipe.photos.length : 0}`)

        if (firstRecipe.photos && firstRecipe.photos.length > 0) {
          console.log('  📸 Photos URLs:')
          firstRecipe.photos.forEach((photo: any, index: number) => {
            console.log(`    ${index + 1}. ID: ${photo.id}, URL: ${photo.url}`)
          })
        }

        // Verificar se tem campo image
        if (firstRecipe.image) {
          console.log(`  ✅ Campo image presente: ${firstRecipe.image}`)
        } else {
          console.log('  ❌ Campo image ausente')
        }

        // Verificar se tem photos
        if (firstRecipe.photos && firstRecipe.photos.length > 0) {
          console.log(
            `  ✅ Campo photos presente com ${firstRecipe.photos.length} foto(s)`,
          )
        } else {
          console.log('  ❌ Campo photos ausente ou vazio')
        }
      }
    } else if (rawData.data) {
      console.log('✅ [TEST] Campo data encontrado')
      console.log(`📊 [TEST] Quantidade de receitas: ${rawData.data.length}`)
    } else {
      console.log('❌ [TEST] Estrutura inesperada da resposta')
    }
  } catch (error) {
    console.error('❌ [TEST] Erro no teste:', error)
  }
}

export const testSpecificRecipe = async (recipeId: string) => {
  try {
    console.log(`🔍 [TEST] Testando receita específica: ${recipeId}`)

    const url = `${API_CONFIG.BASE_URL}/recipes/${recipeId}`
    const token = await authToken.get()

    console.log('🌐 [TEST] URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('📡 [TEST] Status:', response.status)

    if (!response.ok) {
      console.error('❌ [TEST] Erro na resposta:', response.status, response.statusText)
      return
    }

    const rawData = await response.json()
    console.log('📄 [TEST] Resposta bruta da receita:', JSON.stringify(rawData, null, 2))

    // Verificar se tem recipe wrapper
    const recipe = rawData.recipe || rawData

    console.log('\n🍽️ [TEST] Dados da receita:')
    console.log(`  🆔 ID: ${recipe.id}`)
    console.log(`  📝 Título: ${recipe.title}`)
    console.log(`  🖼️ Image: ${recipe.image}`)
    console.log(`  📸 Photos: ${recipe.photos ? recipe.photos.length : 0}`)

    if (recipe.photos && recipe.photos.length > 0) {
      console.log('  📸 Photos detalhados:')
      recipe.photos.forEach((photo: any, index: number) => {
        console.log(`    ${index + 1}. ID: ${photo.id}`)
        console.log(`       URL: ${photo.url}`)
        console.log(`       Order: ${photo.order}`)
        console.log(`       RecipeId: ${photo.recipeId}`)
      })
    }
  } catch (error) {
    console.error('❌ [TEST] Erro no teste:', error)
  }
}

export const runRawApiTests = async () => {
  console.log('🚀 [TEST] Iniciando testes de resposta bruta da API...')
  console.log('=' * 50)

  await testRawApiResponse()

  console.log('\n🏁 [TEST] Testes de resposta bruta concluídos!')
}
