import { useEffect } from 'react'
import { notificationService } from '@/services/notificationsService'

export function usePushNotifications() {
  useEffect(() => {
    // Configurar listeners de notificações
    notificationService.setupNotificationListeners()

    // Registrar dispositivo para push notifications
    const registerDevice = async () => {
      try {
        const result = await notificationService.registerForPushNotifications()

        if (result === 'expo-go-limited') {
          console.log(
            '📱 Modo Expo Go: Push notifications limitadas, mas notificações locais funcionam',
          )
        } else if (result === 'local-only') {
          console.log('📱 Modo local: Apenas notificações locais disponíveis')
        } else if (result) {
          console.log('✅ Push notifications configuradas com sucesso')
        }
      } catch (error) {
        console.error('Erro ao registrar dispositivo para push notifications:', error)
        console.log('📱 Continuando com notificações locais apenas')
      }
    }

    registerDevice()

    // Cleanup ao desmontar
    return () => {
      // Aqui você pode adicionar cleanup se necessário
    }
  }, [])

  return {
    // Métodos expostos se necessário
    sendLocalNotification:
      notificationService.sendLocalNotification.bind(notificationService),
    clearAllNotifications:
      notificationService.clearAllNotifications.bind(notificationService),
  }
}
