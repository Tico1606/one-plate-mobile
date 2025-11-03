// Serviço de notificações que funciona tanto no Expo Go quanto em development builds
import { notificationsService } from './notifications'

export class NotificationService {
  private static instance: NotificationService
  private isRegistered = false

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Verificar se estamos no Expo Go
  private isExpoGo(): boolean {
    return __DEV__ && typeof __DEV__ !== 'undefined'
  }

  // Solicitar permissão para notificações
  async requestPermissions(): Promise<boolean> {
    try {
      if (this.isExpoGo()) {
        console.log('📱 Expo Go: Permissões de notificação não disponíveis')
        return false
      }

      // Importar dinamicamente apenas quando necessário
      const Notifications = await import('expo-notifications')

      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      return finalStatus === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificações:', error)
      return false
    }
  }

  // Registrar dispositivo para push notifications
  async registerForPushNotifications(): Promise<string | null> {
    try {
      // Verificar se já está registrado
      if (this.isRegistered) {
        return null
      }

      // Verificar se estamos no Expo Go
      if (this.isExpoGo()) {
        console.log('📱 Expo Go: Push notifications não disponíveis')
        console.log('📱 Notificações locais ainda funcionam para testes.')
        return 'expo-go-limited'
      }

      // Solicitar permissão
      const hasPermission = await this.requestPermissions()
      if (!hasPermission) {
        console.log('Permissão de notificações negada')
        return null
      }

      // Importar dinamicamente apenas quando necessário
      const Notifications = await import('expo-notifications')

      // Obter token do dispositivo
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      })

      // Registrar no backend com a chave VAPID
      await notificationsService.registerDevice({
        endpoint: token.data,
        keys: {
          p256dh: process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY || '',
          auth: '', // Será preenchido pelo Expo
        },
      } as any)

      this.isRegistered = true
      console.log('Dispositivo registrado para push notifications:', token.data)
      return token.data
    } catch (error) {
      console.error('Erro ao registrar para push notifications:', error)
      // Em caso de erro, ainda permitir notificações locais
      console.log('📱 Usando modo de notificações locais apenas')
      return 'local-only'
    }
  }

  // Desregistrar dispositivo
  async unregisterForPushNotifications(): Promise<void> {
    try {
      await notificationsService.unregisterDevice()
      this.isRegistered = false
      console.log('Dispositivo desregistrado para push notifications')
    } catch (error) {
      console.error('Erro ao desregistrar push notifications:', error)
    }
  }

  // Configurar listeners de notificações
  setupNotificationListeners() {
    if (this.isExpoGo()) {
      console.log('📱 Expo Go: Listeners de notificação não disponíveis')
      return
    }

    // Importar dinamicamente apenas quando necessário
    import('expo-notifications')
      .then((Notifications) => {
        // Listener para quando uma notificação é recebida
        Notifications.addNotificationReceivedListener((notification) => {
          console.log('Notificação recebida:', notification)
          // Aqui você pode adicionar lógica para atualizar o estado da aplicação
        })

        // Listener para quando o usuário toca em uma notificação
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log('Usuário tocou na notificação:', response)
          // Aqui você pode adicionar lógica para navegar para a tela apropriada
          this.handleNotificationTap(response)
        })
      })
      .catch(() => {
        console.log('📱 Listeners de notificação não disponíveis')
      })
  }

  // Tratar toque em notificação
  private handleNotificationTap(response: any) {
    const data = response.notification.request.content.data

    // Navegar baseado no tipo de notificação
    if (
      data?.type === 'review' ||
      data?.type === 'favorite' ||
      data?.type === 'comment'
    ) {
      if (data.recipeId) {
        // Navegar para a receita
        // router.push(`/(auth)/recipe-[id]?id=${data.recipeId}`)
      }
    } else if (data?.type === 'follow') {
      if (data.userId) {
        // Navegar para o perfil do usuário
        // router.push(`/(auth)/profile?userId=${data.userId}`)
      }
    }
  }

  // Enviar notificação local (para testes)
  async sendLocalNotification(title: string, body: string, data?: any) {
    if (this.isExpoGo()) {
      console.log('📱 Expo Go: Notificações locais não disponíveis')
      return
    }

    try {
      // Importar dinamicamente apenas quando necessário
      const Notifications = await import('expo-notifications')

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Enviar imediatamente
      })
    } catch {
      console.log('📱 Notificações locais não disponíveis')
    }
  }

  // Limpar todas as notificações
  async clearAllNotifications() {
    if (this.isExpoGo()) {
      console.log('📱 Expo Go: Limpar notificações não disponível')
      return
    }

    try {
      // Importar dinamicamente apenas quando necessário
      const Notifications = await import('expo-notifications')
      await Notifications.dismissAllNotificationsAsync()
    } catch {
      console.log('📱 Limpar notificações não disponível')
    }
  }

  // Obter número de notificações não lidas
  async getBadgeCount(): Promise<number> {
    if (this.isExpoGo()) {
      return 0
    }

    try {
      // Importar dinamicamente apenas quando necessário
      const Notifications = await import('expo-notifications')
      return await Notifications.getBadgeCountAsync()
    } catch {
      return 0
    }
  }

  // Definir número de notificações não lidas
  async setBadgeCount(count: number) {
    if (this.isExpoGo()) {
      console.log('📱 Expo Go: Badge count não disponível')
      return
    }

    try {
      // Importar dinamicamente apenas quando necessário
      const Notifications = await import('expo-notifications')
      await Notifications.setBadgeCountAsync(count)
    } catch {
      console.log('📱 Badge count não disponível')
    }
  }
}

// Exportar instância singleton
export const notificationService = NotificationService.getInstance()
