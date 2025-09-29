import { useAuth } from '@clerk/clerk-expo'
import { useEffect } from 'react'
import { authToken } from '@/lib/auth-token'

export function useAuthToken() {
  const { isSignedIn, getToken, signOut } = useAuth()

  // Sincronizar token do Clerk com AsyncStorage
  useEffect(() => {
    const syncToken = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken()
          if (token) {
            await authToken.save(token)
          }
        } catch (error) {
          console.error('Erro ao sincronizar token:', error)
        }
      } else {
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
