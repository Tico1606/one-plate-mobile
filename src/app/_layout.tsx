import { useAuth } from '@clerk/clerk-expo'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Slot, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { Box } from '@/components/ui/box'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Text } from '@/components/ui/text'
import { useLocale } from '@/contexts'
import { FavoritesProvider, ShoppingListProvider, LocaleProvider } from '@/contexts'
import { useAuthToken } from '@/hooks/useAuthToken'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { ClerkProvider, clerkConfig } from '@/lib/clerk'
import '@/styles/global.css'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  // Sincronizar token do Clerk com AsyncStorage
  useAuthToken()

  // Inicializar push notifications
  usePushNotifications()

  useEffect(() => {
    if (!isLoaded) return

    const inAuthGroup = segments[0] === '(auth)'
    const inPublicGroup = segments[0] === '(public)'
    const isSSOCallback = segments[0] === 'sso-callback'

    console.log('🔍 [LAYOUT] Estado atual:', {
      isLoaded,
      isSignedIn,
      segments: segments.join('/'),
      inAuthGroup,
      inPublicGroup,
      isSSOCallback,
    })

    if (isSSOCallback) return

    // Aguardar um pouco mais para garantir que o estado de autenticação seja atualizado
    const timeoutId = setTimeout(() => {
      if (isSignedIn && !inAuthGroup && !hasRedirected) {
        console.log(
          '✅ [LAYOUT] Usuário logado mas não está na área auth, redirecionando para home...',
        )
        setHasRedirected(true)
        router.replace('/(auth)/home' as any)
      } else if (!isSignedIn && !inPublicGroup && !hasRedirected) {
        console.log(
          '❌ [LAYOUT] Usuário não logado e não está na área pública, redirecionando para login...',
        )
        setHasRedirected(true)
        router.replace('/(public)/login' as any)
      } else {
        console.log('✅ [LAYOUT] Estado correto, mantendo usuário na tela atual')
      }
    }, 200) // Aumentar delay para garantir sincronização

    return () => clearTimeout(timeoutId)
  }, [isLoaded, isSignedIn, segments, router, hasRedirected])

  const { t } = useLocale()
  if (!isLoaded) {
    return (
      <Box className='flex-1 bg-zinc-50 justify-center items-center'>
        <Text className='text-lg'>{t('common.loading')}</Text>
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
        <LocaleProvider>
        <ClerkProvider
          publishableKey={clerkConfig?.publishableKey}
          tokenCache={clerkConfig.tokenCache}
          // signInUrl={clerkConfig.signInUrl}
          // signUpUrl={clerkConfig.signUpUrl}
          // afterSignInUrl={clerkConfig.afterSignInUrl}
          // afterSignUpUrl={clerkConfig.afterSignUpUrl}
        >
          <FavoritesProvider>
            <ShoppingListProvider>
              <InitialLayout />
            </ShoppingListProvider>
          </FavoritesProvider>
        </ClerkProvider>
        </LocaleProvider>
      </GluestackUIProvider>
    </Box>
  )
}
