import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

export interface Ingredient {
  name: string
  amount: string
  unit: string
}

interface IngredientInputProps {
  ingredient: Ingredient
  index: number
  onUpdate: (index: number, field: keyof Ingredient, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export function IngredientInput({
  ingredient,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: IngredientInputProps) {
  return (
    <VStack className='space-y-3'>
      <HStack className='items-center justify-between py-2'>
        <Text className='font-semibold text-gray-700'>Ingrediente n°{index + 1}</Text>
        {canRemove && (
          <TouchableOpacity
            onPress={() => onRemove(index)}
            className='rounded-full bg-red-100 p-2 mr-3 mt-2'
            activeOpacity={0.7}
          >
            <Ionicons name='trash-outline' size={16} color='#EF4444' />
          </TouchableOpacity>
        )}
      </HStack>

      <VStack className='space-y-3'>
        {/* Nome do ingrediente */}
        <VStack className='space-y-1'>
          <Text className='font-medium text-gray-600 pb-1'>Nome</Text>
          <Input className='bg-gray-50 border-gray-200'>
            <InputField
              value={ingredient.name}
              onChangeText={(value: string) => onUpdate(index, 'name', value)}
              placeholder='Ex: Macarrão'
            />
          </Input>
        </VStack>

        {/* Quantidade e Unidade */}
        <HStack className='space-x-3 py-1 gap-4'>
          <VStack className='flex-1 space-y-1'>
            <Text className='font-medium text-gray-600 py-1'>Quantidade</Text>
            <Input className='bg-gray-50 border-gray-200'>
              <InputField
                value={ingredient.amount}
                onChangeText={(value: string) => onUpdate(index, 'amount', value)}
                placeholder='Ex: 200'
                keyboardType='numeric'
              />
            </Input>
          </VStack>
          <VStack className='flex-1 space-y-1'>
            <Text className='font-medium text-gray-600 py-1'>Unidade</Text>
            <Input className='bg-gray-50 border-gray-200'>
              <InputField
                value={ingredient.unit}
                onChangeText={(value: string) => onUpdate(index, 'unit', value)}
                placeholder='Ex: g'
              />
            </Input>
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  )
}
