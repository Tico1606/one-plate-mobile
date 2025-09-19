// Exemplo de como usar a API em outros componentes

import React from 'react'
import { useCategories, useRecipes } from '@/hooks'
import { recipesService } from '@/services'
import type { Recipe, RecipeFilters } from '@/types'

// Exemplo 1: Usando hooks personalizados
export function ExampleWithHooks() {
  const {
    data: recipes,
    loading,
    error,
    refetch,
  } = useRecipes({
    categoryId: 1,
    limit: 10,
  })

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      {recipes?.data.map((recipe) => (
        <div key={recipe.id}>{recipe.title}</div>
      ))}
    </div>
  )
}

// Exemplo 2: Usando serviços diretamente
export function ExampleWithServices() {
  const [recipes, setRecipes] = React.useState<Recipe[]>([])
  const [loading, setLoading] = React.useState(false)

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const result = await recipesService.getAll({ limit: 5 })
      setRecipes(result.data)
    } catch (error) {
      console.error('Erro ao buscar receitas:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchRecipes()
  }, [])

  return (
    <div>
      {loading
        ? 'Carregando...'
        : recipes.map((recipe) => <div key={recipe.id}>{recipe.title}</div>)}
    </div>
  )
}

// Exemplo 3: Busca com filtros
export function ExampleWithFilters() {
  const [filters, setFilters] = React.useState<RecipeFilters>({
    search: '',
    categoryId: undefined,
    difficulty: undefined,
  })

  const { data, loading, error } = useRecipes(filters)

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }))
  }

  const handleCategoryChange = (categoryId: number) => {
    setFilters((prev) => ({ ...prev, categoryId }))
  }

  return (
    <div>
      <input
        placeholder='Buscar receitas...'
        onChange={(e) => handleSearch(e.target.value)}
      />

      {loading && <div>Carregando...</div>}
      {error && <div>Erro: {error}</div>}

      {data?.data.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </div>
      ))}
    </div>
  )
}
