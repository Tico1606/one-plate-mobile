import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'

interface ProfileStat {
  label: string
  value: string
  icon: string
}

interface MenuItem {
  id: number
  title: string
  icon: string
  color: string
}

export function useProfilePage() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const profileStats: ProfileStat[] = [
    { label: 'Receitas', value: '24', icon: 'restaurant' },
    { label: 'Favoritos', value: '156', icon: 'heart' },
    { label: 'Seguidores', value: '1.2k', icon: 'people' },
    { label: 'Seguindo', value: '89', icon: 'person-add' },
  ]

  const menuItems: MenuItem[] = [
    { id: 1, title: 'Minhas Receitas', icon: 'book', color: '#3B82F6' },
    { id: 2, title: 'Favoritos', icon: 'heart', color: '#EF4444' },
    { id: 3, title: 'Configurações', icon: 'settings', color: '#6B7280' },
    { id: 4, title: 'Ajuda', icon: 'help-circle', color: '#10B981' },
    { id: 5, title: 'Sobre', icon: 'information-circle', color: '#8B5CF6' },
  ]

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
  }

  const handleMenuItemPress = (item: MenuItem) => {
    switch (item.id) {
      case 1: // Minhas Receitas
        router.push('/(auth)/my-recipes')
        break
      case 2: // Favoritos
        router.push('/(auth)/(tabs)/favorites')
        break
      case 3: // Configurações
        // TODO: Implementar navegação para configurações
        break
      case 4: // Ajuda
        // TODO: Implementar navegação para ajuda
        break
      case 5: // Sobre
        // TODO: Implementar navegação para sobre
        break
      default:
        break
    }
  }

  return {
    // Dados
    user,
    profileStats,
    menuItems,

    // Handlers
    handleSignOut,
    handleSettingsPress,
    handleMenuItemPress,
  }
}
