// Exemplo de como testar o sistema de notificações
import { pushNotificationService } from '@/services/pushNotifications'

export async function testNotificationSystem() {
  console.log('🧪 Testando sistema de notificações...')

  try {
    // 1. Verificar permissões
    const hasPermission = await pushNotificationService.requestPermissions()
    console.log('✅ Permissões:', hasPermission ? 'Concedidas' : 'Negadas')

    if (!hasPermission) {
      console.log('❌ Permissões negadas - não é possível testar push notifications')
      return
    }

    // 2. Registrar dispositivo
    const token = await pushNotificationService.registerForPushNotifications()
    console.log('📱 Token do dispositivo:', token)

    // 3. Enviar notificação local de teste
    await pushNotificationService.sendLocalNotification(
      'Teste de Notificação',
      'Esta é uma notificação de teste do One Plate!',
      {
        type: 'system',
        test: true,
      },
    )
    console.log('✅ Notificação local enviada')

    // 4. Verificar badge count
    const badgeCount = await pushNotificationService.getBadgeCount()
    console.log('🔢 Badge count:', badgeCount)

    // 5. Limpar notificações
    await pushNotificationService.clearAllNotifications()
    console.log('🧹 Notificações limpas')

    console.log('🎉 Teste concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  }
}

// Exemplo de uso em um componente React Native
export function TestNotificationsButton() {
  const handleTest = async () => {
    await testNotificationSystem()
  }

  // Retornar função para ser usada em componentes
  return handleTest
}
