import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'

import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'

interface SearchBarProps {
  // Estados
  placeholder?: string

  // Handlers
  onSearchPress: () => void
  onFilterPress: () => void
}

export function SearchBar({
  placeholder = 'Buscar receitas, ingredientes...',
  onSearchPress,
  onFilterPress,
}: SearchBarProps) {
  return (
    <Box className='mx-6 mb-6'>
      <HStack className='bg-white rounded-xl px-4 py-3 items-center space-x-3 gap-1'>
        <TouchableOpacity onPress={onSearchPress}>
          <Ionicons name='search' size={22} color='#8B5CF6' />
        </TouchableOpacity>
        <Box className='flex-1'>
          <Text className='text-gray-500 text-base' numberOfLines={1}>
            {placeholder}
          </Text>
        </Box>
        <TouchableOpacity onPress={onFilterPress}>
          <Ionicons name='options-outline' size={22} color='#6B7280' />
        </TouchableOpacity>
      </HStack>
    </Box>
  )
}
