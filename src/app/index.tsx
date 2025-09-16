import { ActivityIndicator, View } from 'react-native'

export default function Index() {
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size='large' color='#121212' />
    </View>
  )
}
