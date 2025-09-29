import { Ionicons } from '@expo/vector-icons'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type { LoginFormData, VerifyCodeFormData } from '@/lib/validations/auth'
import { LoginForm } from './LoginForm'
import { VerifyCodeForm } from './VerifyCodeForm'

interface LoginViewProps {
  // Dados
  isLoading: boolean
  showCodeVerification: boolean
  userEmail: string

  // Handlers
  onSignIn: (data: LoginFormData) => Promise<void>
  onVerifyCode: (data: VerifyCodeFormData) => Promise<void>
  onResendCode: () => Promise<void>
  onSignInWithGoogle: () => Promise<void>
  onNavigateToSignUp: () => void
}

export function LoginView({
  isLoading,
  showCodeVerification,
  userEmail,
  onSignIn,
  onVerifyCode,
  onResendCode,
  onSignInWithGoogle,
  onNavigateToSignUp,
}: LoginViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1'
    >
      <ScrollView className='flex-1 bg-gray-100'>
        <Box className='flex-1 px-8 py-16'>
          <VStack space='lg' className='flex-1'>
            {/* Logo */}
            <VStack space='sm' className='items-center my-12'>
              <Box className='w-16 h-16 bg-purple-500 rounded-full items-center justify-center mb-4'>
                <Ionicons name='restaurant' size={32} color='white' />
              </Box>
              <Text className='text-2xl font-extrabold text-gray-900'>
                Bem-vindo de volta!
              </Text>
              <Text className='font-medium text-gray-600 text-center'>
                Faça login para continuar
              </Text>
            </VStack>

            {/* Form */}
            {showCodeVerification ? (
              <VerifyCodeForm
                userEmail={userEmail}
                isLoading={isLoading}
                onVerifyCode={onVerifyCode}
                onResendCode={onResendCode}
              />
            ) : (
              <LoginForm
                isLoading={isLoading}
                onSignIn={onSignIn}
                onSignInWithGoogle={onSignInWithGoogle}
              />
            )}

            {/* Sign Up Link */}
            <HStack space='sm' className='justify-center mt-12'>
              <Text className='text-gray-600'>Não tem uma conta?</Text>
              <Pressable onPress={onNavigateToSignUp}>
                <Text className='text-purple-500 font-medium underline'>Cadastre-se</Text>
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
