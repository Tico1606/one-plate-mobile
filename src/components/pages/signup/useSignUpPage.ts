import { useOAuth, useSignUp } from '@clerk/clerk-expo'
import * as LinkingExpo from 'expo-linking'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import { useCreateUserBackend } from '@/hooks'
import type { SignUpFormData, VerifyCodeFormData } from '@/lib/validations/auth'

export function useSignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showCodeVerification, setShowCodeVerification] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { createUserInBackend } = useCreateUserBackend()

  const safeErrMsg = (err: any) =>
    err?.errors?.[0]?.longMessage ?? err?.message ?? 'Erro desconhecido'

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
        Alert.alert('Código enviado!', 'Verifique seu email para concluir o cadastro.')
      } else if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })

        // Aguarda estabilização da sessão
        await new Promise((r) => setTimeout(r, 1000))

        try {
          await createUserInBackend()
        } catch (error) {
          console.error('❌ [SIGNUP] Erro ao criar usuário no backend:', error)
        }

        router.replace('/(auth)/home' as any)
      } else {
        console.error('Sign up não finalizado', result)
      }
    } catch (err: any) {
      console.error('Error:', safeErrMsg(err))
      Alert.alert('Erro', safeErrMsg(err))
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

        await new Promise((r) => setTimeout(r, 1000))
        try {
          await createUserInBackend()
        } catch (error) {
          console.error('❌ [SIGNUP-VERIFY] Erro ao criar usuário no backend:', error)
        }

        router.replace('/(auth)/home' as any)
      } else {
        Alert.alert('Erro', 'Código inválido. Tente novamente.')
      }
    } catch (err: any) {
      console.error('Error:', safeErrMsg(err))
      Alert.alert('Erro', safeErrMsg(err))
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
      console.error('Error:', safeErrMsg(err))
      Alert.alert('Erro', safeErrMsg(err))
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpWithGoogle = async () => {
    if (!isLoaded) return
    const redirectUrl = LinkingExpo.createURL('/(auth)/home')

    try {
      setIsLoading(true)
      console.log('🔄 [SIGNUP-OAUTH] Iniciando cadastro com Google...')
      const result = await startOAuthFlow({ redirectUrl })
      console.log('✅ [SIGNUP-OAUTH] Resultado do OAuth:', result)

      if (result?.createdSessionId) {
        await setActive({ session: result.createdSessionId })

        await new Promise((r) => setTimeout(r, 2000))
        try {
          await createUserInBackend()
          console.log('✅ [SIGNUP-OAUTH] Usuário criado no backend')
        } catch (error) {
          console.error('❌ [SIGNUP-OAUTH] Erro ao criar usuário no backend:', error)
        }

        router.replace('/(auth)/home' as any)
      } else {
        Alert.alert('Erro', 'Não foi possível fazer cadastro com Google')
      }
    } catch (err: any) {
      console.error('❌ [SIGNUP-OAUTH] Erro no cadastro com Google:', err)
      Alert.alert('Erro', 'Não foi possível fazer cadastro com Google. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const onNavigateToLogin = () => {
    router.replace('/(public)/login' as any)
  }

  return {
    isLoading,
    showCodeVerification,
    userEmail,
    onSignUp,
    onVerifyCode,
    onResendCode,
    onSignUpWithGoogle,
    onNavigateToLogin,
  }
}
