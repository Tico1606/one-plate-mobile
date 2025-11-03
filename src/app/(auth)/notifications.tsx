import { NotificationsView, useNotifications } from '@/components/pages/notifications'

export default function Notifications() {
  const {
    notifications,
    isLoading,
    onRetry,
    onNotificationPress,
    onMarkAsRead,
    onMarkAllAsRead,
    onGoBack,
  } = useNotifications()

  return (
    <NotificationsView
      notifications={notifications}
      isLoading={isLoading}
      onRetry={onRetry}
      onNotificationPress={onNotificationPress}
      onMarkAsRead={onMarkAsRead}
      onMarkAllAsRead={onMarkAllAsRead}
      onGoBack={onGoBack}
    />
  )
}
