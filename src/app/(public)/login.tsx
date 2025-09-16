import { useSignIn } from '@clerk/clerk-expo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native'

import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Heading } from '@/components/ui/heading'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import {
  type LoginFormData,
  loginSchema,
  type VerifyCodeFormData,
  verifyCodeSchema,
} from '@/lib/validations/auth'

export default function Login() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showCodeVerification, setShowCodeVerification] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const codeForm = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  })

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1'
    >
      <ScrollView className='flex-1 bg-white'>
        <Box className='flex-1 px-6 py-12'>
          <VStack space='lg' className='flex-1'>
            {/* Header */}
            <VStack space='sm' className='items-center mb-8'>
              <Heading size='2xl' className='text-center'>
                {showCodeVerification ? 'Verificar código' : 'Bem-vindo'}
              </Heading>
              <Text className='text-center text-gray-600'>
                {showCodeVerification
                  ? `Enviamos um código de 6 dígitos para ${userEmail}`
                  : 'Entre na sua conta para continuar'}
              </Text>
            </VStack>

            {/* Form */}
            {showCodeVerification ? (
              <VStack space='md'>
                <VStack space='sm'>
                  <Text className='text-sm font-medium text-gray-700'>
                    Código de verificação
                  </Text>
                  <Controller
                    control={codeForm.control}
                    name='code'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder='000000'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType='numeric'
                        maxLength={6}
                        textAlign='center'
                        className='border border-gray-300 rounded-lg px-3 py-3 bg-white text-lg tracking-widest'
                      />
                    )}
                  />
                  {codeForm.formState.errors.code && (
                    <Text className='text-red-500 text-sm'>
                      {codeForm.formState.errors.code.message}
                    </Text>
                  )}
                </VStack>

                <Button
                  onPress={codeForm.handleSubmit(onVerifyCode)}
                  className='mt-4'
                  isDisabled={isLoading}
                >
                  <ButtonText>
                    {isLoading ? 'Verificando...' : 'Verificar código'}
                  </ButtonText>
                </Button>

                <Button
                  variant='outline'
                  onPress={onResendCode}
                  isDisabled={isLoading}
                  className='mt-2'
                >
                  <ButtonText>Reenviar código</ButtonText>
                </Button>
              </VStack>
            ) : (
              <VStack space='md'>
                <VStack space='sm'>
                  <Text className='text-sm font-medium text-gray-700'>Email</Text>
                  <Controller
                    control={loginForm.control}
                    name='email'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder='Insira seu email'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoComplete='email'
                        className='border border-gray-300 rounded-lg px-3 py-2 bg-white'
                      />
                    )}
                  />
                  {loginForm.formState.errors.email && (
                    <Text className='text-red-500 text-sm'>
                      {loginForm.formState.errors.email.message}
                    </Text>
                  )}
                </VStack>

                <VStack space='sm'>
                  <Text className='text-sm font-medium text-gray-700'>Senha</Text>
                  <Controller
                    control={loginForm.control}
                    name='password'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder='Insira sua senha'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        autoComplete='password'
                        className='border border-gray-300 rounded-lg px-3 py-2 bg-white'
                      />
                    )}
                  />
                  {loginForm.formState.errors.password && (
                    <Text className='text-red-500 text-sm'>
                      {loginForm.formState.errors.password.message}
                    </Text>
                  )}
                </VStack>

                <Button
                  onPress={loginForm.handleSubmit(onSignIn)}
                  className='mt-4'
                  isDisabled={isLoading}
                >
                  <ButtonText>{isLoading ? 'Entrando...' : 'Entrar'}</ButtonText>
                </Button>
              </VStack>
            )}

            {/* Divider e Google Sign In - só aparece no formulário de login */}
            {!showCodeVerification && (
              <>
                <HStack space='md' className='items-center my-4'>
                  <Divider className='flex-1' />
                  <Text className='text-gray-500'>ou</Text>
                  <Divider className='flex-1' />
                </HStack>

                <Button
                  variant='outline'
                  onPress={onSignInWithGoogle}
                  isDisabled={isLoading}
                >
                  <ButtonText>Continuar com Google</ButtonText>
                </Button>
              </>
            )}

            {/* Sign Up Link */}
            <HStack space='sm' className='justify-center mt-8'>
              <Text className='text-gray-600'>Não tem uma conta?</Text>
              <Pressable
                onPress={() => {
                  router.replace('/(public)/signup' as any)
                }}
              >
                <Text className='text-blue-600 font-medium'>Cadastre-se</Text>
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
