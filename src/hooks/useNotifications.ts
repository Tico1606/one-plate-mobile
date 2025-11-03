import { useCallback, useEffect, useState } from 'react'
import { notificationsService } from '@/services/notifications'
import type { Notification } from '@/types/api'

export function useNotifications() {
  const [data, setData] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await notificationsService.getAll()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar notificações')
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId)
      // Atualizar o estado local
      setData((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao marcar notificação como lida',
      )
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead()
      // Atualizar o estado local
      setData((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao marcar todas as notificações como lidas',
      )
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    data,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}

