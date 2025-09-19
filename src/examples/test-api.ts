// Exemplo de como testar as chamadas de API
import { categoriesService, recipesService } from '@/services'

// Função para testar as APIs
export async function testApiCalls() {
  console.log('🧪 Testando chamadas de API...')

  try {
    // Testar busca de categorias
    console.log('📂 Buscando categorias...')
    const categories = await categoriesService.getAll()
    console.log('✅ Categorias carregadas:', categories)

    // Testar busca de receitas recentes
    console.log('🍽️ Buscando receitas recentes...')
    const recentRecipes = await recipesService.getRecent(5)
    console.log('✅ Receitas recentes carregadas:', recentRecipes)

    // Testar busca de receitas populares
    console.log('⭐ Buscando receitas populares...')
    const popularRecipes = await recipesService.getPopular(5)
    console.log('✅ Receitas populares carregadas:', popularRecipes)

    // Testar busca de receitas com filtros
    console.log('🔍 Buscando receitas com filtros...')
    const filteredRecipes = await recipesService.getAll({
      limit: 10,
      page: 1,
      search: 'pizza',
    })
    console.log('✅ Receitas filtradas carregadas:', filteredRecipes)

    console.log('🎉 Todos os testes de API passaram!')
  } catch (error) {
    console.error('❌ Erro ao testar APIs:', error)
  }
}

// Função para testar uma API específica
export async function testSpecificApi() {
  try {
    // Exemplo: buscar receita por ID
    const recipe = await recipesService.getById(1)
    console.log('Receita encontrada:', recipe)
  } catch (error) {
    console.error('Erro ao buscar receita:', error)
  }
}
