import { useAuth, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Image, ScrollView, TouchableOpacity } from 'react-native'

import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

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

  const profileStats = [
    { label: 'Receitas', value: '24', icon: 'restaurant' },
    { label: 'Favoritos', value: '156', icon: 'heart' },
    { label: 'Seguidores', value: '1.2k', icon: 'people' },
    { label: 'Seguindo', value: '89', icon: 'person-add' },
  ]

  const menuItems = [
    { id: 1, title: 'Minhas Receitas', icon: 'book', color: '#3B82F6' },
    { id: 2, title: 'Favoritos', icon: 'heart', color: '#EF4444' },
    { id: 3, title: 'Configurações', icon: 'settings', color: '#6B7280' },
    { id: 4, title: 'Ajuda', icon: 'help-circle', color: '#10B981' },
    { id: 5, title: 'Sobre', icon: 'information-circle', color: '#8B5CF6' },
  ]

  return (
    <Box className='flex-1 bg-gray-50'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Box className='bg-white px-6 py-8'>
          <HStack className='justify-between items-center mb-6'>
            <Text className='text-2xl font-bold text-gray-900'>Perfil</Text>
            <TouchableOpacity>
              <Ionicons name='settings' size={24} color='#374151' />
            </TouchableOpacity>
          </HStack>

          {/* Profile Info */}
          <HStack className='items-center space-x-4 mb-6'>
            <Box className='w-20 h-20 bg-purple-500 rounded-full items-center justify-center'>
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className='w-20 h-20 rounded-full'
                  resizeMode='cover'
                />
              ) : (
                <Ionicons name='person' size={40} color='white' />
              )}
            </Box>
            <VStack className='flex-1 space-y-1'>
              <Text className='text-xl font-bold text-gray-900'>
                {user?.firstName || 'Usuário'} {user?.lastName || ''}
              </Text>
              <Text className='text-gray-600'>
                {user?.emailAddresses[0]?.emailAddress}
              </Text>
              <Text className='text-sm text-gray-500'>Membro desde 2024</Text>
            </VStack>
          </HStack>

          {/* Stats */}
          <HStack className='justify-between'>
            {profileStats.map((stat) => (
              <VStack key={stat.label} className='items-center space-y-1'>
                <Box className='w-12 h-12 bg-gray-100 rounded-full items-center justify-center'>
                  <Ionicons name={stat.icon as any} size={20} color='#6B7280' />
                </Box>
                <Text className='text-lg font-bold text-gray-900'>{stat.value}</Text>
                <Text className='text-xs text-gray-600'>{stat.label}</Text>
              </VStack>
            ))}
          </HStack>
        </Box>

        {/* Menu Items */}
        <VStack className='px-6 py-4 space-y-2'>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id}>
              <Card className='p-4'>
                <HStack className='items-center space-x-4'>
                  <Box
                    className='w-10 h-10 rounded-full items-center justify-center'
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </Box>
                  <Text className='flex-1 text-gray-900 font-medium'>{item.title}</Text>
                  <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
                </HStack>
              </Card>
            </TouchableOpacity>
          ))}
        </VStack>

        {/* Logout Button */}
        <Box className='px-6 py-4'>
          <Button onPress={handleSignOut} variant='outline' className='border-red-200'>
            <HStack className='items-center space-x-2'>
              <Ionicons name='log-out' size={20} color='#EF4444' />
              <ButtonText className='text-red-500 font-medium'>Sair da Conta</ButtonText>
            </HStack>
          </Button>
        </Box>
      </ScrollView>
    </Box>
  )
}
