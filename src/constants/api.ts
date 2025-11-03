export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://192.168.0.111:3333/api'
    : 'https://seu-backend-prod.com/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    RECIPES: {
      LIST: '/recipes', // GET - Listar receitas com filtros
      DETAIL: '/recipes/:id', // GET - Buscar receita por ID
      CREATE: '/recipes', // POST - Criar receita (autenticado)
      UPDATE: '/recipes/:id', // PUT - Atualizar receita (autor/admin)
      DELETE: '/recipes/:id', // DELETE - Deletar receita (autor/admin)
      FAVORITES: '/favorites', // GET - Buscar favoritos
      USER_RECIPES: '/recipes/my-recipes', // GET - Buscar receitas do usuário logado
      PUBLISH: '/recipes/:id/publish', // PUT - Publicar rascunho
    },
    REVIEWS: {
      CREATE: '/reviews', // POST - Criar avaliação
      UPDATE: '/reviews/:id', // PUT - Atualizar avaliação
      DELETE: '/reviews/:id', // DELETE - Deletar avaliação
      LIST: '/recipes/:recipeId/reviews', // GET - Listar avaliações de uma receita
    },
    CATEGORIES: {
      LIST: '/categories',
    },
    INGREDIENTS: {
      LIST: '/ingredients', // GET - Listar ingredientes
      DETAIL: '/ingredients/:id', // GET - Buscar ingrediente por ID
      CREATE: '/ingredients', // POST - Criar ingrediente
    },
    USERS: {
      LIST: '/users', // GET - Listar usuários (admin)
      DETAIL: '/users/:id', // GET - Buscar usuário por ID (admin/próprio)
      CREATE: '/users', // POST - Criar usuário no backend
      PROFILE: '/users/me', // GET - Perfil do usuário logado
      UPDATE: '/users/me', // PUT - Atualizar perfil próprio
      DELETE: '/users/:id', // DELETE - Deletar usuário (admin)
    },
  },
}

export type ApiEndpoints = typeof API_CONFIG.ENDPOINTS
