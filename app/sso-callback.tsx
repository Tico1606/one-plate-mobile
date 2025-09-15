import { useOAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'

export default function SSOCallback() {
  const { handleOAuthCallback } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const result = await handleOAuthCallback()

        if (result.status === 'complete') {
          router.replace('/(auth)/home' as any)
        } else {
          router.replace('/(public)/login' as any)
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        router.replace('/(public)/login' as any)
      }
    }

    handleCallback()
  }, [handleOAuthCallback, router])

  return (
    <Box className='flex-1 bg-white justify-center items-center'>
      <Text className='text-lg'>Processando login com Google...</Text>
    </Box>
  )
}
