import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { TextInput } from 'react-native'

import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { type LoginFormData, loginSchema } from '@/lib/validations/auth'

interface LoginFormProps {
  isLoading: boolean
  onSignIn: (data: LoginFormData) => Promise<void>
  onSignInWithGoogle: () => Promise<void>
}

export function LoginForm({ isLoading, onSignIn, onSignInWithGoogle }: LoginFormProps) {
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <VStack space='md'>
      <VStack space='lg'>
        <Controller
          control={loginForm.control}
          name='email'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='E-mail'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='email'
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200'
            />
          )}
        />
        {loginForm.formState.errors.email && (
          <Text className='text-red-500 text-sm'>
            {loginForm.formState.errors.email.message}
          </Text>
        )}
      </VStack>

      <VStack space='lg'>
        <Controller
          control={loginForm.control}
          name='password'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Senha'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoComplete='password'
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200'
            />
          )}
        />
        {loginForm.formState.errors.password && (
          <Text className='text-red-500 text-sm'>
            {loginForm.formState.errors.password.message}
          </Text>
        )}
      </VStack>

      <VStack className='py-2' space='sm'>
        <Button
          onPress={loginForm.handleSubmit(onSignIn)}
          className='bg-purple-500 rounded-lg'
          isDisabled={isLoading}
        >
          <ButtonText className='text-white font-semibold'>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </ButtonText>
        </Button>

        <Pressable className='items-center'>
          <Text className='text-gray-600 text-sm text-center mt-4'>
            Esqueceu a senha?
          </Text>
        </Pressable>
      </VStack>

      {/* Separator e Google Sign In */}
      <Text className='text-center text-gray-500 '>ou</Text>

      <Button
        onPress={onSignInWithGoogle}
        isDisabled={isLoading}
        className='bg-white flex-row items-center justify-center rounded-lg border border-gray-300'
      >
        <Ionicons name='logo-google' size={20} color='#4285F4' />
        <ButtonText className='text-gray-700 font-medium'>Entrar com Google</ButtonText>
      </Button>
    </VStack>
  )
}
