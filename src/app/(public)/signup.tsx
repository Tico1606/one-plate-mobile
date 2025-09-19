import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import { SignUpPage } from '@/components'
import type { SignUpFormData, VerifyCodeFormData } from '@/lib/validations/auth'

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showCodeVerification, setShowCodeVerification] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const onSignUp = async (data: SignUpFormData) => {
    if (!isLoaded) return

    try {
      setIsLoading(true)
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      })

      if (result.status === 'missing_requirements') {
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
        console.error('Sign up not complete')
      }
    } catch (err: any) {
      console.error('Error:', err.errors[0].longMessage)
      Alert.alert('Erro', err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyCode = async (data: VerifyCodeFormData) => {
    if (!isLoaded || !signUp) return

    try {
      setIsLoading(true)
      const result = await signUp.attemptEmailAddressVerification({
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
    if (!isLoaded || !signUp) return

    try {
      setIsLoading(true)
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert('Sucesso', 'Código reenviado para seu email!')
    } catch (err: any) {
      console.error('Error:', err.errors[0].longMessage)
      Alert.alert('Erro', err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpWithGoogle = async () => {
    if (!isLoaded) return

    try {
      setIsLoading(true)
      const result = await signUp.create({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(auth)/home' as any)
      } else if (result.status === 'missing_requirements') {
        setUserEmail(result.emailAddress || '')
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

  return (
    <SignUpPage
      onSignUp={onSignUp}
      onVerifyCode={onVerifyCode}
      onResendCode={onResendCode}
      onSignUpWithGoogle={onSignUpWithGoogle}
      onNavigateToLogin={() => router.replace('/(public)/login' as any)}
      isLoading={isLoading}
      showCodeVerification={showCodeVerification}
      userEmail={userEmail}
    />
  )
}
