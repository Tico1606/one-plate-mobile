import { useAuth } from '@clerk/clerk-expo'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Slot, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { Box } from '@/components/ui/box'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Text } from '@/components/ui/text'
import { useAuthToken } from '@/hooks/useAuthToken'
import { ClerkProvider, clerkConfig } from '@/lib/clerk'
import '@/styles/global.css'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  // Verificação do status de autenticação
  useEffect(() => {
    if (isLoaded) {
      // Status de autenticação verificado
    }
  }, [isLoaded])

  // Sincronizar token do Clerk com AsyncStorage
  useAuthToken()

  useEffect(() => {
    if (!isLoaded) return

    const inAuthGroup = segments[0] === '(auth)'
    const inPublicGroup = segments[0] === '(public)'
    const isSSOCallback = segments[0] === 'sso-callback'

    if (isSSOCallback) {
      return
    }

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/home' as any)
    } else if (!isSignedIn && !inPublicGroup) {
      router.replace('/(public)/login' as any)
    }
  }, [isLoaded, isSignedIn, segments, router])

  if (!isLoaded) {
    return (
      <Box className='flex-1 bg-zinc-50 justify-center items-center'>
        <Text className='text-lg'>Carregando...</Text>
      </Box>
    )
  }

  return <Slot />
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  const [colorMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  return (
    <Box className='flex-1 bg-zinc-50'>
      <GluestackUIProvider mode={colorMode}>
        <ClerkProvider
          publishableKey={clerkConfig?.publishableKey}
          tokenCache={clerkConfig.tokenCache}
        >
          <InitialLayout />
        </ClerkProvider>
      </GluestackUIProvider>
    </Box>
  )
}
