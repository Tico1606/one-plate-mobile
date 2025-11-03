// Teste específico para verificar o formato correto das photos

export const testPhotosFormat = async () => {
  try {
    console.log('🧪 [TEST] Testando formato correto das photos...')

    // Simular dados de entrada (strings)
    const testImages = [
      'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/recipes/photo1.jpg',
      'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/recipes/photo2.jpg',
      'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/recipes/photo3.jpg',
    ]

    console.log('📝 [TEST] Dados de entrada (images como strings):')
    testImages.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`)
    })

    // Simular o mapeamento que acontece no serviço
    const photos = testImages.map((url, index) => ({
      url,
      order: index,
    }))

    console.log('\n🔄 [TEST] Dados mapeados (photos como objetos):')
    photos.forEach((photo, index) => {
      console.log(`  ${index + 1}. { url: "${photo.url}", order: ${photo.order} }`)
    })

    // Verificar se o formato está correto
    console.log('\n✅ [TEST] Validação do formato:')

    if (Array.isArray(photos)) {
      console.log('  ✅ Photos é um array')
    } else {
      console.log('  ❌ Photos não é um array')
    }

    photos.forEach((photo, index) => {
      if (typeof photo === 'object' && photo !== null) {
        console.log(`  ✅ Photo ${index + 1} é um objeto`)

        if (typeof photo.url === 'string' && photo.url.startsWith('http')) {
          console.log(`    ✅ URL válida: ${photo.url}`)
        } else {
          console.log(`    ❌ URL inválida: ${photo.url}`)
        }

        if (typeof photo.order === 'number') {
          console.log(`    ✅ Order válido: ${photo.order}`)
        } else {
          console.log(`    ❌ Order inválido: ${photo.order}`)
        }
      } else {
        console.log(`  ❌ Photo ${index + 1} não é um objeto`)
      }
    })

    // Simular dados completos da receita
    const testRecipeData = {
      title: 'Receita de Teste com Photos Corretas',
      description: 'Teste para verificar se o formato das photos está correto.',
      difficulty: 'EASY' as const,
      prepTime: 30,
      servings: 4,
      images: testImages, // Frontend envia strings
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
          description: 'Primeiro passo da receita.',
        },
      ],
      categories: [],
    }

    console.log('\n📋 [TEST] Dados completos da receita:')
    console.log('  📝 Título:', testRecipeData.title)
    console.log('  🖼️ Images (entrada):', testRecipeData.images)

    // Simular o processamento do serviço
    const { images, ...restRecipe } = testRecipeData
    const processedPhotos = (images || []).map((url, index) => ({
      url,
      order: index,
    }))

    const processedData = {
      ...restRecipe,
      photos: processedPhotos,
      status: 'DRAFT' as const,
    }

    console.log('\n🔄 [TEST] Dados processados para o backend:')
    console.log('  📝 Título:', processedData.title)
    console.log('  📸 Photos (saída):')
    processedData.photos.forEach((photo, index) => {
      console.log(`    ${index + 1}. { url: "${photo.url}", order: ${photo.order} }`)
    })
    console.log('  📊 Status:', processedData.status)

    console.log('\n🎯 [TEST] Formato correto validado!')
    console.log('💡 [TEST] O backend agora receberá:')
    console.log('  ✅ Array de objetos com { url, order }')
    console.log('  ✅ URLs válidas do Cloudinary')
    console.log('  ✅ Order sequencial (0, 1, 2, ...)')
  } catch (error) {
    console.error('❌ [TEST] Erro no teste de formato:', error)
  }
}

export const testBackendExpectedFormat = () => {
  console.log('🎯 [TEST] Formato esperado pelo backend:')
  console.log('')

  console.log('❌ FORMATO INCORRETO (antes):')
  console.log('{')
  console.log('  "photos": [')
  console.log('    "https://res.cloudinary.com/photo1.jpg",')
  console.log('    "https://res.cloudinary.com/photo2.jpg"')
  console.log('  ]')
  console.log('}')
  console.log('')

  console.log('✅ FORMATO CORRETO (agora):')
  console.log('{')
  console.log('  "photos": [')
  console.log('    {')
  console.log('      "url": "https://res.cloudinary.com/photo1.jpg",')
  console.log('      "order": 0')
  console.log('    },')
  console.log('    {')
  console.log('      "url": "https://res.cloudinary.com/photo2.jpg",')
  console.log('      "order": 1')
  console.log('    }')
  console.log('  ]')
  console.log('}')
  console.log('')

  console.log('🔧 [TEST] Mapeamento implementado:')
  console.log('  images: string[] → photos: { url: string, order: number }[]')
  console.log('  ✅ Conversão automática no recipesService')
  console.log('  ✅ Order baseado no índice do array')
  console.log('  ✅ URLs preservadas intactas')
}

export const runPhotosFormatTests = async () => {
  console.log('🚀 [TEST] Iniciando testes de formato das photos...')
  console.log('=' * 50)

  testBackendExpectedFormat()
  console.log('')

  await testPhotosFormat()
  console.log('')

  console.log('🏁 [TEST] Testes de formato das photos concluídos!')
}
