import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import type { LoginFormData, VerifyCodeFormData } from '@/lib/validations/auth'

export function useLoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showCodeVerification, setShowCodeVerification] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const onSignIn = async (data: LoginFormData) => {
    if (!isLoaded) return

    try {
      setIsLoading(true)
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      if (result.status === 'needs_second_factor') {
        setUserEmail(data.email)
        setShowCodeVerification(true)
        Alert.alert(
          'Código enviado!',
          'Enviamos um código de verificação para seu email. Verifique sua caixa de entrada.',
        )
      } else if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(auth)/home' as any)
      } else {
        console.error('Sign in not complete')
      }
    } catch (err: any) {
      console.error('Error:', err.errors[0].longMessage)
      Alert.alert('Erro', err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyCode = async (data: VerifyCodeFormData) => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      const result = await signIn.attemptSecondFactor({
        strategy: 'phone_code',
        code: data.code,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(auth)/home' as any)
      } else {
        Alert.alert('Erro', 'Código inválido. Tente novamente.')
      }
    } catch (err: any) {
      console.error('Error:', err.errors[0].longMessage)
      Alert.alert('Erro', err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onResendCode = async () => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      await signIn.prepareSecondFactor({ strategy: 'phone_code' })
      Alert.alert('Sucesso', 'Código reenviado para seu email!')
    } catch (err: any) {
      console.error('Error:', err.errors[0].longMessage)
      Alert.alert('Erro', err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onSignInWithGoogle = async () => {
    if (!isLoaded) return

    try {
      setIsLoading(true)
      const result = await signIn.create({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(auth)/home' as any)
      } else if (result.status === 'needs_second_factor') {
        setUserEmail(result.identifier || '')
        setShowCodeVerification(true)
        Alert.alert(
          'Código enviado!',
          'Enviamos um código de verificação para seu email. Verifique sua caixa de entrada.',
        )
      }
    } catch (err: any) {
      console.error('Error:', err.errors[0].longMessage)
      Alert.alert('Erro', err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onNavigateToSignUp = () => {
    router.replace('/(public)/signup' as any)
  }

  return {
    // Dados
    isLoading,
    showCodeVerification,
    userEmail,

    // Handlers
    onSignIn,
    onVerifyCode,
    onResendCode,
    onSignInWithGoogle,
    onNavigateToSignUp,
  }
}
