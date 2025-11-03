import { useEffect, useState } from 'react'
import { useNotifications } from './useNotifications'

export function useNotificationBadge() {
  const { data: notifications } = useNotifications()
  const [unreadCount, setUnreadCount] = useState(0)

  // Calcular número de notificações não lidas
  useEffect(() => {
    if (notifications) {
      const unread = notifications.filter((notification) => !notification.isRead).length
      setUnreadCount(unread)
    }
  }, [notifications])

  return {
    unreadCount,
    hasUnread: unreadCount > 0,
  }
}
