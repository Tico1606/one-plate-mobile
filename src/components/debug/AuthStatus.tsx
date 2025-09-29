import { useAuth, useUser } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { authToken } from '@/lib/auth-token'

export function AuthStatus() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const { user } = useUser()
  const [tokenStatus, setTokenStatus] = useState<string>('Verificando...')

  useEffect(() => {
    const checkToken = async () => {
      const token = await authToken.get()
      if (token) {
        setTokenStatus(`Token: ${token.substring(0, 20)}...`)
      } else {
        setTokenStatus('Nenhum token encontrado')
      }
    }
    checkToken()
  }, [])

  if (!isLoaded) {
    return (
      <Box className='p-4 bg-yellow-100 border border-yellow-300 rounded-lg'>
        <Text className='text-yellow-800 font-semibold'>
          🔄 Carregando autenticação...
        </Text>
      </Box>
    )
  }

  return (
    <Box className='p-4 bg-gray-100 border border-gray-300 rounded-lg m-4'>
      <VStack space='sm'>
        <Text className='text-lg font-bold text-gray-800'>🔐 Status de Autenticação</Text>

        <VStack space='xs'>
          <Text className='text-sm'>
            <Text className='font-semibold'>Clerk carregado:</Text>{' '}
            {isLoaded ? '✅ Sim' : '❌ Não'}
          </Text>

          <Text className='text-sm'>
            <Text className='font-semibold'>Usuário logado:</Text>{' '}
            {isSignedIn ? '✅ Sim' : '❌ Não'}
          </Text>

          <Text className='text-sm'>
            <Text className='font-semibold'>ID do usuário:</Text> {userId || 'N/A'}
          </Text>

          {user && (
            <>
              <Text className='text-sm'>
                <Text className='font-semibold'>Nome:</Text> {user.fullName || 'N/A'}
              </Text>

              <Text className='text-sm'>
                <Text className='font-semibold'>Email:</Text>{' '}
                {user.primaryEmailAddress?.emailAddress || 'N/A'}
              </Text>
            </>
          )}

          <Text className='text-sm'>
            <Text className='font-semibold'>Token AsyncStorage:</Text> {tokenStatus}
          </Text>
        </VStack>

        <Box className={`p-2 rounded ${isSignedIn ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text
            className={`text-center font-bold ${isSignedIn ? 'text-green-800' : 'text-red-800'}`}
          >
            {isSignedIn ? '✅ AUTENTICADO' : '❌ NÃO AUTENTICADO'}
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}
