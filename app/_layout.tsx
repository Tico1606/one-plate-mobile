import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import '@/global.css'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, usePathname, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { Fab, FabIcon } from '@/components/ui/fab'
import { MoonIcon, SunIcon } from '@/components/ui/icon'

export { ErrorBoundary } from 'expo-router'

const publishKey = process.env.CLERK_PUBLISHABLE_KEY

SplashScreen.preventAutoHideAsync()

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) return
    
    console.log('isSignedIn:', isSignedIn)
  }, [isSignedIn])

  return <Slot />
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })
  
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  return (
    <GluestackUIProvider mode={colorMode}>
      <ClerkProvider publishableKey={publishKey} tokenCache={tokenCache}>
        <InitialLayout />
        
      </ClerkProvider>
    </GluestackUIProvider>
  )
}
