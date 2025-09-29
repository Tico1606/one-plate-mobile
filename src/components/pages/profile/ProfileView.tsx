import { Ionicons } from '@expo/vector-icons'
import { Image, ScrollView, TouchableOpacity } from 'react-native'

import { Header } from '@/components/global/Header'
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

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

interface User {
  firstName?: string | null
  lastName?: string | null
  imageUrl?: string
  emailAddresses: Array<{ emailAddress: string }>
}

interface ProfileViewProps {
  // Dados
  user: User | null | undefined
  profileStats: ProfileStat[]
  menuItems: MenuItem[]
  isLoading?: boolean

  // Handlers
  handleSignOut: () => void
  handleSettingsPress: () => void
  handleMenuItemPress: (item: MenuItem) => void
  handleNotificationPress?: () => void
}

export function ProfileView({
  user,
  profileStats,
  menuItems,
  isLoading = false,
  handleSignOut,
  handleSettingsPress,
  handleMenuItemPress,
  handleNotificationPress = () => {
    // TODO: Implementar notificações
  },
}: ProfileViewProps) {
  return (
    <Box className='flex-1 bg-zinc-100'>
      {/* Header */}
      <Header isLoading={isLoading} onNotificationPress={handleNotificationPress} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Box className='bg-white px-6 py-8 mx-4 rounded-lg'>
          <HStack className='justify-between items-center mb-6'>
            <Text className='text-2xl font-bold text-gray-900'>Perfil</Text>
            <TouchableOpacity onPress={handleSettingsPress}>
              <Ionicons name='create' size={24} color='#374151' />
            </TouchableOpacity>
          </HStack>

          {/* Profile Info */}
          <HStack className='items-center space-x-4 mb-8 gap-4'>
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
                <Box className='w-12 h-12 mb-1 bg-gray-100 rounded-full items-center justify-center'>
                  <Ionicons name={stat.icon as any} size={20} color='#6B7280' />
                </Box>
                <Text className='text-lg font-bold text-gray-900'>{stat.value}</Text>
                <Text className='text-xs text-gray-600'>{stat.label}</Text>
              </VStack>
            ))}
          </HStack>
        </Box>

        {/* Menu Items */}
        <VStack className='px-6 py-4 space-y-2 '>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleMenuItemPress(item)}>
              <Card className='p-4'>
                <HStack className='items-center space-x-4 gap-2'>
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
