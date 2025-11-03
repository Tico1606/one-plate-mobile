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
    SHOPPING_LIST: {
      LIST: '/shopping-list',
      ADD_ITEM: '/shopping-list/items',
      UPDATE_ITEM: '/shopping-list/items/:itemId',
      TOGGLE_ITEM: '/shopping-list/items/:itemId/toggle',
      REMOVE_ITEM: '/shopping-list/items/:itemId',
      CLEAR_ALL: '/shopping-list',
      CLEAR_PURCHASED: '/shopping-list/checked-items',
    },
  },
} as const

export type ApiEndpoints = typeof API_CONFIG.ENDPOINTS
