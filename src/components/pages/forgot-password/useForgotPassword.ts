import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import type {
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyCodeFormData,
} from '@/lib/validations/auth'

type Step = 'email' | 'code' | 'password'

export function useForgotPassword() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('email')
  const [userEmail, setUserEmail] = useState('')

  const safeErrMsg = (err: any) =>
    err?.errors?.[0]?.longMessage ?? err?.message ?? 'Erro desconhecido'

  const onSendCode = async (data: ForgotPasswordFormData) => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      // Clerk: inicia o fluxo de reset de senha enviando código por email
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      })

      setUserEmail(data.email)
      setCurrentStep('code')
      Alert.alert('Sucesso', 'Código enviado para seu e-mail!')
    } catch (error: any) {
      console.error('Error sending reset code:', error)
      Alert.alert('Erro', safeErrMsg(error))
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyCode = async (data: VerifyCodeFormData) => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      // Clerk: verifica o código de reset
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
      })

      // Se o código é válido, permite ir para a próxima etapa
      if (result.status === 'needs_new_password') {
        setCurrentStep('password')
        Alert.alert('Sucesso', 'Código verificado! Agora defina sua nova senha.')
      } else {
        Alert.alert('Erro', 'Código inválido. Tente novamente.')
      }
    } catch (error: any) {
      console.error('Error verifying code:', error)
      Alert.alert('Erro', safeErrMsg(error))
    } finally {
      setIsLoading(false)
    }
  }

  const onResetPassword = async (data: ResetPasswordFormData) => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      // Clerk: redefine a senha
      const result = await signIn.resetPassword({
        password: data.newPassword,
        signOutOfOtherSessions: true,
      })

      if (result.status === 'complete') {
        // Opcional: fazer login automático após reset
        await setActive({ session: result.createdSessionId })

        Alert.alert('Sucesso', 'Senha redefinida com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              // Redireciona para home se fez login automático, ou para login
              router.replace('/(auth)/home' as any)
            },
          },
        ])
      } else {
        Alert.alert('Erro', 'Não foi possível redefinir a senha. Tente novamente.')
      }
    } catch (error: any) {
      console.error('Error resetting password:', error)
      Alert.alert('Erro', safeErrMsg(error))
    } finally {
      setIsLoading(false)
    }
  }

  const onResendCode = async () => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      // Clerk: reenvia o código
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: userEmail,
      })

      Alert.alert('Sucesso', 'Código reenviado para seu e-mail!')
    } catch (error: any) {
      console.error('Error resending code:', error)
      Alert.alert('Erro', safeErrMsg(error))
    } finally {
      setIsLoading(false)
    }
  }

  const onNavigateBack = () => {
    router.replace('/(public)/login' as any)
  }

  return {
    isLoading,
    currentStep,
    userEmail,
    onSendCode,
    onVerifyCode,
    onResetPassword,
    onResendCode,
    onNavigateBack,
  }
}
