import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { Header } from '@/components/global/Header'
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { ModalBackdrop } from '@/components/ui/modal/index'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { useImageUpload } from '@/hooks'

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

interface BackendProfile {
  id: string
  name: string
  email: string
  photoUrl?: string
  description?: string
  role: string
  createdAt: string
  updatedAt: string
}

interface ProfileViewProps {
  // Dados
  user: User | null | undefined
  backendProfile: BackendProfile | null
  menuItems: MenuItem[]
  isLoading?: boolean
  isLoadingProfile?: boolean
  isLoggingOut?: boolean
  isEditModalVisible?: boolean
  isUpdatingProfile?: boolean
  editFormData?: {
    name: string
    photoUrl: string
    description: string
  }
  validationErrors?: Record<string, string>
  unreadNotificationsCount?: number

  // Handlers
  handleSignOut: () => void
  handleSettingsPress: () => void
  handleMenuItemPress: (item: MenuItem) => void
  handleNotificationPress?: () => void
  handleEditProfile?: () => void
  handleCloseEditModal?: () => void
  handleShoppingListPress?: () => void
  updateEditField?: (field: string, value: string) => void
  handleSaveProfile?: () => void
}

export const ProfileView = React.memo(function ProfileView({
  user,
  backendProfile,
  menuItems,
  isLoading = false,
  isLoadingProfile = false,
  isLoggingOut = false,
  isEditModalVisible = false,
  isUpdatingProfile = false,
  editFormData = { name: '', photoUrl: '', description: '' },
  validationErrors = {},
  unreadNotificationsCount = 0,
  handleSignOut,
  handleMenuItemPress,
  handleNotificationPress = () => {
    // TODO: Implementar notificações
  },
  handleEditProfile = () => {},
  handleCloseEditModal = () => {
    // Implementado pelo hook useProfilePage
  },
  handleShoppingListPress = () => {
    // Navegação será feita pelo hook useProfilePage
  },
  updateEditField = () => {},
  handleSaveProfile = () => {},
}: ProfileViewProps) {
  const { isUploading, uploadProfilePhoto, showImagePicker } = useImageUpload({
    aspect: [1, 1], // Quadrado para foto de perfil
    quality: 0.8,
  })

  const handlePhotoSelection = async () => {
    const uri = await showImagePicker()
    if (uri) {
      const uploadedUrl = await uploadProfilePhoto(uri)
      if (uploadedUrl) {
        updateEditField('photoUrl', uploadedUrl)
      }
    }
  }

  return (
    <Box className='flex-1 bg-zinc-100'>
      {/* Header */}
      <Header
        isLoading={isLoading}
        unreadCount={unreadNotificationsCount}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Box className='bg-white px-6 py-8 mx-4 rounded-lg'>
          <HStack className='justify-between items-center mb-6'>
            <Text className='text-2xl font-bold text-gray-900'>Perfil</Text>
            <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.9}>
              <Ionicons name='create' size={24} color='#374151' />
            </TouchableOpacity>
          </HStack>

          {/* Profile Info */}
          <HStack className='items-center space-x-4 mb-8 gap-4'>
            <Box className='w-20 h-20 bg-purple-500 rounded-full items-center justify-center'>
              {isLoadingProfile ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                // biome-ignore lint/complexity/noUselessFragments: mandatory
                <>
                  {backendProfile?.photoUrl ? (
                    <Image
                      source={{ uri: backendProfile.photoUrl }}
                      className='w-20 h-20 rounded-full'
                      resizeMode='cover'
                    />
                  ) : user?.imageUrl ? (
                    <Image
                      source={{ uri: user.imageUrl }}
                      className='w-20 h-20 rounded-full'
                      resizeMode='cover'
                    />
                  ) : (
                    <Ionicons name='person' size={40} color='white' />
                  )}
                </>
              )}
            </Box>
            <VStack className='flex-1 space-y-1'>
              {isLoadingProfile ? (
                <>
                  <Box className='h-6 bg-gray-200 rounded w-32 mb-2' />
                  <Box className='h-4 bg-gray-200 rounded w-48 mb-1' />
                  <Box className='h-3 bg-gray-200 rounded w-24' />
                </>
              ) : (
                <>
                  <Text className='text-2xl font-bold text-gray-900'>
                    {backendProfile?.name ||
                      `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                      'Usuário'}
                  </Text>
                  <Text className='text-gray-600 font-medium'>
                    {backendProfile?.email ||
                      user?.emailAddresses[0]?.emailAddress ||
                      'Email não disponível'}
                  </Text>
                  <Text className='text-sm text-gray-500 font-medium'>
                    Membro desde{' '}
                    {backendProfile?.createdAt
                      ? new Date(backendProfile.createdAt).getFullYear()
                      : '2024'}
                  </Text>
                </>
              )}
            </VStack>
          </HStack>

          {/* Descrição */}
          <Text className='text-lg font-medium text-gray-700'>Descrição</Text>
          <VStack className='p-2 mt-2 space-y-2 border border-gray-200 rounded-lg'>
            {backendProfile?.description ? (
              <Text className='text-gray-600 text-md leading-5'>
                {backendProfile.description}
              </Text>
            ) : (
              <Text className='text-gray-600 text-md leading-5'>Nenhuma descrição</Text>
            )}
          </VStack>
        </Box>

        {/* Menu Items */}
        <VStack className='px-6 py-4 space-y-2 gap-4'>
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
          <Button
            onPress={handleSignOut}
            disabled={isLoggingOut}
            variant='outline'
            className='border-red-200'
          >
            {isLoggingOut ? (
              <HStack className='items-center space-x-2'>
                <ActivityIndicator size='small' color='#EF4444' />
                <ButtonText className='text-red-500 font-medium'>Saindo...</ButtonText>
              </HStack>
            ) : (
              <HStack className='items-center space-x-2'>
                <Ionicons name='log-out' size={20} color='#EF4444' />
                <ButtonText className='text-red-500 font-medium'>
                  Sair da Conta
                </ButtonText>
              </HStack>
            )}
          </Button>
        </Box>
      </ScrollView>

      {/* Modal de Edição de Perfil */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={handleCloseEditModal}
      >
        <ModalBackdrop className='bg-black/60' />
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white rounded-lg mx-4 w-[80%] max-w-md'>
            {/* Header */}
            <HStack className='justify-between items-center p-4 border-b border-gray-200'>
              <Text className='text-lg font-semibold text-gray-900'>Editar Perfil</Text>
              <TouchableOpacity onPress={handleCloseEditModal}>
                <Ionicons name='close' size={24} color='#6B7280' />
              </TouchableOpacity>
            </HStack>

            {/* Body */}
            <VStack className='p-4 mb-2 gap-4 space-y-4'>
              {/* Nome */}
              <VStack className='space-y-2 gap-2'>
                <Text className='font-medium text-gray-700'>Nome</Text>
                <Input
                  className={`bg-gray-50 ${validationErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                >
                  <InputField
                    value={editFormData.name}
                    onChangeText={(value: string) => updateEditField('name', value)}
                    placeholder='Digite seu nome'
                  />
                </Input>
                {validationErrors.name && (
                  <Text className='text-red-500 text-sm'>{validationErrors.name}</Text>
                )}
              </VStack>

              {/* Descrição */}
              <VStack className='space-y-2 gap-2'>
                <Text className='font-medium text-gray-700'>Descrição</Text>
                <Input className='bg-gray-50 border-gray-200'>
                  <InputField
                    value={editFormData.description}
                    onChangeText={(value: string) =>
                      updateEditField('description', value)
                    }
                    placeholder='Conte um pouco sobre você...'
                    multiline
                    numberOfLines={3}
                  />
                </Input>
              </VStack>

              {/* Upload da Foto */}
              <VStack className='space-y-2 gap-2'>
                <Text className='font-medium text-gray-700'>Foto de Perfil</Text>
                <HStack className='space-x-2 gap-2'>
                  <Button
                    onPress={handlePhotoSelection}
                    disabled={isUploading}
                    variant='outline'
                    className='flex-1 border-purple-300'
                  >
                    <ButtonText className='text-purple-600'>
                      {isUploading ? 'Carregando...' : 'Selecionar Foto'}
                    </ButtonText>
                  </Button>
                  {editFormData.photoUrl && (
                    <TouchableOpacity
                      onPress={() => updateEditField('photoUrl', '')}
                      className='px-3 py-2 bg-red-100 rounded-lg items-center justify-center'
                      activeOpacity={0.7}
                    >
                      <Ionicons name='trash' size={16} color='#EF4444' />
                    </TouchableOpacity>
                  )}
                </HStack>
              </VStack>

              {/* Preview da Foto */}
              {editFormData.photoUrl && (
                <VStack className='space-y-2'>
                  <Text className='font-medium text-gray-700'>Preview</Text>
                  <Box className='w-20 h-20 bg-purple-500 rounded-full items-center justify-center self-center'>
                    <Image
                      source={{ uri: editFormData.photoUrl }}
                      className='w-20 h-20 rounded-full'
                      resizeMode='cover'
                    />
                  </Box>
                </VStack>
              )}
            </VStack>

            {/* Footer */}
            <HStack className='p-4 border-t border-gray-200 space-x-3 gap-2'>
              <Button
                variant='outline'
                onPress={handleCloseEditModal}
                className='flex-1 border-gray-300'
              >
                <ButtonText className='text-gray-700'>Cancelar</ButtonText>
              </Button>
              <Button
                onPress={handleSaveProfile}
                disabled={isUpdatingProfile}
                className='flex-1 bg-purple-500'
              >
                {isUpdatingProfile ? (
                  <HStack className='items-center space-x-2'>
                    <ActivityIndicator size='small' color='white' />
                    <ButtonText className='text-white'>Salvando...</ButtonText>
                  </HStack>
                ) : (
                  <ButtonText className='text-white'>Salvar</ButtonText>
                )}
              </Button>
            </HStack>
          </View>
        </View>
      </Modal>
    </Box>
  )
})
