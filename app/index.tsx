import { ActivityIndicator, View } from 'react-native'
import { Text } from '@/components/ui/text'

export default function Index() {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text>Hello Tico1606</Text>
      
      <ActivityIndicator size='large' color='#121212' />
    </View>
  )
}
