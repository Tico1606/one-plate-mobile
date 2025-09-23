// Tipos para receitas
export interface BaseRecipe {
  id: string
  title: string
  description?: string | null
  authorId: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  prepMinutes: number
  cookMinutes: number
  servings: number
  videoUrl?: string | null
  source?: string | null
  calories?: number | null
  proteinGrams?: number | null
  carbGrams?: number | null
  fatGrams?: number | null
  status: 'DRAFT' | 'PUBLISHED'
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Recipe extends BaseRecipe {
  author: any // Objeto do autor
  image: string
  likes: number
  ingredients: Ingredient[]
  instructions: string[]
  tags: string[]
  categoryId: number
  time: string // Tempo total calculado
}

export interface Ingredient {
  id: number
  name: string
  amount: string
  unit: string
}

// Tipos para categorias
export interface Category {
  id: number
  name: string
  icon: string
  color: string
  iconColor: string
  recipeCount: number
}

// Tipos para usuário
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  imageUrl?: string
  bio?: string
  createdAt: string
}

// Tipos para autenticação
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos para filtros e busca
export interface RecipeFilters {
  categoryId?: number
  difficulty?: string
  time?: string
  rating?: number
  search?: string
  page?: number
  limit?: number
}

// Tipos para estatísticas do usuário
export interface UserStats {
  recipes: number
  favorites: number
  followers: number
  following: number
}
