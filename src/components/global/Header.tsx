import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions'

interface HeaderProps {
  // Estados
  isLoading?: boolean
  unreadCount?: number

  // Handlers
  onNotificationPress: () => void
}

export function Header({ unreadCount = 0, onNotificationPress }: HeaderProps) {
  const { hasPermission, isChecking } = useNotificationPermissions()

  // Determinar cor e ícone baseado no status das permissões
  const getNotificationIcon = () => {
    if (isChecking) return 'notifications-outline'
    if (hasPermission === false) return 'notifications-off'
    return 'notifications'
  }

  const getNotificationColor = () => {
    if (isChecking) return '#9CA3AF'
    if (hasPermission === false) return '#EF4444'
    return '#374151'
  }

  return (
    <HStack className='justify-between items-center px-6 py-8 pt-12'>
      <HStack className='items-center space-x-3'>
        <HStack className='w-8 h-8 bg-purple-500 rounded-lg items-center justify-center'>
          <Ionicons name='restaurant' size={20} color='white' />
        </HStack>
        <Text className='text-xl font-bold pl-4 text-gray-900'>One Plate</Text>
      </HStack>
      <HStack className='space-x-5 gap-4'>
        <TouchableOpacity onPress={onNotificationPress} className='relative'>
          <Ionicons
            name={getNotificationIcon()}
            size={24}
            color={getNotificationColor()}
          />
          {hasPermission && unreadCount > 0 && (
            <HStack className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center'>
              <Text className='text-xs text-white font-bold'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </HStack>
          )}
          {hasPermission === false && (
            <HStack className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full' />
          )}
        </TouchableOpacity>
      </HStack>
    </HStack>
  )
}
