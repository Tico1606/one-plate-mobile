import { useFocusEffect } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { useNotifications as useNotificationsHook } from '@/hooks/useNotifications'
import type { Notification } from '@/types/api'

export function useNotifications() {
  // Router para navegação
  const router = useRouter()

  // Hook para buscar notificações
  const {
    data: notifications,
    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  } = useNotificationsHook()

  // Recarregar notificações quando a tela entrar em foco
  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  // Estados de loading
  const isLoading = loading

  // Função para tentar novamente
  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  // Handlers para eventos
  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      // Marcar como lida se não estiver lida
      if (!notification.isRead) {
        markAsRead(notification.id)
      }

      // Navegar baseado no tipo de notificação
      switch (notification.type) {
        case 'review':
        case 'favorite':
        case 'comment':
          // Navegar para a receita
          if (notification.recipeId) {
            router.push(`/(auth)/recipe-[id]?id=${notification.recipeId}`)
          }
          break
        case 'follow':
          // Navegar para o perfil do usuário
          if (notification.userId) {
            router.push(`/(auth)/profile?userId=${notification.userId}`)
          }
          break
        default:
          // Navegar para a home
          router.push('/(auth)/(tabs)/home')
      }
    },
    [markAsRead, router],
  )

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      markAsRead(notificationId)
    },
    [markAsRead],
  )

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead()
  }, [markAllAsRead])

  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  return {
    notifications: notifications || [],
    isLoading,
    error,
    onRetry: handleRetry,
    onNotificationPress: handleNotificationPress,
    onMarkAsRead: handleMarkAsRead,
    onMarkAllAsRead: handleMarkAllAsRead,
    onGoBack: handleGoBack,
  }
}
