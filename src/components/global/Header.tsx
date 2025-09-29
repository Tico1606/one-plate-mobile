import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'

interface HeaderProps {
  // Estados
  isLoading?: boolean

  // Handlers
  onNotificationPress: () => void
}

export function Header({ isLoading, onNotificationPress }: HeaderProps) {
  return (
    <HStack className='justify-between items-center px-6 py-8 pt-12'>
      <HStack className='items-center space-x-3'>
        <HStack className='w-8 h-8 bg-purple-500 rounded-lg items-center justify-center'>
          <Ionicons name='restaurant' size={20} color='white' />
        </HStack>
        <Text className='text-xl font-bold pl-4 text-gray-900'>One Plate</Text>
      </HStack>
      <HStack className='space-x-5 gap-4'>
        <TouchableOpacity onPress={onNotificationPress}>
          <Ionicons name='notifications' size={24} color='#374151' />
        </TouchableOpacity>
        {isLoading && <ActivityIndicator size='small' color='#8B5CF6' />}
      </HStack>
    </HStack>
  )
}
