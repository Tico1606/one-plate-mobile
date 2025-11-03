import { Ionicons } from '@expo/vector-icons'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import type {
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyCodeFormData,
} from '@/lib/validations/auth'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { ResetPasswordForm } from './ResetPasswordForm'
import { VerifyResetCodeForm } from './VerifyResetCodeForm'

type Step = 'email' | 'code' | 'password'

interface ForgotPasswordViewProps {
  // Dados
  isLoading: boolean
  currentStep: Step
  userEmail: string

  // Handlers
  onSendCode: (data: ForgotPasswordFormData) => Promise<void>
  onVerifyCode: (data: VerifyCodeFormData) => Promise<void>
  onResetPassword: (data: ResetPasswordFormData) => Promise<void>
  onResendCode: () => Promise<void>
  onNavigateBack: () => void
}

export function ForgotPasswordView({
  isLoading,
  currentStep,
  userEmail,
  onSendCode,
  onVerifyCode,
  onResetPassword,
  onResendCode,
  onNavigateBack,
}: ForgotPasswordViewProps) {
  const getTitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Esqueceu a senha?'
      case 'code':
        return 'Verificar código'
      case 'password':
        return 'Redefinir senha'
    }
  }

  const getSubtitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Digite seu e-mail para receber o código de recuperação'
      case 'code':
        return 'Digite o código que enviamos para seu e-mail'
      case 'password':
        return 'Digite sua nova senha'
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1'
    >
      <ScrollView className='flex-1 bg-gray-100'>
        <Box className='flex-1 px-8 py-24'>
          <VStack space='lg' className='flex-1'>
            {/* Header */}
            <VStack space='sm' className='items-center my-12'>
              <Box className='w-16 h-16 bg-purple-500 rounded-full items-center justify-center mb-4'>
                <Ionicons name='lock-closed' size={32} color='white' />
              </Box>
              <Text className='text-2xl font-extrabold text-gray-900'>{getTitle()}</Text>
              <Text className='font-medium text-gray-600 text-center'>
                {getSubtitle()}
              </Text>
            </VStack>

            {/* Form */}
            {currentStep === 'email' && (
              <ForgotPasswordForm isLoading={isLoading} onSubmit={onSendCode} />
            )}

            {currentStep === 'code' && (
              <VerifyResetCodeForm
                userEmail={userEmail}
                isLoading={isLoading}
                onVerifyCode={onVerifyCode}
                onResendCode={onResendCode}
              />
            )}

            {currentStep === 'password' && (
              <ResetPasswordForm isLoading={isLoading} onSubmit={onResetPassword} />
            )}

            {/* Back to Login Link */}
            <HStack space='sm' className='justify-center mt-6'>
              <Pressable onPress={onNavigateBack}>
                <Text className='text-purple-500 font-medium underline'>
                  Voltar para login
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
