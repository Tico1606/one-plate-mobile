// =============================================================================
// TIPOS PARA FRONTEND - ONE PLATE APP
// =============================================================================

// Tipos base do sistema
export type Role = 'USER' | 'ADMIN'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type RecipeStatus = 'DRAFT' | 'PUBLISHED'

// =============================================================================
// TIPOS PARA RECEITAS
// =============================================================================

export interface Recipe {
  id: string
  title: string
  description?: string
  author: User
  difficulty: Difficulty
  prepMinutes: number
  cookMinutes: number
  totalMinutes: number
  servings: number
  image: string
  images: string[]
  videoUrl?: string
  source?: string
  calories?: number
  proteinGrams?: number
  carbGrams?: number
  fatGrams?: number
  status: RecipeStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string

  // Engajamento
  rating: number
  totalRatings: number
  likes: number
  views: number
  isLiked: boolean
  isViewed: boolean

  // Conteúdo
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  categories: Category[]
  reviews: Review[]
}

export interface RecipeIngredient {
  id: string
  name: string
  amount?: number
  unit?: string
  note?: string
  group?: string
  imageUrl?: string
}

export interface RecipeInstruction {
  id: string
  order: number
  description: string
  durationMinutes?: number
  imageUrl?: string
}

export interface Review {
  id: string
  user: User
  rating: number
  comment?: string
  helpfulCount: number
  createdAt: string
  isHelpful?: boolean
}

// =============================================================================
// TIPOS PARA CATEGORIAS
// =============================================================================

export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
  recipeCount: number
}

// =============================================================================
// TIPOS PARA USUÁRIO
// =============================================================================

export interface User {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  avatar?: string
  photoUrl?: string
  role: Role
  bio?: string
  createdAt: string
  updatedAt: string
  stats?: UserStats
}

export interface UserStats {
  recipes: number
  favorites: number
  reviews: number
  views: number
  followers?: number
  following?: number
}

// =============================================================================
// TIPOS PARA AUTENTICAÇÃO
// =============================================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// =============================================================================
// TIPOS PARA RESPOSTAS DA API
// =============================================================================

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
    hasNext: boolean
    hasPrev: boolean
  }
}

// =============================================================================
// TIPOS PARA FILTROS E BUSCA
// =============================================================================

export interface RecipeFilters {
  search?: string
  category?: string
  difficulty?: Difficulty
  maxTime?: number
  maxCalories?: number
  minProtein?: number
  minRating?: number
  minLikes?: number
  authorId?: string
  status?: RecipeStatus
  featured?: boolean
  page?: number
  limit?: number
  sortBy?:
    | 'createdAt'
    | 'title'
    | 'prepMinutes'
    | 'cookMinutes'
    | 'calories'
    | 'rating'
    | 'favorites'
  sortOrder?: 'asc' | 'desc'
}

// =============================================================================
// TIPOS PARA CRIAÇÃO E EDIÇÃO DE RECEITAS
// =============================================================================

export interface CreateRecipeRequest {
  title: string
  description?: string
  difficulty: Difficulty
  prepMinutes: number
  cookMinutes: number
  servings: number
  videoUrl?: string
  source?: string
  calories?: number
  proteinGrams?: number
  carbGrams?: number
  fatGrams?: number
  images: string[]
  ingredients: Array<{
    name: string
    amount?: number
    unit?: string
    note?: string
    group?: string
  }>
  instructions: Array<{
    description: string
    durationMinutes?: number
  }>
  categories: string[]
}

export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {
  id: string
}

export interface CreateCategoryRequest {
  name: string
  icon?: string
  color?: string
}

export interface UpdateCategoryRequest {
  id: string
  name: string
  icon?: string
  color?: string
}

// =============================================================================
// TIPOS PARA INTERAÇÕES
// =============================================================================

export interface CreateReviewRequest {
  recipeId: string
  rating: number
  comment?: string
}

