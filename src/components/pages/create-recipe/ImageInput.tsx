import { Ionicons } from '@expo/vector-icons'
import { Alert, Image, TouchableOpacity } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { useImageUpload } from '@/hooks'

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
  const { isUploading, uploadRecipePhoto, showImagePicker } = useImageUpload({
    aspect: [4, 3],
    quality: 0.8,
  })

  const handleImageSelection = async () => {
    const uri = await showImagePicker()
    if (uri) {
      const uploadedUrl = await uploadRecipePhoto(uri)
      if (uploadedUrl) {
        onUpdate(index, uploadedUrl)
      }
    }
  }

  const removeImage = () => {
    Alert.alert('Remover imagem', 'Tem certeza que deseja remover esta imagem?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => onRemove(index) },
    ])
  }

  return (
    <HStack className='items-center space-x-2 gap-2 py-3'>
      {image ? (
        // Mostrar imagem carregada
        <HStack className='flex-1 items-center space-x-2 gap-2'>
          <Image
            source={{ uri: image }}
            className='w-12 h-12 rounded-lg bg-gray-100'
            resizeMode='cover'
          />
          <Text className='flex-1 font-medium text-gray-600' numberOfLines={1}>
            Imagem {index + 1} carregada
          </Text>
        </HStack>
      ) : (
        // Botão para adicionar imagem
        <Button
          onPress={handleImageSelection}
          disabled={isUploading}
          className='flex-1 bg-purple-500'
          variant='solid'
        >
          <ButtonText className='text-white'>
            {isUploading ? 'Carregando...' : `Adicionar imagem ${index + 1}`}
          </ButtonText>
        </Button>
      )}

      {/* Botão de remover */}
      {canRemove && image && (
        <TouchableOpacity
          onPress={removeImage}
          className='w-8 h-8 bg-red-500 rounded-full items-center justify-center'
          activeOpacity={0.7}
        >
          <Ionicons name='close' size={16} color='white' />
        </TouchableOpacity>
      )}
    </HStack>
  )
}
