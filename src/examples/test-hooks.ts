// Exemplo de como testar os hooks de receitas
import { useState } from 'react'
import { useFavorites } from '@/contexts'
import {
  useCategories,
  useInfiniteRecipes,
  usePopularRecipes,
  useRecentRecipes,
  useRecipeSearch,
  useRecipes,
} from '@/hooks'

// Exemplo 1: Buscar todas as receitas
export function TestAllRecipes() {
  const { data, loading, error, refetch } = useRecipes({
    limit: 10,
    page: 1,
  })

  console.log('Todas as receitas:', { data, loading, error })
  return { data, loading, error, refetch }
}

// Exemplo 2: Buscar receitas com filtros
export function TestFilteredRecipes() {
  const { data, loading, error } = useRecipes({
    categoryId: 1,
    difficulty: 'easy',
    search: 'pizza',
  })

  console.log('Receitas filtradas:', { data, loading, error })
  return { data, loading, error }
}

// Exemplo 3: Busca com debounce
export function TestSearchRecipes() {
  const [query, setQuery] = useState('')
  const { data, loading, error } = useRecipeSearch(query, 500)

  console.log('Busca de receitas:', { query, data, loading, error })
  return { data, loading, error, setQuery }
}

// Exemplo 4: Paginação infinita
export function TestInfiniteRecipes() {
  const { data, loading, loadingMore, hasNextPage, loadMore } = useInfiniteRecipes({
    categoryId: 1,
  })

  console.log('Paginação infinita:', {
    data,
    loading,
    loadingMore,
    hasNextPage,
  })

  return { data, loading, loadingMore, hasNextPage, loadMore }
}

// Exemplo 5: Favoritos
export function TestFavorites() {
  const { favoriteRecipes, isFavorite, toggleFavorite, loading } = useFavorites()

  console.log('Favoritos:', { favoriteRecipes, loading })
  return { favoriteRecipes, isFavorite, toggleFavorite, loading }
}

// Exemplo 6: Categorias
export function TestCategories() {
  const { data, loading, error } = useCategories()

  console.log('Categorias:', { data, loading, error })
  return { data, loading, error }
}

// Exemplo de uso completo na HomePage
export function TestHomePageHooks() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Buscar categorias
  const { data: categories, loading: categoriesLoading } = useCategories()

  // Buscar receitas recentes
  const { data: recentRecipes, loading: recentLoading } = useRecentRecipes(10)

  // Buscar receitas populares
  const { data: popularRecipes } = usePopularRecipes(5)

  // Busca com debounce
  const { data: searchResults, loading: searchLoading } = useRecipeSearch(searchQuery)

  // Paginação infinita
  const {
    data: infiniteRecipes,
    loadingMore,
    hasNextPage,
    loadMore,
  } = useInfiniteRecipes(
    selectedCategory ? { categoryId: selectedCategory.id } : undefined,
  )

  // Favoritos
  const { isFavorite, toggleFavorite } = useFavorites()

  // Determinar quais receitas mostrar
  const recipes = searchQuery
    ? searchResults
    : selectedCategory
      ? infiniteRecipes
      : recentRecipes

  console.log('HomePage hooks:', {
    categories,
    recipes,
    popularRecipes,
    searchQuery,
    selectedCategory,
    loading: categoriesLoading || recentLoading || searchLoading,
    loadingMore,
    hasNextPage,
  })

  return {
    categories,
    recipes,
    popularRecipes,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    loading: categoriesLoading || recentLoading || searchLoading,
    loadingMore,
    hasNextPage,
    loadMore,
    isFavorite,
    toggleFavorite,
  }
}
