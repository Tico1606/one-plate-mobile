import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'

interface ImageInputProps {
  image: string
  index: number
  onUpdate: (index: number, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export function ImageInput({
  image,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: ImageInputProps) {
  return (
    <HStack className='items-center space-x-2 gap-2 py-2'>
      <Input className='flex-1 bg-gray-50 border-gray-200'>
        <InputField
          value={image}
          onChangeText={(value: string) => onUpdate(index, value)}
          placeholder={`URL da imagem ${index + 1}`}
        />
      </Input>

      {canRemove && (
        <TouchableOpacity
          onPress={() => onRemove(index)}
          className='w-8 h-8 bg-red-500 rounded-full items-center justify-center'
          activeOpacity={1}
        >
          <Ionicons name='close' size={16} color='white' />
        </TouchableOpacity>
      )}
    </HStack>
  )
}
