import { useOAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { useCreateUserBackend } from '@/hooks'

export default function SSOCallback() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()
  const { createUserInBackend } = useCreateUserBackend()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Iniciando OAuth Google...')
        const result = await startOAuthFlow({
          redirectUrl: 'oneplate://sso-callback',
        })

        if (result?.createdSessionId) {
          console.log('✅ Sessão criada, ativando sessão no Clerk...')
          try {
            if (typeof result.setActive === 'function') {
              await result.setActive({ session: result.createdSessionId })
            }
          } catch (err) {
            console.error('❌ Erro ao ativar sessão no Clerk:', err)
          }

          console.log('✅ Sessão ativa, criando usuário no backend...')
          try {
            await createUserInBackend()
          } catch (error) {
            console.error('⚠️ Erro ao criar usuário no backend:', error)
          }

          // Aguardar estabilização da sessão antes de redirecionar
          console.log('🔄 Aguardando estabilização da sessão...')
          await new Promise((resolve) => setTimeout(resolve, 2000))

          router.replace('/(auth)/home' as any)
        } else {
          console.log('❌ Falha no OAuth, redirecionando para login...')
          router.replace('/(public)/login' as any)
        }
      } catch (error) {
        console.error('❌ Erro no fluxo OAuth:', error)
        router.replace('/(public)/login' as any)
      }
    }

    handleCallback()
  }, [startOAuthFlow, router, createUserInBackend])

  return (
    <Box className='flex-1 bg-white justify-center items-center'>
      <Text className='text-lg'>Processando login com Google...</Text>
    </Box>
  )
}
