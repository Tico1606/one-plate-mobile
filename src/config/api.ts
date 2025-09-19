export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3333/api' : 'https://seu-backend-prod.com/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    RECIPES: {
      LIST: '/recipes',
      DETAIL: '/recipes/:id',
      CREATE: '/recipes',
      UPDATE: '/recipes/:id',
      DELETE: '/recipes/:id',
      FAVORITES: '/recipes/favorites',
    },
    CATEGORIES: {
      LIST: '/categories',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/profile',
    },
  },
} as const

export type ApiEndpoints = typeof API_CONFIG.ENDPOINTS
