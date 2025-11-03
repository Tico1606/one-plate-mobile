import { useAuth } from '@clerk/clerk-expo'
import { useEffect } from 'react'
import { authToken } from '@/lib/auth-token'

export function useAuthToken() {
  const { isSignedIn, getToken, signOut } = useAuth()

  // Sincronizar token do Clerk com AsyncStorage
  useEffect(() => {
    const syncToken = async () => {
      console.log('🔄 [AUTH-TOKEN] Sincronizando token, isSignedIn:', isSignedIn)

      if (isSignedIn) {
        try {
          const token = await getToken()
          console.log('🔑 [AUTH-TOKEN] Token obtido:', token ? 'SIM' : 'NÃO')
          if (token) {
            await authToken.save(token)
            console.log('✅ [AUTH-TOKEN] Token salvo no AsyncStorage')
          } else {
            console.warn('⚠️ [AUTH-TOKEN] isSignedIn=true mas token é null/undefined')
          }
        } catch (error) {
          console.error('❌ [AUTH-TOKEN] Erro ao sincronizar token:', error)
        }
      } else {
        console.log('🧹 [AUTH-TOKEN] isSignedIn=false, removendo token do AsyncStorage')
        await authToken.remove()
      }
    }

    syncToken()
  }, [isSignedIn, getToken])

  const logout = async () => {
    await authToken.remove()
    await signOut()
  }

  return {
    isSignedIn,
    logout,
  }
}
