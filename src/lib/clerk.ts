import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

// if (!publishableKey || publishableKey === 'pk_test_example_key') {
//   console.warn(
//     '⚠️ CLERK_PUBLISHABLE_KEY não configurada. Configure sua chave do Clerk para usar autenticação.',
//   )
// }

export const clerkConfig = {
  publishableKey,
  tokenCache,
}

export { ClerkProvider }
