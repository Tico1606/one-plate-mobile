export const API_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === 'development'
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
      FAVORITES: '/recipes/favorites', // GET - Buscar favoritos
    },
    CATEGORIES: {
      LIST: '/categories',
    },
    USERS: {
      LIST: '/users', // GET - Listar usuários (admin)
      DETAIL: '/users/:id', // GET - Buscar usuário por ID (admin/próprio)
      PROFILE: '/users/me', // GET - Perfil do usuário logado
      UPDATE: '/users/me', // PUT - Atualizar perfil próprio
      DELETE: '/users/:id', // DELETE - Deletar usuário (admin)
    },
  },
}

export type ApiEndpoints = typeof API_CONFIG.ENDPOINTS
