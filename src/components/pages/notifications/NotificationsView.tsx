import { Ionicons } from '@expo/vector-icons'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Box } from '@/components/ui/box'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { useLocale } from '@/contexts'
import { VStack } from '@/components/ui/vstack'
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions'
import type { Notification } from '@/types/api'

interface NotificationsViewProps {
  // Dados
  notifications: Notification[]
  isLoading: boolean

  // Handlers
  onRetry: () => void
  onNotificationPress: (notification: Notification) => void
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
  onGoBack?: () => void
}

export function NotificationsView({
  notifications,
  isLoading,
  onRetry,
  onNotificationPress,
  onMarkAsRead,
  onMarkAllAsRead,
  onGoBack,
}: NotificationsViewProps) {
  const { hasPermission, requestPermission } = useNotificationPermissions()
  const { t } = useLocale()

  // Loading state
  if (isLoading) {
    return (
      <Box className='flex-1 bg-zinc-100 justify-center items-center'>
        <ActivityIndicator size='large' color='#8B5CF6' />
        <Text className='mt-4 text-gray-600'>{t('common.loading')}</Text>
      </Box>
    )
  }

  // Permissões negadas - mostrar tela de solicitação
  if (hasPermission === false) {
    return (
      <Box className='flex-1 bg-zinc-100'>
        {/* Header */}
        <VStack className='px-6 py-4 pt-12 bg-white border-b border-gray-200'>
          <HStack className='justify-between items-center'>
            <HStack className='items-center space-x-3 gap-4'>
              {onGoBack && (
                <TouchableOpacity onPress={onGoBack}>
                  <Ionicons name='arrow-back' size={24} color='#374151' />
                </TouchableOpacity>
              )}
              <Text className='text-2xl font-bold text-gray-900'>Notificações</Text>
            </HStack>
          </HStack>
        </VStack>

        {/* Conteúdo de solicitação de permissões */}
        <Box className='flex-1 justify-center items-center px-6'>
          <VStack className='items-center space-y-6'>
            <Ionicons name='notifications-off' size={80} color='#EF4444' />

            <VStack className='items-center space-y-3 gap-2'>
              <Text className='text-xl font-bold text-gray-900 text-center'>
                Permissões de notificação necessárias
              </Text>
              <Text className='text-gray-600 text-center leading-6'>
                Para receber notificações sobre suas receitas favoritas, avaliações e
                comentários, ative as permissões de notificação.
              </Text>
            </VStack>

            <VStack className='w-full space-y-4 my-3 gap-2'>
              <TouchableOpacity
                onPress={requestPermission}
                className='bg-purple-500 px-8 py-4 rounded-xl'
              >
                <HStack className='items-center justify-center space-x-3'>
                  <Ionicons name='notifications' size={20} color='white' />
                  <Text className='text-white font-semibold text-lg'>
                    Ativar Notificações
                  </Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onRetry}
                className='bg-gray-100 px-8 py-3 rounded-xl'
              >
                <Text className='text-gray-700 font-medium text-center'>
                  Verificar Novamente
                </Text>
              </TouchableOpacity>
            </VStack>

            <VStack className='items-center space-y-2'>
              <Text className='text-sm text-gray-500 text-center'>
                💡 Dica: Você também pode ativar as permissões nas configurações do
                dispositivo
              </Text>
              <Text className='text-xs text-gray-400 text-center'>
                Configurações → Aplicativos → One Plate → Notificações
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'review':
        return 'star'
      case 'favorite':
        return 'heart'
      case 'comment':
        return 'chatbubble'
      case 'follow':
        return 'person-add'
      default:
        return 'notifications'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'review':
        return '#F59E0B'
      case 'favorite':
        return '#EF4444'
      case 'comment':
        return '#3B82F6'
      case 'follow':
        return '#10B981'
      default:
        return '#8B5CF6'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Agora mesmo'
    } else if (diffInHours < 24) {
      return `Há ${diffInHours}h`
    } else if (diffInHours < 48) {
      return 'Ontem'
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  return (
    <Box className='flex-1 bg-zinc-100'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRetry}
            colors={['#8B5CF6']}
            tintColor='#8B5CF6'
          />
        }
      >
        {/* Header */}
        <VStack className='px-6 py-4 pt-12 bg-white border-b border-gray-200'>
          <HStack className='justify-between items-center'>
            <HStack className='items-center space-x-3'>
              {onGoBack && (
                <TouchableOpacity onPress={onGoBack}>
                  <Ionicons name='arrow-back' size={24} color='#374151' />
                </TouchableOpacity>
              )}
              <Text className='text-2xl font-bold text-gray-900'>Notificações</Text>
            </HStack>
            <HStack className='space-x-4'>
              {notifications.length > 0 && (
                <TouchableOpacity onPress={onMarkAllAsRead}>
                  <Text className='text-purple-500 font-medium'>
                    Marcar todas como lidas
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={requestPermission}>
                <HStack className='items-center space-x-1'>
                  <Ionicons name='settings' size={16} color='#8B5CF6' />
                  <Text className='text-purple-500 font-medium text-sm'>Permissões</Text>
                </HStack>
              </TouchableOpacity>
            </HStack>
          </HStack>
        </VStack>

        {/* Notifications List */}
        <VStack className='px-6 py-4'>
          {notifications.length === 0 ? (
            <Box className='items-center py-12'>
              <Ionicons name='notifications-outline' size={64} color='#9CA3AF' />
              <Text className='mt-4 text-gray-500 text-center text-lg'>
                Nenhuma notificação
              </Text>
              <Text className='text-sm text-gray-400 text-center mt-2'>
                Você receberá notificações sobre suas receitas aqui
              </Text>
            </Box>
          ) : (
            <VStack className='space-y-3'>
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => onNotificationPress(notification)}
                >
                  <Card
                    className={`p-4 ${
                      !notification.isRead ? 'bg-purple-50 border-purple-200' : 'bg-white'
                    }`}
                  >
                    <HStack className='space-x-3'>
                      {/* Icon */}
                      <Box
                        className='w-10 h-10 rounded-full items-center justify-center'
                        style={{
                          backgroundColor: `${getNotificationColor(notification.type)}20`,
                        }}
                      >
                        <Ionicons
                          name={getNotificationIcon(notification.type)}
                          size={20}
                          color={getNotificationColor(notification.type)}
                        />
                      </Box>

                      {/* Content */}
                      <VStack className='flex-1 space-y-1'>
                        <Text
                          className={`font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                          }`}
                        >
                          {notification.title}
                        </Text>
                        <Text className='text-sm text-gray-600'>
                          {notification.message}
                        </Text>
                        <HStack className='justify-between items-center'>
                          <Text className='text-xs text-gray-400'>
                            {formatDate(notification.createdAt)}
                          </Text>
                          {!notification.isRead && (
                            <Box className='w-2 h-2 bg-purple-500 rounded-full' />
                          )}
                        </HStack>
                      </VStack>

                      {/* Mark as read button */}
                      {!notification.isRead && (
                        <TouchableOpacity
                          onPress={() => onMarkAsRead(notification.id)}
                          className='p-2'
                        >
                          <Ionicons name='checkmark-circle' size={20} color='#8B5CF6' />
                        </TouchableOpacity>
                      )}
                    </HStack>
                  </Card>
                </TouchableOpacity>
              ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </Box>
  )
}
