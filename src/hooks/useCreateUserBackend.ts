import { useUser } from '@clerk/clerk-expo'
import { useCallback } from 'react'
import { usersService } from '@/services/users'

export function useCreateUserBackend() {
  const { user } = useUser()

  const createUserInBackend = useCallback(async () => {
    if (!user) {
      console.warn('⚠️ [CREATE-USER-BACKEND] Nenhum usuário do Clerk encontrado')
      return null
    }

    const email = user.emailAddresses[0]?.emailAddress
    if (!email) {
      console.warn('⚠️ [CREATE-USER-BACKEND] Email do usuário não encontrado')
      return null
    }

    try {
      console.log('🔄 [CREATE-USER-BACKEND] Criando usuário no backend...')

      const userData = {
        email,
        name: user.fullName || user.firstName || undefined,
        imageUrl: user.imageUrl || undefined,
      }

      console.log('📤 [CREATE-USER-BACKEND] Dados do usuário:', userData)

      const createdUser = await usersService.createUser(userData)

      console.log('✅ [CREATE-USER-BACKEND] Usuário criado no backend:', createdUser)
      return createdUser
    } catch (error: any) {
      console.error('❌ [CREATE-USER-BACKEND] Erro ao criar usuário no backend:', error)

      // Verificar se o usuário já existe (erro 409 - Conflict)
      if (error?.response?.status === 409) {
        console.log('ℹ️ [CREATE-USER-BACKEND] Usuário já existe no backend')
        return null
      }

      // Verificar se é erro de validação (erro 400 - Bad Request)
      if (error?.response?.status === 400) {
        console.error('❌ [CREATE-USER-BACKEND] Dados inválidos:', error.response.data)
        return null
      }

      // Para outros erros, logar mas não quebrar o fluxo
      console.error('❌ [CREATE-USER-BACKEND] Erro inesperado:', error.message || error)

      // Não rejeitar o erro para não quebrar o fluxo de autenticação
      // O usuário pode continuar usando o app mesmo se falhar a criação no backend
      return null
    }
  }, [user])

  return {
    createUserInBackend,
  }
}
