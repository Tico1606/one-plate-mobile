import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { TextInput } from 'react-native'

import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { type SignUpFormData, signUpSchema } from '@/lib/validations/auth'

interface SignUpFormProps {
  isLoading: boolean
  onSignUp: (data: SignUpFormData) => Promise<void>
  onSignUpWithGoogle: () => Promise<void>
}

export function SignUpForm({ isLoading, onSignUp, onSignUpWithGoogle }: SignUpFormProps) {
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <VStack space='md'>
      <VStack space='lg'>
        <Controller
          control={signUpForm.control}
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
        {signUpForm.formState.errors.email && (
          <Text className='text-red-500 text-sm'>
            {signUpForm.formState.errors.email.message}
          </Text>
        )}
      </VStack>

      <VStack space='lg'>
        <Controller
          control={signUpForm.control}
          name='password'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Senha'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoComplete='new-password'
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200'
            />
          )}
        />
        {signUpForm.formState.errors.password && (
          <Text className='text-red-500 text-sm'>
            {signUpForm.formState.errors.password.message}
          </Text>
        )}
      </VStack>

      <VStack space='lg'>
        <Controller
          control={signUpForm.control}
          name='confirmPassword'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Confirmar senha'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoComplete='new-password'
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200'
            />
          )}
        />
        {signUpForm.formState.errors.confirmPassword && (
          <Text className='text-red-500 text-sm'>
            {signUpForm.formState.errors.confirmPassword.message}
          </Text>
        )}
      </VStack>

      <VStack className='py-2' space='sm'>
        <Button
          onPress={signUpForm.handleSubmit(onSignUp)}
          className='bg-purple-500 rounded-lg'
          isDisabled={isLoading}
        >
          <ButtonText className='text-white font-semibold'>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </ButtonText>
        </Button>
      </VStack>

      {/* Separator e Google Sign Up */}
      <Text className='text-center text-gray-500 '>ou</Text>

      <Button
        onPress={onSignUpWithGoogle}
        isDisabled={isLoading}
        className='bg-white flex-row items-center justify-center rounded-lg border border-gray-300'
      >
        <Ionicons name='logo-google' size={20} color='#4285F4' />
        <ButtonText className='text-gray-700 font-medium'>Entrar com Google</ButtonText>
      </Button>
    </VStack>
  )
}
