import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert } from 'react-native'
import { useNotificationBadge } from '@/hooks/useNotificationBadge'
import { type EditProfileFormData, editProfileSchema } from '@/lib/validations/profile'
import { type UserProfile, usersService } from '@/services/users'

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
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [backendProfile, setBackendProfile] = useState<UserProfile | null>(null)
  const [editFormData, setEditFormData] = useState<EditProfileFormData>({
    name: '',
    photoUrl: '',
    description: '',
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Hook para contador de notificações
  const { unreadCount } = useNotificationBadge()

  const menuItems: MenuItem[] = useMemo(
    () => [
      { id: 1, title: 'Minhas Receitas', icon: 'book', color: '#3B82F6' },
      { id: 2, title: 'Lista de Compras', icon: 'basket', color: '#F59E0B' },
      { id: 3, title: 'Configurações', icon: 'settings', color: '#6B7280' },
      { id: 5, title: 'Sobre', icon: 'information-circle', color: '#8B5CF6' },
    ],
    [],
  )

  // Função para carregar perfil (reutilizável)
  const loadProfile = useCallback(async () => {
    if (!user) return

    try {
      setIsLoadingProfile(true)

      const profile = await usersService.getProfile()
      setBackendProfile(profile)
    } catch (error: any) {
      // Se o usuário não existir no backend (404), criar automaticamente
      if (error?.response?.status === 404) {
        try {
          const userData = {
            email: user.emailAddresses[0]?.emailAddress || '',
            name: user.fullName || user.firstName || undefined,
            photoUrl: user.imageUrl || undefined,
          }

          const createdUser = await usersService.createUser(userData)
          setBackendProfile(createdUser)
        } catch (createError) {
          console.error('❌ [PROFILE] Erro ao criar usuário no backend:', createError)
        }
      }
    } finally {
      setIsLoadingProfile(false)
    }
  }, [user])

  // Carregar perfil quando o componente montar
  // biome-ignore lint/correctness/useExhaustiveDependencies: mandatory
  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]) // Usar apenas o ID para evitar re-renders

  const handleSignOut = async () => {
    // Prevenir múltiplos cliques
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)
      await signOut()
      router.replace('/(public)/login' as any)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      Alert.alert('Erro', 'Não foi possível fazer logout')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Abrir modal de edição
  const handleEditProfile = useCallback(() => {
    if (user) {
      const name = backendProfile?.name || ''
      const photoUrl = backendProfile?.photoUrl || ''
      const description = backendProfile?.description || ''

      setEditFormData({
        name: name,
        photoUrl: photoUrl,
        description: description,
      })
      setIsEditModalVisible(true)
    }
  }, [user, backendProfile])

  // Fechar modal de edição
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalVisible(false)
    setEditFormData({
      name: '',
      photoUrl: '',
      description: '',
    })
    setValidationErrors({})
  }, [])

  // Atualizar campo do formulário
  const updateEditField = useCallback((field: string, value: string) => {
    setEditFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Validar campo específico em tempo real
      try {
        editProfileSchema.parse(newData)
        // Se válido, remover erro deste campo
        setValidationErrors((prevErrors) => {
          const { [field]: _, ...rest } = prevErrors
          return rest
        })
      } catch (error) {
        if (error instanceof Error && 'issues' in error) {
          const zodError = error as any
          const fieldError = zodError.issues.find((issue: any) => issue.path[0] === field)
          if (fieldError) {
            setValidationErrors((prevErrors) => ({
              ...prevErrors,
              [field]: fieldError.message,
            }))
          }
        }
      }

      return newData
    })
  }, [])

  // Salvar alterações do perfil
  const handleSaveProfile = useCallback(async () => {
    if (!user || isUpdatingProfile) return

    try {
      // Validar formulário com Zod
      const validationResult = editProfileSchema.safeParse(editFormData)

      if (!validationResult.success) {
        // Mostrar erros de validação
        const errors: Record<string, string> = {}
        validationResult.error.issues.forEach((issue) => {
          const field = issue.path[0] as string
          errors[field] = issue.message
        })
        setValidationErrors(errors)
        return
      }

      setIsUpdatingProfile(true)

      // Atualizar apenas no backend

      const updateData = {
        name: editFormData.name.trim(),
        photoUrl: editFormData.photoUrl?.trim() || undefined,
        description: editFormData.description?.trim() || undefined,
      }

      await usersService.updateProfile(updateData)

      setIsEditModalVisible(false)
      setValidationErrors({})

      // Recarregar o perfil para garantir sincronização
      await loadProfile()

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('❌ [PROFILE] Erro ao atualizar perfil:', error)
      Alert.alert('Erro', 'Não foi possível atualizar o perfil')
    } finally {
      setIsUpdatingProfile(false)
    }
  }, [user, editFormData, isUpdatingProfile, loadProfile])

  const handleSettingsPress = () => {
    // TODO: Implementar navegação para configurações
  }

  const handleNotificationPress = useCallback(() => {
    router.push('/(auth)/notifications')
  }, [router])

  const handleMenuItemPress = (item: MenuItem) => {
    switch (item.id) {
      case 1: // Minhas Receitas
        router.push('/(auth)/my-recipes')
        break
      case 2: // Lista de Compras
        handleShoppingListPress()
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

  const handleShoppingListPress = useCallback(() => {
    router.push('/shopping-list')
  }, [router])

  const handleCloseShoppingList = useCallback(() => {
    // Não é mais necessário pois não é mais um modal
  }, [])

  return {
    // Dados
    user,
    backendProfile,
    menuItems,
    isLoggingOut,
    isLoadingProfile,
    isEditModalVisible,
    isUpdatingProfile,
    editFormData,
    validationErrors,
    unreadNotificationsCount: unreadCount,

    // Handlers
    handleSignOut,
    handleSettingsPress,
    handleNotificationPress,
    handleMenuItemPress,
    handleEditProfile,
    handleCloseEditModal,
    handleShoppingListPress,
    handleCloseShoppingList,
    updateEditField,
    handleSaveProfile,
  }
}
