import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native'

import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChangeText: (text: string) => void
  onSearchPress: () => void
  onSearchChange?: (text: string) => void // Nova prop para busca automática
  debounceMs?: number // Delay para debounce
}

export function SearchBar({
  placeholder = 'Buscar receitas por nome, ingredientes...',
  value,
  onChangeText,
  onSearchPress,
  onSearchChange,
  debounceMs = 500,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value || '')

  // Atualizar valor local quando prop value mudar
  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  // Debounce para busca automática
  useEffect(() => {
    if (!onSearchChange) return

    const timeoutId = setTimeout(() => {
      onSearchChange(localValue)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [localValue, onSearchChange, debounceMs])

  const handleTextChange = (text: string) => {
    setLocalValue(text)
    onChangeText(text)
  }

  return (
    <Box className='mx-6 mb-6'>
      <HStack className='bg-white rounded-xl px-4 py-3 items-center space-x-3 gap-1'>
        <TextInput
          className='flex-1 text-gray-700 text-base'
          placeholder={placeholder}
          placeholderTextColor='#9CA3AF'
          value={localValue}
          onChangeText={handleTextChange}
          onSubmitEditing={onSearchPress}
          returnKeyType='search'
        />
        <TouchableOpacity onPress={onSearchPress}>
          <Ionicons name='search' size={22} color='#8B5CF6' />
        </TouchableOpacity>
      </HStack>
    </Box>
  )
}
