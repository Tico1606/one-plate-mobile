import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { VStack } from '@/components/ui/vstack'

export interface Instruction {
  description: string
}

interface InstructionInputProps {
  instruction: Instruction
  index: number
  onUpdate: (index: number, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export function InstructionInput({
  instruction,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: InstructionInputProps) {
  return (
    <VStack className='space-y-3'>
      <HStack className='items-center justify-between py-1'>
        <Text className='font-semibold text-gray-700'>Passo {index + 1}</Text>
        {canRemove && (
          <TouchableOpacity
            onPress={() => onRemove(index)}
            className='rounded-full bg-red-100 p-2 mr-3 mt-2'
            activeOpacity={1}
          >
            <Ionicons name='trash-outline' size={16} color='#EF4444' />
          </TouchableOpacity>
        )}
      </HStack>

      <VStack className='space-y-1'>
        <Text className='font-medium text-gray-600 pb-1'>Descrição</Text>
        <Textarea className='bg-gray-50 border-gray-200 min-h-[80px]'>
          <TextareaInput
            value={instruction.description}
            onChangeText={(value: string) => onUpdate(index, value)}
            placeholder='Descreva este passo da receita...'
            numberOfLines={4}
          />
        </Textarea>
      </VStack>
    </VStack>
  )
}
