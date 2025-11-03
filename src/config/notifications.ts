// Configurações para notificações push
export const notificationConfig = {
  // Configurações do Expo
  expo: {
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    vapidPublicKey: process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY,
  },

  // Configurações de permissão
  permissions: {
    ios: {
      alert: true,
      badge: true,
      sound: true,
    },
    android: {
      alert: true,
      badge: true,
      sound: true,
    },
  },

  // Configurações de notificação
  notification: {
    // Som padrão
    sound: 'default',

    // Vibração
    vibrate: true,

    // Badge
    badge: true,

    // Prioridade (Android)
    priority: 'high' as const,

    // Categoria (iOS)
    category: 'RECIPE_NOTIFICATIONS',
  },

  // Configurações de canal (Android)
  channels: {
    default: {
      name: 'Receitas',
      description: 'Notificações sobre receitas',
      importance: 'high' as const,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#8B5CF6',
    },
    reviews: {
      name: 'Avaliações',
      description: 'Notificações sobre avaliações',
      importance: 'high' as const,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F59E0B',
    },
    favorites: {
      name: 'Favoritos',
      description: 'Notificações sobre favoritos',
      importance: 'high' as const,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#EF4444',
    },
  },

  // Configurações de retry
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
  },

  // Configurações de cache
  cache: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    maxSize: 100, // Máximo 100 notificações em cache
  },
}
