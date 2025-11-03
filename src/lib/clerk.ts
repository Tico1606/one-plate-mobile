import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY

console.log('🔑 [CLERK] Chave carregada:', publishableKey ? 'SIM' : 'NÃO')
console.log(
  '🔑 [CLERK] EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:',
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'SIM' : 'NÃO',
)
console.log(
  '🔑 [CLERK] CLERK_PUBLISHABLE_KEY:',
  process.env.CLERK_PUBLISHABLE_KEY ? 'SIM' : 'NÃO',
)

if (!publishableKey || publishableKey === 'pk_test_example_key') {
  console.warn(
    '⚠️ CLERK_PUBLISHABLE_KEY não configurada. Configure sua chave do Clerk para usar autenticação.',
  )
}

export const clerkConfig = {
  publishableKey,
  tokenCache,
  // Configurações específicas para React Native/Expo
  signInUrl: '/login',
  signUpUrl: '/signup',
  afterSignInUrl: '/(auth)/home',
  afterSignUpUrl: '/(auth)/home',
}

export { ClerkProvider }