export interface UpdateReviewRequest {
  id: string
  rating?: number
  comment?: string
}

export interface ToggleFavoriteRequest {
  recipeId: string
}

export interface ToggleHelpfulRequest {
  reviewId: string
}

// =============================================================================
// TIPOS PARA DASHBOARD E ESTATÍSTICAS
// =============================================================================

export interface DashboardStats {
  totalRecipes: number
  totalFavorites: number
  totalViews: number
  totalReviews: number
  recentRecipes: Recipe[]
  popularRecipes: Recipe[]
  recentReviews: Review[]
}

export interface UserProfile {
  user: User
  recipes: Recipe[]
  favorites: Recipe[]
  reviews: Review[]
  stats: UserStats
}

// =============================================================================
// TIPOS PARA FORMULÁRIOS
// =============================================================================

export interface RecipeFormData {
  title: string
  description?: string
  difficulty: Difficulty
  prepMinutes: number
  cookMinutes: number
  servings: number
  videoUrl?: string
  source?: string
  calories?: number
  proteinGrams?: number
  carbGrams?: number
  fatGrams?: number
  images: File[] | string[]
  ingredients: Array<{
    name: string
    amount?: number
    unit?: string
    note?: string
    group?: string
  }>
  instructions: Array<{
    description: string
    durationMinutes?: number
  }>
  categories: string[]
}

export interface UserFormData {
  name: string
  email: string
  bio?: string
  avatar?: File | string
}

// =============================================================================
// TIPOS PARA COMPONENTES UI
// =============================================================================

export interface RecipeCard {
  id: string
  title: string
  description?: string
  image: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  difficulty: Difficulty
  totalMinutes: number
  servings: number
  rating: number
  totalRatings: number
  likes: number
  categories: string[]
  createdAt: string
}

export interface CategoryCard {
  id: string
  name: string
  icon?: string
  color?: string
  recipeCount: number
}

export interface ReviewCard {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  rating: number
  comment?: string
  helpfulCount: number
  createdAt: string
  isHelpful?: boolean
}

// =============================================================================
// TIPOS PARA ESTADOS DE LOADING
// =============================================================================

export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// =============================================================================
// TIPOS PARA CONTEXTOS
// =============================================================================

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  updateProfile: (data: UserFormData) => Promise<void>
}

export interface RecipeContextType {
  recipes: Recipe[]
  loading: boolean
  error?: string
  filters: RecipeFilters
  pagination: PaginationState
  setFilters: (filters: RecipeFilters) => void
  loadRecipes: () => Promise<void>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

// =============================================================================
// TIPOS PARA HOOKS
// =============================================================================

export interface UseRecipesReturn {
  recipes: Recipe[]
  loading: boolean
  error?: string
  pagination: PaginationState
  filters: RecipeFilters
  setFilters: (filters: RecipeFilters) => void
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

export interface UseRecipeReturn {
  recipe: Recipe | null
  loading: boolean
  error?: string
  toggleFavorite: () => Promise<void>
  addReview: (data: CreateReviewRequest) => Promise<void>
  updateReview: (data: UpdateReviewRequest) => Promise<void>
  deleteReview: (id: string) => Promise<void>
}

// =============================================================================
// TIPOS PARA UTILITÁRIOS
// =============================================================================

export interface SearchResult {
  recipes: Recipe[]
  categories: Category[]
  users: User[]
  total: number
}

export interface SortOption {
  value: string
  label: string
  direction: 'asc' | 'desc'
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

// =============================================================================
// TIPOS PARA CONFIGURAÇÕES
// =============================================================================

export interface AppConfig {
  apiUrl: string
  uploadUrl: string
  maxFileSize: number
  allowedImageTypes: string[]
  pagination: {
    defaultLimit: number
    maxLimit: number
  }
  difficulty: {
    [key in Difficulty]: {
      label: string
      color: string
      icon: string
    }
  }
}
