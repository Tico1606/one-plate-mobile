import { ActivityIndicator, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { useLocale } from '@/contexts'

export default function Index() {
  const { t } = useLocale()
  return (
    <View className='flex-1 bg-zinc-50 justify-center items-center'>
      <ActivityIndicator size='large' color='#8B5CF6' />
      <Text className='mt-4 text-gray-600'>{t('common.loading')}</Text>
    </View>
  )
}
