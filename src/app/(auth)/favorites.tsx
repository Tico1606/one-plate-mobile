import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

export default function Favorites() {
  return (
    <Box className='flex-1 bg-white px-6 py-12'>
      <VStack space='lg' className='flex-1'>
        <Heading size='2xl' className='text-center'>
          Favoritos
        </Heading>
        <Text className='text-center text-gray-600'>Suas receitas favoritas</Text>
      </VStack>
    </Box>
  )
}
