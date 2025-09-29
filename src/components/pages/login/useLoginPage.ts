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

  // novo: guarda qual estratégia o sign-in exige
  const [secondFactorStrategy, setSecondFactorStrategy] = useState<
    'phone_code' | 'totp' | null
  >(null)
  const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null)

  const safeErrMsg = (err: any) =>
    err?.errors?.[0]?.longMessage ?? err?.message ?? 'Erro desconhecido'

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
        console.error('Sign in não finalizado', result)
        Alert.alert('Erro', 'Fluxo de login não finalizado.')
      }
    } catch (err: any) {
      console.error('Error:', err)
      Alert.alert('Erro', safeErrMsg(err))
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
    } catch (err: any) {
      console.error('Error:', err)
      Alert.alert('Erro', safeErrMsg(err))
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
    } catch (err: any) {
      console.error('Error:', err)
      Alert.alert('Erro', safeErrMsg(err))
    } finally {
      setIsLoading(false)
    }
  }

  const onSignInWithGoogle = async () => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      const result = await signIn.create({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback', // em mobile, verifique se precisa ser um deep link absoluto
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(auth)/home' as any)
        return
      }

      // se precisar 2FA depois do SSO, reaplica a mesma lógica de cima
      if (result.status === 'needs_second_factor') {
        const supported = (result.supportedSecondFactors ?? []) as any[]
        const phoneEntry = supported.find((s) => s.strategy === 'phone_code')
        const totpEntry = supported.find((s) => s.strategy === 'totp')

        if (phoneEntry) {
          setSecondFactorStrategy('phone_code')
          setPhoneNumberId(phoneEntry.phoneNumberId ?? null)
          await signIn.prepareSecondFactor({
            strategy: 'phone_code',
            ...(phoneEntry.phoneNumberId
              ? { phoneNumberId: phoneEntry.phoneNumberId }
              : {}),
          })
          setShowCodeVerification(true)
          Alert.alert('Código enviado', 'Enviamos um código via SMS para seu telefone.')
        } else if (totpEntry) {
          setSecondFactorStrategy('totp')
          setShowCodeVerification(true)
          Alert.alert(
            'Autenticação em 2 passos',
            'Abra seu app autenticador (Google Authenticator, Authy, etc.) e insira o código gerado.',
          )
        } else {
          Alert.alert(
            'Erro',
            'Segundo fator requerido, mas nenhum método suportado foi encontrado.',
          )
        }
      }
    } catch (err: any) {
      console.error('Error:', err)
      Alert.alert('Erro', safeErrMsg(err))
    } finally {
      setIsLoading(false)
    }
  }

  const onNavigateToSignUp = () => {
    router.replace('/(public)/signup' as any)
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
  }
}
