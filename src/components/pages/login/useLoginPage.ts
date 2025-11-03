import { useOAuth, useSignIn } from '@clerk/clerk-expo'
import * as LinkingExpo from 'expo-linking'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import { useCreateUserBackend } from '@/hooks'
import type { LoginFormData, VerifyCodeFormData } from '@/lib/validations/auth'

export function useLoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showCodeVerification, setShowCodeVerification] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { createUserInBackend } = useCreateUserBackend()

  // novo: guarda qual estratégia o sign-in exige
  const [secondFactorStrategy, setSecondFactorStrategy] = useState<
    'phone_code' | 'totp' | null
  >(null)
  const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null)

  // const safeErrMsg = (err: any) =>
  //   err?.errors?.[0]?.longMessage ?? err?.message ?? 'Erro desconhecido'

  const onSignIn = async (data: LoginFormData) => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      if (result.status === 'needs_second_factor') {
        setUserEmail(data.email)
        setShowCodeVerification(true)

        // result.supportedSecondFactors existe conforme docs
        const supported = (result.supportedSecondFactors ?? []) as any[]

        const phoneEntry = supported.find((s) => s.strategy === 'phone_code')
        const totpEntry = supported.find((s) => s.strategy === 'totp')

        if (phoneEntry) {
          // prepare para phone_code (envia SMS)
          // phoneEntry.phoneNumberId costuma existir para identificar o número do usuário
          const phoneId = phoneEntry.phoneNumberId ?? null
          setPhoneNumberId(phoneId)
          setSecondFactorStrategy('phone_code')

          await signIn.prepareSecondFactor({
            strategy: 'phone_code',
            ...(phoneId ? { phoneNumberId: phoneId } : {}),
          })

          Alert.alert('Código enviado', 'Enviamos um código via SMS para seu telefone.')
        } else if (totpEntry) {
          // totp -> app autenticador, não precisa preparar
          setSecondFactorStrategy('totp')
          setPhoneNumberId(null)
          Alert.alert(
            'Autenticação em 2 passos',
            'Abra seu app autenticador (Google Authenticator, Authy, etc.) e insira o código gerado.',
          )
        } else {
          // fallback: mensagem genérica
          setSecondFactorStrategy(null)
          Alert.alert(
            'Erro',
            'Segundo fator requerido, mas nenhum método suportado foi encontrado.',
          )
        }
      } else if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(auth)/home' as any)
      } else {
        // console.error('Sign in não finalizado', result)
        Alert.alert('Erro', 'Fluxo de login não finalizado. Por favor, tente novamente.')
      }
    } catch {
      // console.error('Error:', err)
      Alert.alert('Erro', 'Senha ou email incorretos. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyCode = async (data: VerifyCodeFormData) => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)

      if (secondFactorStrategy === 'phone_code') {
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
      } else if (secondFactorStrategy === 'totp') {
        const result = await signIn.attemptSecondFactor({
          strategy: 'totp',
          code: data.code,
        })

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          router.replace('/(auth)/home' as any)
        } else {
          Alert.alert('Erro', 'Código inválido. Tente novamente.')
        }
      } else {
        Alert.alert('Erro', 'Nenhuma estratégia de 2FA selecionada.')
      }
    } catch {
      // console.error('Error:', err)
      Alert.alert('Erro', 'Erro ao reenviar código. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const onResendCode = async () => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)

      if (secondFactorStrategy === 'phone_code') {
        if (!phoneNumberId) {
          // se não tiver phoneNumberId, tenta sem: Clerk pode usar o default
          await signIn.prepareSecondFactor({ strategy: 'phone_code' })
        } else {
          await signIn.prepareSecondFactor({
            strategy: 'phone_code',
            phoneNumberId,
          })
        }
        Alert.alert('Sucesso', 'Código reenviado via SMS.')
      } else if (secondFactorStrategy === 'totp') {
        // não existe "reenviar" para TOTP
        Alert.alert('Info', 'Para TOTP, abra seu app autenticador e use o código atual.')
      } else {
        Alert.alert('Erro', 'Nenhuma estratégia de 2FA ativa para reenviar código.')
      }
    } catch {
      // console.error('Error:', err)
      Alert.alert('Erro', 'Erro ao reenviar código. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignInWithGoogle = async () => {
    if (!isLoaded) return
    const redirectUrl = LinkingExpo.createURL('/(auth)/home')

    try {
      setIsLoading(true)
      console.log('🔄 [LOGIN-OAUTH] Iniciando login com Google...')

      const result = await startOAuthFlow({
        redirectUrl,
      })
      console.log('✅ [LOGIN-OAUTH] Resultado do OAuth:', result)

      if (result.createdSessionId) {
        console.log('✅ [LOGIN-OAUTH] Sessão criada com sucesso')

        // Aguardar mais tempo para garantir que o Clerk processou completamente a sessão
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Criar usuário no backend após OAuth login (caso seja um novo usuário)
        try {
          await createUserInBackend()
          console.log('✅ [LOGIN-OAUTH] Usuário criado no backend')
        } catch (error) {
          console.error('❌ [LOGIN-OAUTH] Erro ao criar usuário no backend:', error)
          // Não bloquear o fluxo se falhar a criação no backend
        }

        console.log(
          '🔄 [LOGIN-OAUTH] Aguardando estabilização da sessão antes de redirecionar...',
        )
        // Aguardar mais um pouco para garantir que o estado isSignedIn seja atualizado
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log('🔄 [LOGIN-OAUTH] Redirecionando para home...')
        router.replace('/(auth)/home' as any)
      } else {
        console.log('❌ [LOGIN-OAUTH] Falha ao criar sessão')
        Alert.alert('Erro', 'Não foi possível fazer login com Google')
      }
    } catch {
      // console.error('❌ [LOGIN-OAUTH] Erro no login com Google:', err)
      Alert.alert('Erro', 'Não foi possível fazer login com Google. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const onNavigateToSignUp = () => {
    router.replace('/(public)/signup' as any)
  }

  const onForgotPassword = () => {
    router.push('/(public)/forgot-password' as any)
  }

  return {
    isLoading,
    showCodeVerification,
    userEmail,
    onSignIn,
    onVerifyCode,
    onResendCode,
    onSignInWithGoogle,
    onNavigateToSignUp,
    onForgotPassword,
  }
}
