// Teste de conectividade com o backend
import { API_CONFIG } from '@/constants/api'

export async function testBackendConnection() {
  console.log('🔍 Testando conectividade com o backend...')
  console.log('Base URL:', API_CONFIG.BASE_URL)

  try {
    // Teste básico de conectividade
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`)
    console.log('✅ Health check response:', response.status)
  } catch (error) {
    console.log('❌ Health check failed:', error)
  }

  try {
    // Teste das rotas principais
    const routes = [
      '/categories',
      '/recipes',
      '/recipes/recent',
      '/recipes/popular',
      '/auth/login',
    ]

    for (const route of routes) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${route}`)
        console.log(`✅ ${route}: ${response.status}`)
      } catch (error) {
        console.log(`❌ ${route}: ${error.message}`)
      }
    }
  } catch (error) {
    console.log('❌ Erro ao testar rotas:', error)
  }
}

// Função para testar com dados mockados
export function testWithMockData() {
  console.log('🧪 Testando com dados mockados...')

  const mockCategories = [
    {
      id: 1,
      name: 'Sobremesas',
      icon: 'ice-cream',
      color: 'bg-pink-500',
      iconColor: 'white',
      recipeCount: 5,
    },
    {
      id: 2,
      name: 'Massas',
      icon: 'restaurant',
      color: 'bg-orange-500',
      iconColor: 'white',
      recipeCount: 8,
    },
    {
      id: 3,
      name: 'Carnes',
      icon: 'nutrition',
      color: 'bg-red-500',
      iconColor: 'white',
      recipeCount: 12,
    },
  ]

  const mockRecipes = [
    {
      id: 1,
      title: 'Pudim de Leite',
      description: 'Pudim cremoso e delicioso',
      author: 'João Silva',
      authorId: 1,
      rating: 4.5,
      time: '2h',
      difficulty: 'medium',
      servings: 8,
      likes: 25,
      image: 'https://via.placeholder.com/300x200',
      ingredients: [
        { id: 1, name: 'Leite condensado', amount: '1', unit: 'lata' },
        { id: 2, name: 'Leite', amount: '2', unit: 'xícaras' },
        { id: 3, name: 'Ovos', amount: '3', unit: 'unidades' },
      ],
      instructions: [
        'Misture todos os ingredientes no liquidificador',
        'Caramelize uma forma com açúcar',
        'Despeje a mistura na forma',
        'Leve ao forno em banho-maria por 1h30',
      ],
      tags: ['sobremesa', 'doce', 'tradicional'],
      categoryId: 1,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ]

  console.log('📂 Categorias mockadas:', mockCategories)
  console.log('🍽️ Receitas mockadas:', mockRecipes)

  return { categories: mockCategories, recipes: mockRecipes }
}
