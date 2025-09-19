import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native'

import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Heading } from '@/components/ui/heading'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import {
  type SignUpFormData,
  signUpSchema,
  type VerifyCodeFormData,
  verifyCodeSchema,
} from '@/lib/validations/auth'

interface SignUpPageProps {
  onSignUp: (data: SignUpFormData) => Promise<void>
  onVerifyCode: (data: VerifyCodeFormData) => Promise<void>
  onResendCode: () => Promise<void>
  onSignUpWithGoogle: () => Promise<void>
  onNavigateToLogin: () => void
  isLoading: boolean
  showCodeVerification: boolean
  userEmail: string
}

export function SignUpPage({
  onSignUp,
  onVerifyCode,
  onResendCode,
  onSignUpWithGoogle,
  onNavigateToLogin,
  isLoading,
  showCodeVerification,
  userEmail,
}: SignUpPageProps) {
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const codeForm = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  })

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
                {showCodeVerification ? 'Verificar código' : 'Criar conta'}
              </Heading>
              <Text className='text-center text-gray-600'>
                {showCodeVerification
                  ? `Enviamos um código de 6 dígitos para ${userEmail}`
                  : 'Preencha os dados para criar sua conta'}
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
                    control={signUpForm.control}
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
                  {signUpForm.formState.errors.email && (
                    <Text className='text-red-500 text-sm'>
                      {signUpForm.formState.errors.email.message}
                    </Text>
                  )}
                </VStack>

                <VStack space='sm'>
                  <Text className='text-sm font-medium text-gray-700'>Senha</Text>
                  <Controller
                    control={signUpForm.control}
                    name='password'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder='Insira sua senha'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        autoComplete='new-password'
                        className='border border-gray-300 rounded-lg px-3 py-2 bg-white'
                      />
                    )}
                  />
                  {signUpForm.formState.errors.password && (
                    <Text className='text-red-500 text-sm'>
                      {signUpForm.formState.errors.password.message}
                    </Text>
                  )}
                </VStack>

                <VStack space='sm'>
                  <Text className='text-sm font-medium text-gray-700'>
                    Confirmar senha
                  </Text>
                  <Controller
                    control={signUpForm.control}
                    name='confirmPassword'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder='Confirme sua senha'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        autoComplete='new-password'
                        className='border border-gray-300 rounded-lg px-3 py-2 bg-white'
                      />
                    )}
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <Text className='text-red-500 text-sm'>
                      {signUpForm.formState.errors.confirmPassword.message}
                    </Text>
                  )}
                </VStack>

                <Button
                  onPress={signUpForm.handleSubmit(onSignUp)}
                  className='mt-4'
                  isDisabled={isLoading}
                >
                  <ButtonText>
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </ButtonText>
                </Button>
              </VStack>
            )}

            {/* Divider e Google Sign Up - só aparece no formulário de cadastro */}
            {!showCodeVerification && (
              <>
                <HStack space='md' className='items-center my-4'>
                  <Divider className='flex-1' />
                  <Text className='text-gray-500'>ou</Text>
                  <Divider className='flex-1' />
                </HStack>

                <Button
                  variant='outline'
                  onPress={onSignUpWithGoogle}
                  isDisabled={isLoading}
                >
                  <ButtonText>Continuar com Google</ButtonText>
                </Button>
              </>
            )}

            {/* Sign In Link */}
            <HStack space='sm' className='justify-center mt-8'>
              <Text className='text-gray-600'>Já tem uma conta?</Text>
              <Pressable onPress={onNavigateToLogin}>
                <Text className='text-blue-600 font-medium'>Entre aqui</Text>
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
