import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'

import { ProfilePage } from '@/components'

export default function Profile() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(public)/login' as any)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      Alert.alert('Erro', 'Não foi possível fazer logout')
    }
  }

  const handleSettingsPress = () => {
    // TODO: Implementar navegação para configurações
    console.log('Settings pressed')
  }

  const handleMenuItemPress = (item: any) => {
    // TODO: Implementar navegação para item do menu
    console.log('Menu item pressed:', item)
  }

  return (
    <ProfilePage
      user={user}
      onSettingsPress={handleSettingsPress}
      onMenuItemPress={handleMenuItemPress}
      onSignOut={handleSignOut}
    />
  )
}
