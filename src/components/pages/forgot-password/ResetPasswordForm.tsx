import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { TextInput } from 'react-native'

import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { type ResetPasswordFormData, resetPasswordSchema } from '@/lib/validations/auth'

interface ResetPasswordFormProps {
  isLoading: boolean
  onSubmit: (data: ResetPasswordFormData) => Promise<void>
}

export function ResetPasswordForm({ isLoading, onSubmit }: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  return (
    <VStack space='md'>
      <VStack space='lg'>
        <Controller
          control={form.control}
          name='newPassword'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Nova senha'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoComplete='password-new'
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200'
            />
          )}
        />
        {form.formState.errors.newPassword && (
          <Text className='text-red-500 text-sm'>
            {form.formState.errors.newPassword.message}
          </Text>
        )}
      </VStack>

      <VStack space='lg'>
        <Controller
          control={form.control}
          name='confirmPassword'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder='Confirmar nova senha'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoComplete='password-new'
              className='bg-white rounded-lg px-4 py-4 text-gray-900 border border-gray-200'
            />
          )}
        />
        {form.formState.errors.confirmPassword && (
          <Text className='text-red-500 text-sm'>
            {form.formState.errors.confirmPassword.message}
          </Text>
        )}
      </VStack>

      <Button
        onPress={form.handleSubmit(onSubmit)}
        className='bg-purple-500 rounded-lg mt-4'
        isDisabled={isLoading}
      >
        <ButtonText className='text-white font-semibold'>
          {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
        </ButtonText>
      </Button>
    </VStack>
  )
}
